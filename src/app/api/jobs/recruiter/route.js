import { pool } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      console.error('GET /api/jobs/recruiter: Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userResult = await pool.query(
      'SELECT r.recruiter_id FROM users u JOIN recruiters r ON u.user_id = r.user_id WHERE u.email = $1',
      [session.user.email]
    );

    if (userResult.rows.length === 0) {
      console.error(`GET /api/jobs/recruiter: Recruiter not found for email ${session.user.email}`);
      return NextResponse.json({ error: 'Recruiter not found' }, { status: 404 });
    }

    const result = await pool.query('SELECT * FROM jobs ORDER BY posted_date DESC');
    const jobs = result.rows.map(job => ({
      ...job,
      job_id: parseInt(job.job_id, 10),
    }));
    console.log(`GET /api/jobs/recruiter: Fetched ${jobs.length} jobs for ${session.user.email}`, jobs.map(j => ({
      job_id: j.job_id,
      title: j.title,
    })));

    return NextResponse.json({ jobs }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('GET /api/jobs/recruiter: Error fetching jobs', {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}