import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { pool } from '@/lib/db';

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      console.error(`PUT /api/applications/[applicationId]/status: Unauthorized access attempt`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.user?.role || session.user.role !== 'recruiter') {
      console.error(`PUT /api/applications/[applicationId]/status: Non-recruiter access attempt by ${session.user?.email || 'unknown'}`);
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const applicationId = parseInt(params.applicationId, 10);
    if (isNaN(applicationId) || applicationId <= 0) {
      console.error(`PUT /api/applications/[applicationId]/status: Invalid application ID '${params.applicationId}'`);
      return NextResponse.json({ error: 'Invalid application ID' }, { status: 400 });
    }

    let status;
    try {
      const body = await request.json();
      status = body.status;
    } catch (err) {
      console.error(`PUT /api/applications/[applicationId]/status: Invalid request body`, { error: err.message });
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const validStatuses = ['Pending', 'Reviewed', 'Accepted', 'Rejected'];
    if (!validStatuses.includes(status)) {
      console.error(`PUT /api/applications/[applicationId]/status: Invalid status '${status}'`);
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    console.log(`PUT /api/applications/${applicationId}/status: Updating status to ${status}`);

    // Verify application exists
    const applicationCheck = await pool.query(
      'SELECT application_id FROM applications WHERE application_id = $1',
      [applicationId]
    );

    if (applicationCheck.rows.length === 0) {
      console.log(`PUT /api/applications/${applicationId}/status: Application not found`);
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Update status
    const result = await pool.query(
      'UPDATE applications SET application_status = $1 WHERE application_id = $2 RETURNING application_id, application_status',
      [status, applicationId]
    );

    if (result.rows.length === 0) {
      console.error(`PUT /api/applications/${applicationId}/status: Failed to update status`);
      return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
    }

    console.log(`PUT /api/applications/${applicationId}/status: Status updated`, {
      application_id: result.rows[0].application_id,
      application_status: result.rows[0].application_status,
    });

    return NextResponse.json({
      success: true,
      application_id: parseInt(result.rows[0].application_id, 10),
      application_status: result.rows[0].application_status,
    });
  } catch (error) {
    console.error(`PUT /api/applications/[applicationId]/status: Error updating status`, {
      message: error.message,
      stack: error.stack,
      applicationId: params.applicationId,
    });
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}