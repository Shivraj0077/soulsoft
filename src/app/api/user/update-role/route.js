import { pool } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Only allow server-side calls for security
    const requestUrl = new URL(request.url);
    const host = requestUrl.host;
    
    if (!host.includes('localhost') && !request.headers.get('x-middleware-request')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { email, role } = await request.json();
    
    if (!email || !role || !['recruiter', 'applicant'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }
    
    // Update the user's role
    const userResult = await pool.query(
      'UPDATE users SET role = $1 WHERE email = $2 RETURNING user_id, role',
      [role, email]
    );
    
    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    const userId = userResult.rows[0].user_id;
    
    // Ensure the appropriate role-specific record exists
    if (role === 'recruiter') {
      // Check if recruiter record already exists
      const recruiterCheck = await pool.query(
        'SELECT recruiter_id FROM recruiters WHERE user_id = $1',
        [userId]
      );
      
      if (recruiterCheck.rows.length === 0) {
        // Create recruiter record
        await pool.query(
          'INSERT INTO recruiters (user_id) VALUES ($1)',
          [userId]
        );
      }
    } else if (role === 'applicant') {
      // Check if applicant record already exists
      const applicantCheck = await pool.query(
        'SELECT applicant_id FROM applicants WHERE user_id = $1',
        [userId]
      );
      
      if (applicantCheck.rows.length === 0) {
        // Create applicant record
        await pool.query(
          'INSERT INTO applicants (user_id) VALUES ($1)',
          [userId]
        );
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `User role updated to ${role}`,
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}