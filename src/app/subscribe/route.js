import fs from "fs"
import path from "path"

export async function POST(req) {
  const { email } = await req.json()

  if (!email) {
    return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 })
  }

  const filePath = path.join(process.cwd(), "emails.json")

  try {
    let emails = []
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf8")
      emails = JSON.parse(fileData)
    }

    if (emails.includes(email)) {
      return new Response(JSON.stringify({ error: "Email already subscribed" }), { status: 400 })
    }

    emails.push(email)
    fs.writeFileSync(filePath, JSON.stringify(emails, null, 2))

    return new Response(JSON.stringify({ message: "Subscribed successfully" }), { status: 200 })
  } catch (error) {
    console.error("Error handling subscription:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 })
  }
}