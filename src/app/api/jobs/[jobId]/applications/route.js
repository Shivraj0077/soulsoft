import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { pool } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      console.error(`GET /api/jobs/[jobId]/applications: Unauthorized access attempt`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'recruiter') {
      console.error(`GET /api/jobs/[jobId]/applications: Non-recruiter access attempt by ${session.user.email}`);
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const jobId = parseInt(params.jobId, 10);
    if (isNaN(jobId) || jobId <= 0) {
      console.error(`GET /api/jobs/[jobId]/applications: Invalid job ID '${params.jobId}'`);
      return NextResponse.json({ error: 'Invalid job ID' }, { status: 400 });
    }

    console.log(`GET /api/jobs/${jobId}/applications: Fetching applications`);

    // Fetch applications for the job
    const result = await pool.query(
      `
      SELECT 
        a.application_id,
        a.job_id,
        a.applicant_id,
        a.resume_url,
        a.cover_letter,
        a.applied_date,
        a.application_status,
        u.name AS applicant_name,
        u.email AS applicant_email
      FROM applications a
      JOIN applicants ap ON a.applicant_id = ap.applicant_id
      JOIN users u ON ap.user_id = u.user_id
      WHERE a.job_id = $1
      ORDER BY a.applied_date DESC
      `,
      [jobId]
    );

    const applications = result.rows.map((row) => ({
      application_id: parseInt(row.application_id, 10),
      job_id: parseInt(row.job_id, 10),
      applicant_id: parseInt(row.applicant_id, 10),
      resume_url: row.resume_url,
      cover_letter: row.cover_letter,
      applied_date: row.applied_date,
      application_status: row.application_status,
      applicant_name: row.applicant_name,
      applicant_email: row.applicant_email,
    }));

    console.log(`GET /api/jobs/${jobId}/applications: Found ${applications.length} applications`);

    return NextResponse.json({ applications });
  } catch (error) {
    console.error(`GET /api/jobs/[jobId]/applications: Error fetching applications`, {
      message: error.message,
      stack: error.stack,
      jobId: params.jobId,
    });
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}