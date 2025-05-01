import fs from "fs"
import path from "path"
import nodemailer from "nodemailer"

export async function POST(req) {
  const { email } = await req.json()

  if (!email) {
    return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 })
  }

  const filePath = path.join(process.cwd(), "emails.json")

  try {
    // Read existing emails
    let emails = []
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf8")
      emails = JSON.parse(fileData)
    }

    // Check for duplicate email
    if (emails.includes(email)) {
      return new Response(JSON.stringify({ error: "Email already subscribed" }), { status: 400 })
    }

    // Add new email to JSON file
    emails.push(email)
    fs.writeFileSync(filePath, JSON.stringify(emails, null, 2))

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // Your sender email (e.g., yourname@gmail.com) from .env.local
        pass: process.env.GMAIL_APP_PASSWORD, // App Password from .env.local
      },
    })

    // Email options
    const mailOptions = {
      from: process.env.GMAIL_USER, // Your sender email (appears as the "from" address)
      to: email, // Subscriber's email
      subject: "Welcome to SoulSoft Infotech Newsletter!",
      text: "Thank you for subscribing to our newsletter. Stay tuned for the latest updates from SoulSoft Infotech!",
      html: `
        <h2>Welcome to SoulSoft Infotech!</h2>
        <p>Thank you for joining our newsletter.</p>
        <p>Expect the latest news, updates, and exclusive offers from SoulSoft Infotech in your inbox.</p>
        <p><a href="https://yourwebsite.com/unsubscribe?email=${encodeURIComponent(email)}">Unsubscribe</a></p>
      `,
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return new Response(JSON.stringify({ message: "Subscribed successfully" }), { status: 200 })
  } catch (error) {
    console.error("Error handling subscription:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 })
  }
}