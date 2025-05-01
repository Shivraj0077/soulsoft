import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { pool } from '@/lib/db';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_KEY,
  },
});

export async function POST(request) {
  let session;
  try {
    session = await getServerSession(authOptions);
    if (!session) {
      console.error('POST /api/applications/user: Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate environment variables
    if (!process.env.CLOUDFLARE_BUCKET || !process.env.CLOUDFLARE_PUBLIC_URL) {
      console.error('POST /api/applications/user: Missing required environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      console.error('POST /api/applications/user: No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size (e.g., 5MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      console.error(`POST /api/applications/user: File too large (${file.size} bytes)`);
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    const fileType = file.type;
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!validTypes.includes(fileType)) {
      console.error(`POST /api/applications/user: Invalid file type '${fileType}'`);
      return NextResponse.json({ 
        error: 'Invalid file type. Please upload PDF or Word document.' 
      }, { status: 400 });
    }

    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const timestamp = Date.now();
      const sanitizedEmail = session.user.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
      const uniqueFileName = `${sanitizedEmail}_${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

      console.log(`POST /api/applications/user: Uploading file '${uniqueFileName}'`);

      const command = new PutObjectCommand({
        Bucket: process.env.CLOUDFLARE_BUCKET,
        Key: uniqueFileName,
        Body: buffer,
        ContentType: file.type,
        Metadata: {
          userId: session.user.email,
          originalName: file.name,
          uploadedAt: new Date().toISOString()
        }
      });

      await s3Client.send(command);

      const fileUrl = `${process.env.CLOUDFLARE_PUBLIC_URL}/${uniqueFileName}`;
      console.log(`POST /api/applications/user: File uploaded successfully, URL: ${fileUrl}`);

      return NextResponse.json({ 
        success: true, 
        url: fileUrl 
      });

    } catch (uploadError) {
      console.error('POST /api/applications/user: Upload failed', {
        error: uploadError.message,
        stack: uploadError.stack,
        email: session.user.email
      });
      return NextResponse.json({ 
        error: 'Failed to upload file', 
        details: uploadError.message 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('POST /api/applications/user: Unexpected error', {
      message: error.message,
      stack: error.stack,
      email: session?.user?.email || 'unknown'
    });
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}

export async function GET() {
  let session;
  try {
    session = await getServerSession(authOptions);
    if (!session) {
      console.error('GET /api/applications/user: Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First, get the user_id from the users table
    const userResult = await pool.query(
      'SELECT user_id FROM users WHERE email = $1',
      [session.user.email]
    );

    if (userResult.rows.length === 0) {
      console.error(`GET /api/applications/user: User not found for email ${session.user.email}`);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = userResult.rows[0].user_id;

    // Then get the applicant_id using the user_id
    const applicantResult = await pool.query(
      'SELECT applicant_id FROM applicants WHERE user_id = $1',
      [userId]
    );

    if (applicantResult.rows.length === 0) {
      return NextResponse.json({ 
        success: true,
        applications: [] // Return empty array if user hasn't applied to any jobs yet
      });
    }

    const applicantId = applicantResult.rows[0].applicant_id;

    // Finally, get all applications with job details
    const result = await pool.query(`
      SELECT 
        a.application_id,
        a.job_id,
        a.resume_url,
        a.cover_letter,
        a.applied_date,
        a.application_status,
        j.title,
        j.description,
        j.location,
        j.salary_range,
        j.employment_type,
        j.posted_date
      FROM applications a
      INNER JOIN jobs j ON a.job_id = j.job_id
      WHERE a.applicant_id = $1
      ORDER BY a.applied_date DESC
    `, [applicantId]);

    const applications = result.rows.map(row => ({
      ...row,
      applied_date: row.applied_date.toISOString(),
      posted_date: row.posted_date?.toISOString()
    }));

    console.log(`GET /api/applications/user: Found ${applications.length} applications for user ${session.user.email}`);

    return NextResponse.json({
      success: true,
      applications
    });

  } catch (error) {
    console.error('GET /api/applications/user: Database error', {
      message: error.message,
      stack: error.stack,
      email: session?.user?.email || 'unknown'
    });

    // Return specific error messages for common database errors
    if (error.code === '42P01') {
      return NextResponse.json({ error: 'Database table not found' }, { status: 500 });
    }
    if (error.code === '28P01') {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    return NextResponse.json(
      { error: 'Failed to fetch applications', details: error.message },
      { status: 500 }
    );
  }
}