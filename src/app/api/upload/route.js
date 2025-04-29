import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

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
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!validTypes.includes(fileType)) {
      console.error(`POST /api/upload: Invalid file type '${fileType}'`);
      return NextResponse.json({ error: 'Invalid file type. Please upload PDF or Word document.' }, { status: 400 });
    }

    const metadata = formData.get('metadata') ? JSON.parse(formData.get('metadata')) : {};
    
    const timestamp = Date.now();
    const userId = session.user.email.split('@')[0]; // Simplified for unique naming
    const uniqueFileName = `${userId}_${timestamp}_${file.name}`;
    
    console.log(`POST /api/upload: Uploading file '${uniqueFileName}' to Cloudflare R2`);

    const uploadResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/r2/buckets/${process.env.CLOUDFLARE_BUCKET_NAME}/objects/${uniqueFileName}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': file.type,
          'X-Amz-Meta-Metadata': JSON.stringify(metadata),
        },
        body: await file.arrayBuffer(),
      }
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error(`POST /api/upload: Cloudflare upload failed: ${errorText}`);
      return NextResponse.json({ error: 'Failed to upload file to storage', details: errorText }, { status: 500 });
    }

    const fileUrl = `${process.env.CLOUDFLARE_PUBLIC_URL}/${uniqueFileName}`;
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