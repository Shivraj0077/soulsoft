// src/app/api/jobs/[id]/route.js
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    // Workaround: Await params if it's a Promise
    const resolvedParams = await Promise.resolve(params);
    const jobId = resolvedParams.id;

    if (!jobId || isNaN(jobId)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT 
        j.*, 
        r.company_name
      FROM 
        jobs j
      LEFT JOIN 
        recruiters r ON j.posted_by_recruiter_id = r.recruiter_id
      WHERE 
        j.job_id = $1`,
      [jobId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching job details:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}