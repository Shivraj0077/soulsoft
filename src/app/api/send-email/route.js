// 1. First, let's improve the API route to add more logging
// app/api/send-email/route.js

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  console.log('Email API endpoint called');
  
  try {
    const body = await request.json();
    console.log('Request body:', body);
    
    const { userEmail, appointmentDetails } = body;

    // Validate input
    if (!userEmail || !appointmentDetails) {
      console.error('Missing required fields:', { userEmail, appointmentDetails });
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields' 
      }, { status: 400 });
    }

    console.log('Attempting to send email to:', userEmail);
    console.log('With appointment details:', appointmentDetails);

    // Create transporter (configure with your SMTP settings)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    console.log('Email configuration:', {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER ? '**exists**' : '**missing**',
      pass: process.env.EMAIL_PASSWORD ? '**exists**' : '**missing**',
    });

    // Send email to user
    const userMailOptions = {
      from: `"Your Company" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: 'Your Appointment Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Appointment Confirmation</h2>
          <p>Thank you for booking an appointment with us!</p>
          <h3>Appointment Details:</h3>
          <ul>
            <li><strong>Date:</strong> ${appointmentDetails.date}</li>
            <li><strong>Time:</strong> ${appointmentDetails.time}</li>
            <li><strong>Service:</strong> ${appointmentDetails.service}</li>
          </ul>
          <p>We look forward to meeting with you!</p>
          <p>Best regards,<br>Your Company Team</p>
        </div>
      `
    };

    // Send email to company representative
    const companyMailOptions = {
      from: `"Appointment System" <${process.env.EMAIL_USER}>`,
      to: process.env.COMPANY_EMAIL,
      subject: 'New Appointment Scheduled',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Appointment Notification</h2>
          <p>A new appointment has been scheduled:</p>
          <h3>Appointment Details:</h3>
          <ul>
            <li><strong>Customer Email:</strong> ${userEmail}</li>
            <li><strong>Date:</strong> ${appointmentDetails.date}</li>
            <li><strong>Time:</strong> ${appointmentDetails.time}</li>
            <li><strong>Service:</strong> ${appointmentDetails.service}</li>
          </ul>
        </div>
      `
    };

    // Send both emails
    console.log('Sending emails...');
    const results = await Promise.all([
      transporter.sendMail(userMailOptions),
      transporter.sendMail(companyMailOptions)
    ]);
    
    console.log('Email send results:', results);

    return NextResponse.json({ 
      success: true, 
      message: 'Emails sent successfully' 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to send email',
      error: error.message 
    }, { status: 500 });
  }
}