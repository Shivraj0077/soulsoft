import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { pool } from '@/lib/db';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_KEY,
  },
});

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'No file key provided' }, { status: 400 });
    }

    // Check access permissions based on user role
    const hasAccess = await checkFileAccess(session.user.email, key, session.user.role);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET,
      Key: key,
    });

    const response = await s3Client.send(command);
    const chunks = [];
    for await (const chunk of response.Body) {
      chunks.push(chunk);
    }
    const fileBuffer = Buffer.concat(chunks);

    const headers = new Headers();
    headers.set('Content-Type', response.ContentType || 'application/pdf');
    headers.set('Content-Length', fileBuffer.length.toString());
    headers.set('Content-Disposition', `inline; filename="${key}"`);

    return new NextResponse(fileBuffer, { headers });

  } catch (error) {
    console.error('GET /api/files: Error fetching file', error);
    return NextResponse.json(
      { error: 'Failed to fetch file' }, 
      { status: 500 }
    );
  }
}

async function checkFileAccess(userEmail, fileKey, userRole) {
  try {
    // Recruiters can access all resumes
    if (userRole === 'recruiter') {
      return true;
    }

    // For applicants, check if the resume belongs to them
    const result = await pool.query(`
      SELECT 1
      FROM applications a
      JOIN applicants app ON a.applicant_id = app.applicant_id
      JOIN users u ON app.user_id = u.user_id
      WHERE u.email = $1 AND a.resume_url LIKE $2
    `, [userEmail, `%${fileKey}%`]);

    return result.rows.length > 0;
  } catch (error) {
    console.error('Error checking file access:', error);
    return false;
  }
}