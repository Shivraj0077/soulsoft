import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    console.log(`GET /api/jobs/[jobId]: Received jobId = ${params.jobId}, type = ${typeof params.jobId}`);
    const jobId = parseInt(params.jobId, 10);
    if (isNaN(jobId) || jobId <= 0) {
      console.error(`GET /api/jobs/[jobId]: Invalid job ID '${params.jobId}'`);
      return NextResponse.json({ error: 'Invalid job ID' }, { status: 400 });
    }
    console.log(`GET /api/jobs/${jobId}: Fetching job`);
    const result = await pool.query(
      'SELECT job_id, title, location, salary_range, employment_type, description, skills_required, posted_date, deadline_date FROM jobs WHERE job_id = $1',
      [jobId]
    );
    if (result.rows.length === 0) {
      console.log(`GET /api/jobs/${jobId}: Job not found`);
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    const job = {
      ...result.rows[0],
      job_id: parseInt(result.rows[0].job_id, 10),
    };
    console.log(`GET /api/jobs/${jobId}: Found job`, { job_id: job.job_id, title: job.title });
    return NextResponse.json({ job });
  } catch (error) {
    console.error(`GET /api/jobs/[jobId]: Error fetching job`, {
      message: error.message,
      stack: error.stack,
      jobId: params.jobId,
    });
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    console.log(`DELETE /api/jobs/[jobId]: Received jobId = ${params.jobId}, type = ${typeof params.jobId}`);
    const session = await getServerSession(authOptions);
    if (!session) {
      console.error('DELETE /api/jobs/[jobId]: Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userResult = await pool.query(
      'SELECT r.recruiter_id FROM users u JOIN recruiters r ON u.user_id = r.user_id WHERE u.email = $1',
      [session.user.email]
    );
    if (userResult.rows.length === 0) {
      console.error(`DELETE /api/jobs/[jobId]: Recruiter not found for email ${session.user.email}`);
      return NextResponse.json({ error: 'Recruiter not found' }, { status: 404 });
    }
    
    const jobId = parseInt(params.jobId, 10);
    if (isNaN(jobId) || jobId <= 0) {
      console.error(`DELETE /api/jobs/[jobId]: Invalid job ID '${params.jobId}'`);
      return NextResponse.json({ error: 'Invalid job ID' }, { status: 400 });
    }
    
    console.log(`DELETE /api/jobs/${jobId}: Attempting to delete job`);
    
    const checkResult = await pool.query('SELECT job_id FROM jobs WHERE job_id = $1', [jobId]);
    if (checkResult.rows.length === 0) {
      console.log(`DELETE /api/jobs/${jobId}: Job not found`);
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    
    const deleteApplicationsResult = await pool.query('DELETE FROM applications WHERE job_id = $1 RETURNING application_id', [jobId]);
    console.log(`DELETE /api/jobs/${jobId}: Deleted ${deleteApplicationsResult.rowCount} applications`);
    
    const result = await pool.query('DELETE FROM jobs WHERE job_id = $1 RETURNING job_id', [jobId]);
    if (result.rows.length === 0) {
      console.error(`DELETE /api/jobs/${jobId}: Job not found after application deletion`);
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    
    console.log(`DELETE /api/jobs/${jobId}: Successfully deleted job`);
    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error(`DELETE /api/jobs/[jobId]: Error deleting job`, {
      message: error.message,
      stack: error.stack,
      jobId: params.jobId,
    });
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}