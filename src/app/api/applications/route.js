import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { pool } from '@/lib/db';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      console.error('POST /api/applications: Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { job_id, resume_url, cover_letter } = data;
    console.log(`POST /api/applications: Received job_id = ${job_id}, resume_url = ${resume_url}`);

    if (!job_id || isNaN(parseInt(job_id, 10)) || parseInt(job_id, 10) <= 0) {
      console.error(`POST /api/applications: Invalid job_id '${job_id}'`);
      return NextResponse.json({ error: 'Invalid job ID' }, { status: 400 });
    }

    if (!resume_url) {
      console.error('POST /api/applications: Resume URL is required');
      return NextResponse.json({ error: 'Resume URL is required' }, { status: 400 });
    }

    const userIdResult = await pool.query(
      'SELECT applicant_id FROM applicants WHERE user_id = (SELECT user_id FROM users WHERE email = $1)',
      [session.user.email]
    );

    if (userIdResult.rows.length === 0) {
      console.error(`POST /api/applications: Applicant not found for email ${session.user.email}`);
      return NextResponse.json({ error: 'Applicant profile not found' }, { status: 404 });
    }

    const applicant_id = userIdResult.rows[0].applicant_id;

    const existingApplication = await pool.query(
      'SELECT application_id FROM applications WHERE job_id = $1 AND applicant_id = $2',
      [job_id, applicant_id]
    );

    if (existingApplication.rows.length > 0) {
      console.error(`POST /api/applications: Applicant ${applicant_id} already applied to job ${job_id}`);
      return NextResponse.json({ error: 'You have already applied to this job' }, { status: 400 });
    }

    const jobResult = await pool.query('SELECT job_id FROM jobs WHERE job_id = $1', [job_id]);
    if (jobResult.rows.length === 0) {
      console.error(`POST /api/applications: Job not found for job_id ${job_id}`);
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const result = await pool.query(
      'INSERT INTO applications (job_id, applicant_id, resume_url, cover_letter, applied_date, application_status) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5) RETURNING application_id, job_id, applicant_id, resume_url, cover_letter, applied_date, application_status',
      [job_id, applicant_id, resume_url, cover_letter || null, 'Pending']
    );

    const application = {
      ...result.rows[0],
      application_id: parseInt(result.rows[0].application_id, 10),
      job_id: parseInt(result.rows[0].job_id, 10),
    };

    console.log(`POST /api/applications: Application created`, {
      application_id: application.application_id,
      job_id: application.job_id,
      applicant_id,
    });

    // Get the new count after creating the application
    const countResult = await pool.query(
      'SELECT COUNT(*) as count FROM applications WHERE job_id = $1',
      [job_id]
    );

    const newCount = parseInt(countResult.rows[0].count, 10);

    // After successful creation, emit WebSocket event
    const io = (await import('socket.io-client')).io();
    io.to(`job-${job_id}`).emit('applicationCountUpdate', {
      jobId: job_id,
      count: newCount
    });

    // Update the response to include the new count
    return NextResponse.json({ 
      success: true, 
      application,
      applicationCount: newCount 
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/applications: Error creating application', {
      message: error.message,
      stack: error.stack,
      email: session?.user?.email || 'unknown',
    });
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}