// app/api/contact/route.js
import { NextResponse } from 'next/server';
import { sendEmail, verifyConnection } from '@/lib/email';

export async function POST(request) {
  try {
    // First verify SMTP connection
    const isConnected = await verifyConnection();
    if (!isConnected) {
      return NextResponse.json(
        { message: 'Failed to connect to email server. Please try again later.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate input
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email to admin
    await sendEmail({
      from: `"Contact Form" <${process.env.EMAIL_SERVER_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.COMPANY_EMAIL,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      text: `
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        
        Message:
        ${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #4338ca;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 4px;">
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      `,
    });

    // Send confirmation email to the user
    await sendEmail({
      from: `"Company Support" <${process.env.EMAIL_SERVER_USER}>`,
      to: email,
      subject: `Thank you for contacting us - ${subject}`,
      text: `
        Dear ${name},
        
        Thank you for reaching out to us. We have received your message and will get back to you soon.
        
        Your message details:
        Subject: ${subject}
        
        Best regards,
        The Company Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #4338ca;">Thank You for Contacting Us</h2>
          <p>Dear ${name},</p>
          <p>Thank you for reaching out to us. We have received your message and will get back to you soon.</p>
          <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 4px;">
            <p><strong>Your message details:</strong></p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          <p style="margin-top: 20px;">Best regards,<br>The Company Team</p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Provide more helpful error messages based on error type
    let errorMessage = 'Failed to send email';
    if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please check your credentials.';
    } else if (error.code === 'ESOCKET' || error.code === 'ECONNECTION') {
      errorMessage = 'Could not connect to email server. Please check your server settings.';
    }
    
    return NextResponse.json(
      { message: errorMessage, error: error.message },
      { status: 500 }
    );
  }
}