import nodemailer from 'nodemailer';
import twilio from 'twilio';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Admin contacts configuration
const ADMIN_CONTACTS = [
  { 
    name: 'Shivraj Pawar', 
    email: process.env.ADMIN_EMAIL, 
    phone: process.env.ADMIN_PHONE 
  }
];

// Export each function individually using named exports
export async function sendEmail(to, subject, message) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html: `<p>${message.replace(/\n/g, '<br>')}</p>`,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw new Error('Failed to send email');
  }
}

export async function sendWhatsAppMessage(to, message) {
  try {
    if (!process.env.TWILIO_WHATSAPP_NUMBER) return;
    
    await twilioClient.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`,
      body: message,
    });
    console.log(`WhatsApp message sent to ${to}`);
  } catch (error) {
    console.error(`Error sending WhatsApp message to ${to}:`, error);
    throw new Error('Failed to send WhatsApp message');
  }
}

export async function notifyAdminsAboutNewTicket(ticketId, pool) {
  try {
    const ticketQuery = `
      SELECT t.ticket_id, t.title, t.description, t.problem_type, 
             t.product_service_name, u.name, u.email
      FROM tickets t
      JOIN users u ON t.user_id = u.user_id
      WHERE t.ticket_id = $1
    `;
    const ticketResult = await pool.query(ticketQuery, [ticketId]);
    const ticket = ticketResult.rows[0];

    if (!ticket) {
      throw new Error(`Ticket ${ticketId} not found`);
    }

    const message = `
      New Ticket #${ticket.ticket_id}
      Title: ${ticket.title}
      Description: ${ticket.description}
      Type: ${ticket.problem_type}
      Product/Service: ${ticket.product_service_name}
      Submitted by: ${ticket.name} (${ticket.email})
    `;

    for (const admin of ADMIN_CONTACTS) {
      await sendEmail(admin.email, `New Support Ticket #${ticket.ticket_id}`, message);
      if (admin.phone) {
        await sendWhatsAppMessage(admin.phone, message);
      }
    }
  } catch (error) {
    console.error('Error notifying admins:', error);
    throw error;
  }
}

export async function notifyUserAboutStatusChange(ticketId, pool) {
  try {
    const ticketQuery = `
      SELECT t.ticket_id, t.title, t.status, u.name, u.email, u.phone_number
      FROM tickets t
      JOIN users u ON t.user_id = u.user_id
      WHERE t.ticket_id = $1
    `;
    const ticketResult = await pool.query(ticketQuery, [ticketId]);
    const ticket = ticketResult.rows[0];

    if (!ticket) {
      throw new Error(`Ticket ${ticketId} not found`);
    }

    const updateQuery = `
      SELECT comment, updated_by_name, created_at
      FROM ticket_updates
      WHERE ticket_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const updateResult = await pool.query(updateQuery, [ticketId]);
    const update = updateResult.rows[0] || {};

    const message = `
      Ticket #${ticket.ticket_id} Update
      Title: ${ticket.title}
      New Status: ${ticket.status}
      Comment: ${update.comment || 'No comment'}
      Updated by: ${update.updated_by_name || 'System'}
      Updated at: ${update.created_at ? new Date(update.created_at).toLocaleString() : 'N/A'}
    `;

    await sendEmail(ticket.email, `Ticket #${ticket.ticket_id} Status Updated`, message);
    if (ticket.phone_number) {
      await sendWhatsAppMessage(ticket.phone_number, message);
    }
  } catch (error) {
    console.error('Error notifying user:', error);
    throw error;
  }
}

export async function notifyUserAboutTicket({ email, name, ticketId, title, description, problemType, productServiceName }) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Your support ticket #${ticketId} has been created`,
      html: `
        <p>Hi ${name || ''},</p>
        <p>Your support ticket has been created successfully. Here are the details:</p>
        <ul>
          <li><strong>Ticket ID:</strong> ${ticketId}</li>
          <li><strong>Title:</strong> ${title}</li>
          <li><strong>Description:</strong> ${description}</li>
          <li><strong>Type:</strong> ${problemType}</li>
          <li><strong>Product/Service:</strong> ${productServiceName}</li>
        </ul>
        <p>We will get back to you soon.</p>
        <p>Thank you,<br/>Support Team</p>
      `,
    });
  } catch (error) {
    console.error('Error sending ticket creation email to user:', error);
  }
}