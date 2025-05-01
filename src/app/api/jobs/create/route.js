// app/api/jobs/create/route.js
import { pool } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      console.error('POST /api/jobs/create: Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userResult = await pool.query(
      'SELECT r.recruiter_id FROM users u JOIN recruiters r ON u.user_id = r.user_id WHERE u.email = $1',
      [session.user.email]
    );
    
    if (userResult.rows.length === 0) {
      console.error(`POST /api/jobs/create: Recruiter not found for email ${session.user.email}`);
      return NextResponse.json({ error: 'Recruiter not found' }, { status: 404 });
    }
    
    const recruiter_id = userResult.rows[0].recruiter_id;
    const {
      title,
      description,
      skills_required,
      location,
      salary_range,
      employment_type,
      deadline_date,
    } = await request.json();
    
    if (!title || !description) {
      console.error('POST /api/jobs/create: Missing required fields');
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }
    
    const posted_date = new Date();
    const result = await pool.query(
      `INSERT INTO jobs (
        title, description, skills_required, location, salary_range, employment_type, 
        posted_by_recruiter_id, posted_date, deadline_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING job_id, title, description, skills_required, location, salary_range, 
                employment_type, posted_by_recruiter_id, posted_date, deadline_date`,
      [
        title,
        description,
        skills_required || null,
        location || null,
        salary_range || null,
        employment_type || null,
        recruiter_id,
        posted_date,
        deadline_date || null,
      ]
    );
    
    const job = result.rows[0];
    console.log(`POST /api/jobs/create: Created job`, {
      job_id: job.job_id,
      title: job.title,
      recruiter_id,
    });
    
    // Ensure job_id is returned as a number
    return NextResponse.json({
      ...job,
      job_id: parseInt(job.job_id, 10),
    });
  } catch (error) {
    console.error('POST /api/jobs/create: Error creating job', {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}