import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { jobId } = await Promise.resolve(params);
    
    if (!jobId || isNaN(parseInt(jobId, 10))) {
      return NextResponse.json({ error: 'Invalid job ID' }, { status: 400 });
    }

    const numericJobId = parseInt(jobId, 10);
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM applications WHERE job_id = $1',
      [numericJobId]
    );
    
    return NextResponse.json({ 
      success: true,
      count: parseInt(result.rows[0].count, 10) 
    });
  } catch (error) {
    console.error('Error getting applications count:', error);
    return NextResponse.json(
      { error: 'Failed to get applications count' },
      { status: 500 }
    );
  }
}