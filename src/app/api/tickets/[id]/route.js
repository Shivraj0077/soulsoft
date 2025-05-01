import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { pool } from '@/lib/db';
import { notifyUserAboutStatusChange } from '@/lib/notification';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await params to resolve the dynamic route parameter
    const { id } = await params;
    const ticketId = parseInt(id, 10);
    if (isNaN(ticketId)) {
      return NextResponse.json({ error: 'Invalid ticket ID' }, { status: 400 });
    }

    let ticketQuery, ticketParams;

    if (session.user.role === 'admin') {
      ticketQuery = `
        SELECT t.ticket_id, t.title, t.description, t.problem_type, t.product_service_name, 
               t.status, t.image_url, t.created_at, t.updated_at, u.name, u.email
        FROM tickets t
        JOIN users u ON t.user_id = u.user_id
        WHERE t.ticket_id = $1
      `;
      ticketParams = [ticketId];
    } else {
      ticketQuery = `
        SELECT t.ticket_id, t.title, t.description, t.problem_type, t.product_service_name, 
               t.status, t.image_url, t.created_at, t.updated_at
        FROM tickets t
        WHERE t.ticket_id = $1 AND t.user_id = (SELECT user_id FROM users WHERE email = $2)
      `;
      ticketParams = [ticketId, session.user.email];
    }

    const ticketResult = await pool.query(ticketQuery, ticketParams);
    if (ticketResult.rows.length === 0) {
      return NextResponse.json({ error: 'Ticket not found or unauthorized' }, { status: 404 });
    }

    const updatesQuery = `
      SELECT update_id, previous_status, new_status, comment, updated_by_name, created_at
      FROM ticket_updates
      WHERE ticket_id = $1
      ORDER BY created_at DESC
    `;
    const updatesResult = await pool.query(updatesQuery, [ticketId]);

    return NextResponse.json({
      ticket: ticketResult.rows[0],
      updates: updatesResult.rows,
    });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await params to resolve the dynamic route parameter
    const { id } = await params;
    const ticketId = parseInt(id, 10);
    if (isNaN(ticketId)) {
      return NextResponse.json({ error: 'Invalid ticket ID' }, { status: 400 });
    }

    const { status, comment } = await request.json();

    // Validate status
    if (!['in_progress', 'completed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const ticketResult = await client.query(
        'SELECT status FROM tickets WHERE ticket_id = $1',
        [ticketId]
      );
      if (ticketResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
      }

      const previousStatus = ticketResult.rows[0].status;
      if (previousStatus === status) {
        await client.query('ROLLBACK');
        return NextResponse.json({ error: 'Status unchanged' }, { status: 400 });
      }

      await client.query(
        'UPDATE tickets SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE ticket_id = $2',
        [status, ticketId]
      );

      const adminResult = await client.query(
        'SELECT name FROM admins WHERE email = $1',
        [session.user.email]
      );
      const adminName = adminResult.rows[0]?.name || session.user.name;

      await client.query(
        'INSERT INTO ticket_updates (ticket_id, admin_id, previous_status, new_status, comment, updated_by_name, created_at) VALUES ($1, (SELECT admin_id FROM admins WHERE email = $2), $3, $4, $5, $6, CURRENT_TIMESTAMP)',
        [ticketId, session.user.email, previousStatus, status, comment || null, adminName]
      );

      await client.query('COMMIT');

      // Send notification to user
      await notifyUserAboutStatusChange(ticketId, client);

      return NextResponse.json({ success: true });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating ticket:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}