import { pool } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      console.error('GET /api/applications/user: Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the user is an applicant
    const userResult = await pool.query(
      'SELECT a.applicant_id FROM users u JOIN applicants a ON u.user_id = a.user_id WHERE u.email = $1',
      [session.user.email]
    );

    if (userResult.rows.length === 0) {
      console.error(`GET /api/applications/user: Applicant not found for email ${session.user.email}`);
      return NextResponse.json({ error: 'Applicant not found' }, { status: 404 });
    }

    const applicantId = userResult.rows[0].applicant_id;
    console.log(`GET /api/applications/user: Fetching applications for applicant_id = ${applicantId}`);

    // Fetch applications for the applicant
    const result = await pool.query(
      `SELECT a.application_id, a.job_id, a.resume_url, a.cover_letter, a.applied_date, a.application_status
       FROM applications a
       WHERE a.applicant_id = $1
       ORDER BY a.applied_date DESC`,
      [applicantId]
    );

    const applications = result.rows.map(app => ({
      ...app,
      job_id: parseInt(app.job_id, 10), // Ensure job_id is an integer
      application_id: parseInt(app.application_id, 10), // Ensure application_id is an integer
    }));

    console.log(`GET /api/applications/user: Fetched ${applications.length} applications for ${session.user.email}`);
    return NextResponse.json({ applications });
  } catch (error) {
    console.error('GET /api/applications/user: Error fetching applications', {
      message: error.message,
      stack: error.stack,
      email: session?.user?.email || 'unknown',
    });
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}