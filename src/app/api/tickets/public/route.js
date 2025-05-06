import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { pool } from '@/lib/db';

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

    console.log('GET /api/tickets/public - User:', session.user.email);

    // Query to get tickets for the current user
    const query = `
      SELECT t.*
      FROM tickets t
      WHERE t.user_email = $1 OR t.user_id = (SELECT user_id FROM users WHERE email = $1)
      ORDER BY t.created_at DESC
    `;
    
    const params = [session.user.email];

    const result = await pool.query(query, params)
      .catch(err => {
        throw new Error(`Database query failed: ${err.message}`);
      });

    console.log(`Found ${result.rows.length} tickets for user ${session.user.email}`);

    // Return tickets directly (consistent format)
    return NextResponse.json(result.rows);
  } catch (error) {
    return handleDbError(error, 'GET /api/tickets/public');
  }
}