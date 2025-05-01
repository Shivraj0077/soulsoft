import { pool } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      title,
      description,
      skills_required,
      location,
      salary_range,
      employment_type,
      deadline_date,
    } = await request.json();

    // Get recruiter ID
    const userResult = await pool.query(
      'SELECT r.recruiter_id FROM users u JOIN recruiters r ON u.user_id = r.user_id WHERE u.email = $1',
      [session.user.email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'Recruiter not found' }, { status: 404 });
    }

    const recruiterId = userResult.rows[0].recruiter_id;

    const result = await pool.query(
      `INSERT INTO jobs 
       (title, description, skills_required, location, salary_range, employment_type, posted_by_recruiter_id, deadline_date) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [
        title,
        description,
        skills_required || null,
        location || null,
        salary_range || null,
        employment_type || null,
        recruiterId,
        deadline_date || null,
      ]
    );

    return NextResponse.json({ job: result.rows[0] });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM jobs ORDER BY posted_date DESC');
    return NextResponse.json({ jobs: result.rows });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}