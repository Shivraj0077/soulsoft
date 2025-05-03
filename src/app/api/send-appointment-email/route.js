import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { userEmail } = await request.json();
    console.log('Received request to send email to:', userEmail);

    if (!userEmail) {
      console.log('Error: No email provided');
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // Use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.COMPANY_EMAIL,
      to: userEmail,
      subject: 'Appointment Confirmation',
      text: 'Thank you for scheduling an appointment with us. You will receive further details soon.',
      html: '<p>Thank you for scheduling an appointment with us. You will receive further details soon.</p>',
    };

    console.log('Sending email with options:', mailOptions);
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', userEmail);

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}