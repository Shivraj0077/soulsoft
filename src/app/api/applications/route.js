import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

// Cloudflare R2 configuration
const s3Client = new S3Client({
  endpoint: process.env.CLOUDFLARE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_KEY,
  },
  region: "auto",
  forcePathStyle: true,
});

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("POST /api/applications - Session:", session);
    if (!session || !session.user?.id) {
      console.error("POST /api/applications - Authentication failed: No valid session or user.id", {
        sessionExists: !!session,
        userExists: !!session?.user,
        userIdExists: !!session?.user?.id,
      });
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;
    console.log("POST /api/applications - User ID:", userId, typeof userId);

    let applicantResult = await pool.query(
      "SELECT applicant_id FROM applicants WHERE user_id = $1",
      [userId]
    );

    let applicantId;
    if (applicantResult.rows.length === 0) {
      console.log("POST /api/applications - Creating new applicant for user ID:", userId);
      applicantResult = await pool.query(
        `INSERT INTO applicants (user_id, created_at)
         VALUES ($1, CURRENT_TIMESTAMP)
         RETURNING applicant_id`,
        [userId]
      );
    }
    applicantId = applicantResult.rows[0].applicant_id;
    console.log("POST /api/applications - Applicant ID:", applicantId, typeof applicantId);

    const formData = await request.formData();
    const jobId = formData.get("job_id");
    const coverLetter = formData.get("cover_letter");
    const resumeFile = formData.get("resume");

    if (!jobId || !coverLetter || !resumeFile) {
      console.error("POST /api/applications - Missing required fields:", { jobId, coverLetter, resumeFile });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const jobIdNum = parseInt(jobId, 10);
    if (isNaN(jobIdNum)) {
      console.error("POST /api/applications - Invalid job ID:", jobId);
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
    }

    const jobCheck = await pool.query("SELECT job_id FROM jobs WHERE job_id = $1", [jobIdNum]);
    if (jobCheck.rows.length === 0) {
      console.error("POST /api/applications - Job not found:", jobIdNum);
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const applicationCheck = await pool.query(
      `SELECT EXISTS (
        SELECT 1 
        FROM applications 
        WHERE job_id = $1 AND applicant_id = $2
      ) AS has_applied`,
      [jobIdNum, applicantId]
    );
    if (applicationCheck.rows[0].has_applied) {
      console.error("POST /api/applications - Duplicate application:", { jobIdNum, applicantId });
      return NextResponse.json({ error: "You have already applied for this job" }, { status: 400 });
    }

    const fileName = `${uuidv4()}-${resumeFile.name}`;
    const params = {
      Bucket: process.env.CLOUDFLARE_BUCKET,
      Key: fileName,
      Body: Buffer.from(await resumeFile.arrayBuffer()),
      ContentType: resumeFile.type,
    };

    console.log("POST /api/applications - Attempting upload to Cloudflare R2:", params);
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    const resumeUrl = `${process.env.CLOUDFLARE_ENDPOINT}/${process.env.CLOUDFLARE_BUCKET}/${fileName}`;
    console.log("POST /api/applications - Upload successful:", resumeUrl);

    const result = await pool.query(
      `INSERT INTO applications (job_id, applicant_id, resume_url, cover_letter, applied_date, application_status)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, 'Pending')
       RETURNING application_id`,
      [jobIdNum, applicantId, resumeUrl, coverLetter]
    );

    return NextResponse.json({ success: true, resumeUrl, applicationId: result.rows[0].application_id });
  } catch (error) {
    console.error("POST /api/applications - Error processing application:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("GET /api/applications - Session:", session);
    if (!session || !session.user?.id) {
      console.error("GET /api/applications - Authentication failed: No valid session or user.id", {
        sessionExists: !!session,
        userExists: !!session?.user,
        userIdExists: !!session?.user?.id,
      });
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;
    console.log("GET /api/applications - Fetching applications for user ID:", userId);

    // Find the applicant's ID
    const applicantResult = await pool.query(
      "SELECT applicant_id FROM applicants WHERE user_id = $1",
      [userId]
    );

    if (applicantResult.rows.length === 0) {
      console.log("GET /api/applications - No applicant record found for user ID:", userId);
      return NextResponse.json({ applications: [] });
    }

    const applicantId = applicantResult.rows[0].applicant_id;
    console.log("GET /api/applications - Applicant ID:", applicantId);

    // Fetch applications with job and recruiter details
    const result = await pool.query(
      `SELECT 
        a.application_id,
        a.job_id,
        a.applicant_id,
        a.applied_date,
        a.application_status,
        a.resume_url,
        a.cover_letter,
        j.title AS job_title,
        j.employment_type,
        j.location,
        j.salary_range,
        r.company_name
      FROM applications a
      JOIN jobs j ON a.job_id = j.job_id
      LEFT JOIN recruiters r ON j.posted_by_recruiter_id = r.recruiter_id
      WHERE a.applicant_id = $1
      ORDER BY a.applied_date DESC`,
      [applicantId]
    );

    // Generate pre-signed URLs for resume access
    const applications = await Promise.all(
      result.rows.map(async (app) => {
        if (app.resume_url) {
          const urlParts = app.resume_url.split("/");
          const key = urlParts[urlParts.length - 1];
          const command = new GetObjectCommand({
            Bucket: process.env.CLOUDFLARE_BUCKET,
            Key: key,
          });
          const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
          return { ...app, resume_url: signedUrl };
        }
        return app;
      })
    );

    console.log("GET /api/applications - Applications found:", applications.length);
    return NextResponse.json({ applications });
  } catch (error) {
    console.error("GET /api/applications - Error fetching applications:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}