import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { pool } from "@/lib/db";
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify recruiter role
    if (session.user.role !== 'recruiter') {
      return NextResponse.json({ error: "Forbidden - Recruiter access only" }, { status: 403 });
    }

    // Parse request body
    const data = await request.json();
    const { 
      title, 
      description, 
      skills_required, 
      location, 
      salary_range, 
      employment_type, 
      deadline_date 
    } = data;

    // Validate required fields
    if (!title || !description || !location || !employment_type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get recruiter ID based on email
    const recruiterResult = await pool.query(
      `SELECT r.recruiter_id 
       FROM recruiters r 
       JOIN users u ON r.user_id = u.user_id 
       WHERE u.email = $1`,
      [session.user.email]
    );

    if (recruiterResult.rows.length === 0) {
      return NextResponse.json({ error: "Recruiter not found" }, { status: 404 });
    }

    const recruiter_id = recruiterResult.rows[0].recruiter_id;

    // Insert job into database
    const result = await pool.query(
      `INSERT INTO jobs (
        title, 
        description, 
        skills_required, 
        location, 
        salary_range, 
        employment_type, 
        deadline_date, 
        posted_by_recruiter_id, 
        posted_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP) RETURNING job_id`,
      [
        title, 
        description, 
        skills_required, 
        location, 
        salary_range, 
        employment_type, 
        deadline_date || null, 
        recruiter_id
      ]
    );

    // Return new job ID
    return NextResponse.json({ job_id: result.rows[0].job_id }, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Handle GET request to fetch all jobs
export async function GET() {
  try {
    const result = await pool.query(
      `SELECT * FROM jobs ORDER BY posted_date DESC`
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 