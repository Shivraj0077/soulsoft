import { pool } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the user is a recruiter
    const userResult = await pool.query(
      'SELECT r.recruiter_id FROM users u JOIN recruiters r ON u.user_id = r.user_id WHERE u.email = $1',
      [session.user.email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'Recruiter not found' }, { status: 404 });
    }

    const jobId = parseInt(params.jobId, 10);
    // Fetch applications for the job
    const result = await pool.query(
      `SELECT a.*, u.email AS applicant_email, u.name AS applicant_name
       FROM applications a
       JOIN applicants ap ON a.applicant_id = ap.applicant_id
       JOIN users u ON ap.user_id = u.user_id
       WHERE a.job_id = $1
       ORDER BY a.applied_date DESC`,
      [jobId]
    );

    return NextResponse.json({ applications: result.rows });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}