import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    console.log("GET /api/applications/check/[id] - Session:", session);
    if (!session || !session.user?.id) {
      console.error("GET /api/applications/check/[id] - Authentication failed: No valid session or user.id", {
        sessionExists: !!session,
        userExists: !!session?.user,
        userIdExists: !!session?.user?.id,
      });
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;
    console.log("GET /api/applications/check/[id] - User ID:", userId);

    const applicantResult = await pool.query(
      "SELECT applicant_id FROM applicants WHERE user_id = $1",
      [userId]
    );

    if (applicantResult.rows.length === 0) {
      console.log("GET /api/applications/check/[id] - No applicant record for user ID:", userId);
      return NextResponse.json({ hasApplied: false });
    }

    const applicantId = applicantResult.rows[0].applicant_id;
    console.log("GET /api/applications/check/[id] - Applicant ID:", applicantId);

    const resolvedParams = await Promise.resolve(params);
    const jobId = resolvedParams.id;

    if (!jobId || isNaN(jobId)) {
      console.error("GET /api/applications/check/[id] - Invalid job ID:", jobId);
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT EXISTS (
        SELECT 1 
        FROM applications 
        WHERE job_id = $1 AND applicant_id = $2
      ) AS has_applied`,
      [jobId, applicantId]
    );

    console.log("GET /api/applications/check/[id] - Has applied:", result.rows[0].has_applied);
    return NextResponse.json({ hasApplied: result.rows[0].has_applied });
  } catch (error) {
    console.error("GET /api/applications/check/[id] - Error checking application:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}