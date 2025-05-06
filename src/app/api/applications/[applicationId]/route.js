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

export async function POST(request) {
  let session;
  try {
    session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'You must be logged in to apply' 
      }, { status: 401 });
    }

    const body = await request.json();
    const { job_id, cover_letter, resume_url } = body;

    if (!job_id) {
      return NextResponse.json({ 
        success: false,
        error: 'Job ID is required',
        message: 'Please provide a valid job ID'
      }, { status: 400 });
    }

    // Get the user's applicant_id
    const applicantResult = await pool.query(
      `SELECT a.applicant_id 
       FROM applicants a 
       JOIN users u ON a.user_id = u.user_id 
       WHERE u.email = $1`,
      [session.user.email]
    );

    if (applicantResult.rows.length === 0) {
      return NextResponse.json({ 
        success: false,
        error: 'Applicant profile not found',
        message: 'Please complete your applicant profile first'
      }, { status: 404 });
    }

    const applicantId = applicantResult.rows[0].applicant_id;

    // Check if user has already applied to this job
    const existingApplication = await pool.query(
      'SELECT application_id FROM applications WHERE job_id = $1 AND applicant_id = $2',
      [job_id, applicantId]
    );

    if (existingApplication.rows.length > 0) {
      return NextResponse.json({ 
        success: false,
        error: 'Duplicate application',
        message: 'You have already applied for this job'
      }, { status: 400 });
    }

    // Create the application
    const result = await pool.query(
      `INSERT INTO applications (job_id, applicant_id, resume_url, cover_letter, application_status, applied_date)
       VALUES ($1, $2, $3, $4, 'pending', NOW())
       RETURNING application_id, job_id, applicant_id, application_status`,
      [job_id, applicantId, resume_url, cover_letter]
    );

    // Ensure we have a valid result before sending response
    if (!result.rows[0]) {
      throw new Error('Failed to create application record');
    }

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      application: {
        ...result.rows[0],
        application_id: parseInt(result.rows[0].application_id, 10),
        job_id: parseInt(result.rows[0].job_id, 10),
        applicant_id: parseInt(result.rows[0].applicant_id, 10)
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Application submission error:', error);
    
    // Always return a properly formatted JSON response
    return NextResponse.json({
      success: false,
      error: 'Server error',
      message: 'Failed to submit application. Please try again later.'
    }, { status: 500 });
  }
}