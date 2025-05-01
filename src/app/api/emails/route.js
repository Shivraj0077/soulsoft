import fs from "fs"
import path from "path"

export async function GET() {
  const filePath = path.join(process.cwd(), "emails.json")

  try {
    if (!fs.existsSync(filePath)) {
      return new Response(JSON.stringify({ emails: [] }), { status: 200 })
    }

    const fileData = fs.readFileSync(filePath, "utf8")
    const emails = JSON.parse(fileData)
    return new Response(JSON.stringify({ emails }), { status: 200 })
  } catch (error) {
    console.error("Error retrieving emails:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 })
  }
}