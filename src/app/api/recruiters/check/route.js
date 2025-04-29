// src/app/api/recruiters/check/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { pool } from "@/lib/db";

export async function GET() {
    try {
      const session = await getServerSession(authOptions);
      
      console.log("Recruiter check - Session:", session);
      
      if (!session) {
        return NextResponse.json({ isRecruiter: false }, { status: 401 });
      }
      
      const userId = session.user.id;
      console.log("Recruiter check - User ID:", userId);
      
      // Check if the user is a recruiter in the database
      const client = await pool.connect();
      try {
        // Check if user exists in recruiters table
        const result = await client.query(
          `SELECT r.recruiter_id 
           FROM recruiters r 
           JOIN users u ON r.user_id = u.user_id 
           WHERE u.user_id = $1`,
          [userId]
        );
        
        console.log("Recruiter check - Recruiter query result:", result.rows);
        
        // Also verify their role contains 'recruiter'
        const roleCheck = await client.query(
          `SELECT role FROM users WHERE user_id = $1`,
          [userId]
        );
        
        console.log("Recruiter check - Role check result:", roleCheck.rows);
        
        const hasRecruiterRole = roleCheck.rows.length > 0 && 
                                roleCheck.rows[0].role.includes('recruiter');
        
        const isRecruiter = result.rows.length > 0 && hasRecruiterRole;
        console.log("Recruiter check - Is recruiter:", isRecruiter);
        
        return NextResponse.json({ isRecruiter });
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error checking recruiter status:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }