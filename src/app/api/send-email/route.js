import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request) {
  try {
    const { userEmail } = await request.json();
    console.log('Received email request for:', userEmail);

    if (!userEmail) {
      console.log('Error: No email provided');
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Email options
    const mailOptions = {
      from: `"Your Company Name" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      cc: process.env.COMPANY_EMAIL,
      subject: 'Appointment Confirmation - Your Company Name',
      text: `
Dear Customer,

Thank you for scheduling an appointment with Your Company Name. Your appointment has been successfully booked, and our team will contact you shortly with further details.

Details:
- Service: Online Demo
- Email: ${userEmail}

If you have any questions, please contact us at support@yourcompany.com or +91-123-456-7890.

Best regards,
Your Company Name Team
https://yourcompany.com
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #007bff; color: white; padding: 10px; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
    .footer { margin-top: 20px; font-size: 12px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Appointment Confirmation</h2>
    </div>
    <div class="content">
      <p>Dear Customer,</p>
      <p>Thank you for scheduling an appointment with Your Company Name. Your appointment has been successfully booked, and our team will contact you shortly with further details.</p>
      <p><strong>Details:</strong></p>
      <ul>
        <li><strong>Service:</strong> Online Demo</li>
        <li><strong>Email:</strong> ${userEmail}</li>
      </ul>
      <p>If you have any questions, please contact us at <a href="mailto:support@yourcompany.com">support@yourcompany.com</a> or +91-123-456-7890.</p>
      <p>Best regards,<br>Your Company Name Team</p>
    </div>
    <div class="footer">
      <p><a href="https://yourcompany.com">Your Company Name</a> | All rights reserved.</p>
    </div>
  </div>
</body>
</html>
      `,
    };

    // Send email
    console.log('Sending email with options:', mailOptions);
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', userEmail);

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}