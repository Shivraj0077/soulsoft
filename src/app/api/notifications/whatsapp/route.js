import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { sendWhatsAppMessage } from '@/lib/notifications';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { to, message } = await request.json();
    if (!to || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!/^\+[1-9]\d{1,14}$/.test(to)) {
      return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 });
    }

    await sendWhatsAppMessage(to, message);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}