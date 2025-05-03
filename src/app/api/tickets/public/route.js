import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT * FROM tickets WHERE is_public = true ORDER BY created_at DESC LIMIT 9'
    );
    
    return NextResponse.json({ 
      success: true,
      tickets: result.rows 
    });
  } catch (error) {
    console.error('Error fetching public tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}