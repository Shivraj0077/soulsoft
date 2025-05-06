// lib/email.js
import nodemailer from 'nodemailer';

/**
 * Creates a configured nodemailer transporter
 * @returns {nodemailer.Transporter}
 */
export function createTransporter() {
  // Create reusable transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT),
    secure: process.env.EMAIL_SERVER_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    tls: {
      // Do not fail on invalid certs
      rejectUnauthorized: false,
    },
    // Debug options
    logger: true,
    debug: process.env.NODE_ENV === 'development',
  });
  
  return transporter;
}

/**
 * Sends an email using the configured transporter
 * @param {Object} options Email options
 * @returns {Promise<any>} Result of sending email
 */
export async function sendEmail(options) {
  const transporter = createTransporter();
  
  try {
    const info = await transporter.sendMail(options);
    console.log('Message sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/**
 * Verifies SMTP connection
 * @returns {Promise<boolean>} Whether connection is successful
 */
export async function verifyConnection() {
  const transporter = createTransporter();
  
  try {
    const result = await transporter.verify();
    console.log('SMTP connection verified:', result);
    return true;
  } catch (error) {
    console.error('SMTP connection failed:', error);
    return false;
  }
}