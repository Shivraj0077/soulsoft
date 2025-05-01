import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { pool } from '@/lib/db';


export async function GET(request, { params }) {
  let session;
  try {
    session = await getServerSession(authOptions);
    if (!session) {
      console.error('GET /api/applications/[id]: Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const applicationId = parseInt(params.applicationId, 10);
    if (isNaN(applicationId) || applicationId <= 0) {
      console.error(`GET /api/applications/[id]: Invalid application ID ${params.applicationId}`);
      return NextResponse.json({ error: 'Invalid application ID' }, { status: 400 });
    }
    // First get the user's applicant_id
    const applicantResult = await pool.query(
      `SELECT a.applicant_id 
       FROM applicants a 
       JOIN users u ON a.user_id = u.user_id 
       WHERE u.email = $1`,
      [session.user.email]
    );

    if (applicantResult.rows.length === 0) {
      return NextResponse.json({ error: 'Applicant profile not found' }, { status: 404 });
    }

    const applicantId = applicantResult.rows[0].applicant_id;

    // Now fetch the application with job details, ensuring it belongs to this applicant
    const result = await pool.query(`
      SELECT 
        a.application_id,
        a.job_id,
        a.applied_date,
        a.application_status,
        a.resume_url,
        a.cover_letter,
        j.title,
        j.description,
        j.location,
        j.salary_range,
        j.employment_type,
        j.posted_date
      FROM applications a
      INNER JOIN jobs j ON a.job_id = j.job_id
      WHERE a.application_id = $1 AND a.applicant_id = $2
    `, [applicationId, applicantId]);

    if (result.rows.length === 0) {
      console.error(`GET /api/applications/[id]: Application ${applicationId} not found or unauthorized`);
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const application = {
      ...result.rows[0],
      applied_date: result.rows[0].applied_date.toISOString(),
      posted_date: result.rows[0].posted_date?.toISOString()
    };

    return NextResponse.json({
      success: true,
      application
    });

  } catch (error) {
    console.error('GET /api/applications/[id]: Database error', {
      message: error.message,
      stack: error.stack,
      email: session?.user?.email || 'unknown'
    });

    return NextResponse.json(
      { error: 'Failed to fetch application', details: error.message },
      { status: 500 }
    );
  }
}