import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_KEY,
  },
});

export async function GET(request, { params }) {
  try {
    const { filename } = params;
    
    const command = new GetObjectCommand({
      Bucket: 'job2',
      Key: filename,
    });

    const { Body, ContentType } = await s3Client.send(command);
    const arrayBuffer = await Body.transformToByteArray();
    
    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': ContentType || 'application/octet-stream',
        'Content-Disposition': `inline; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error fetching file:', error);
    return new NextResponse('File not found', { status: 404 });
  }
}

export async function HEAD(request, { params }) {
  try {
    const { filename } = params;
    
    const command = new GetObjectCommand({
      Bucket: 'job2',
      Key: filename,
    });

    await s3Client.send(command);
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('Error checking file:', error);
    return new NextResponse('File not found', { status: 404 });
  }
}