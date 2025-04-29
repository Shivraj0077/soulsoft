import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_KEY,
  },
});

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      console.error('POST /api/upload: Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      console.error('POST /api/upload: No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileType = file.type;
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!validTypes.includes(fileType)) {
      console.error(`POST /api/upload: Invalid file type '${fileType}'`);
      return NextResponse.json({ error: 'Invalid file type. Please upload PDF or Word document.' }, { status: 400 });
    }

    const metadata = formData.get('metadata') ? JSON.parse(formData.get('metadata')) : {};

    const timestamp = Date.now();
    const userId = session.user.email.split('@')[0]; // Simplified for unique naming
    const uniqueFileName = `${userId}_${timestamp}_${file.name}`;

    console.log(`POST /api/upload: Uploading file '${uniqueFileName}' to Cloudflare R2`);

    const buffer = Buffer.from(await file.arrayBuffer());

    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET,
      Key: uniqueFileName,
      Body: buffer,
      ContentType: file.type,
      Metadata: metadata,
    });

    await s3Client.send(command);

    const fileUrl = `${process.env.CLOUDFLARE_ENDPOINT}/${uniqueFileName}`;
    console.log(`POST /api/upload: File uploaded successfully, URL: ${fileUrl}`);

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error('POST /api/upload: Upload error', {
      message: error.message,
      stack: error.stack,
      email: session?.user?.email || 'unknown',
    });
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}