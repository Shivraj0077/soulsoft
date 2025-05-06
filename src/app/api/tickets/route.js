import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { pool } from '@/lib/db';
import { uploadToCloudflare } from '@/lib/cloudflare';
import { notifyAdminsAboutNewTicket, notifyUserAboutTicket } from '@/lib/notification';

// Helper function to handle database errors
const handleDbError = (error, operation) => {
  console.error(`Error during ${operation}:`, error);
  return NextResponse.json({ 
    error: 'Database error', 
    details: error.message 
  }, { status: 500 });
};

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('GET /api/tickets - User:', session.user.email);

    let query, params;
    if (session.user.role === 'admin' || ADMIN_EMAILS.includes(session.user.email)) {
      query = `
        SELECT t.*, u.name, u.email, u.phone_number
        FROM tickets t
        LEFT JOIN users u ON t.user_id = u.user_id
        ORDER BY t.created_at DESC
      `;
      params = [];
    } else {
      query = `
        SELECT t.*
        FROM tickets t
        WHERE t.user_id = (SELECT user_id FROM users WHERE email = $1)
        ORDER BY t.created_at DESC
      `;
      params = [session.user.email];
    }

    const result = await pool.query(query, params)
      .catch(err => {
        throw new Error(`Database query failed: ${err.message}`);
      });

    // Log the result for debugging
    console.log(`Found ${result.rows.length} tickets`);

    // Return the tickets directly (consistent format)
    return NextResponse.json(result.rows);
  } catch (error) {
    return handleDbError(error, 'GET /api/tickets');
  }
}

// Define admin emails for direct access in this file
const ADMIN_EMAILS = [
  'admin1@example.com',
  'admin2@example.com',
  'shivrajpawar0077@gmail.com',
];

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    
    // Validate required fields
    const title = formData.get('title');
    const description = formData.get('description');
    const problemType = formData.get('problem_type');
    const productServiceName = formData.get('product_service_name');

    // Validate required fields
    if (!title || !description || !problemType || !productServiceName) {
      return NextResponse.json({ 
        error: 'Missing required fields. All fields are mandatory.' 
      }, { status: 400 });
    }

    // Validate problem_type matches constraint
    if (!['product', 'service'].includes(problemType)) {
      return NextResponse.json({ 
        error: 'Invalid problem type. Must be either "product" or "service"' 
      }, { status: 400 });
    }

    // Get user details including phone
    const userResult = await pool.query(
      'SELECT user_id, phone_number FROM users WHERE email = $1',
      [session.user.email]
    ).catch(err => {
      throw new Error(`User lookup failed: ${err.message}`);
    });

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { user_id, phone_number } = userResult.rows[0];

    // Handle image upload if present
    const image = formData.get('image');
    let imageUrl = null;
    if (image) {
      imageUrl = await uploadToCloudflare(image, 'tickets');
    }

    const result = await pool.query(
      `INSERT INTO tickets (
        user_id,
        title,
        description,
        problem_type,
        product_service_name,
        status,
        image_url,
        user_email,
        user_phone,
        user_name
      ) VALUES ($1, $2, $3, $4, $5, 'raised', $6, $7, $8, $9)
      RETURNING ticket_id`,
      [
        user_id,
        title,
        description,
        problemType,
        productServiceName,
        imageUrl,
        session.user.email,
        phone_number || null,
        session.user.name
      ]
    ).catch(err => {
      throw new Error(`Ticket creation failed: ${err.message}`);
    });

    const ticketId = result.rows[0].ticket_id;

    // Notify admins about new ticket
    await notifyAdminsAboutNewTicket(ticketId, pool)
      .catch(err => console.error('Failed to notify admins:', err));

    // Notify user about ticket creation
    await notifyUserAboutTicket({
      email: session.user.email,
      name: session.user.name,
      ticketId,
      title,
      description,
      problemType,
      productServiceName
    }).catch(err => console.error('Failed to notify user:', err));

    return NextResponse.json({
      success: true,
      ticketId: ticketId
    });

  } catch (error) {
    return handleDbError(error, 'POST /api/tickets');
  }
}