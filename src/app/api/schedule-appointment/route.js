import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  const { email } = await request.json();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: [email, 'admin@example.com'],
    subject: 'Appointment Scheduled',
    text: `An appointment has been scheduled. Details:\nEmail: ${email}\nDate: ${new Date().toLocaleString()}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Appointment scheduled! Confirmation email sent.' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to send email.' }, { status: 500 });
  }
}