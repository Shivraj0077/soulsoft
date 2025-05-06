import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_KEY,
  },
});

export async function uploadToCloudflare(file, folder = '') {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const uniqueFileName = `${folder ? `${folder}/` : ''}${timestamp}_${file.name}`;

    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET,
      Key: uniqueFileName,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    // Use public URL for access
    const fileUrl = `${process.env.CLOUDFLARE_PUBLIC_URL}/${uniqueFileName}`;
    return fileUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

export function getFileKeyFromUrl(url) {
  if (!url || typeof url !== 'string') {
    console.warn('Invalid or missing URL:', url);
    return null;
  }
  
  try {
    // Handle both full URLs and relative paths
    const path = url.startsWith('http') ? new URL(url).pathname : url;
    const pathParts = path.split('/').filter(Boolean);
    return pathParts[pathParts.length - 1] || null;
  } catch (err) {
    console.error('Error parsing URL:', err);
    return null;
  }
}

export function getFileProxyUrl(fileKey) {
  if (!fileKey) return null;
  return `/api/files/${fileKey}`;
}