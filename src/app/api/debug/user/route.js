// src/app/api/debug/user/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    const client = await pool.connect();
    try {
      // Get user details
      const userResult = await client.query(
        `SELECT * FROM users WHERE user_id = $1`,
        [userId]
      );
      
      // Check if user is a recruiter
      const recruiterResult = await client.query(
        `SELECT * FROM recruiters WHERE user_id = $1`,
        [userId]
      );
      
      return NextResponse.json({
        session,
        userDetails: userResult.rows[0] || null,
        recruiterDetails: recruiterResult.rows[0] || null
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching user debug info:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}