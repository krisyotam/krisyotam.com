import type { NextApiRequest, NextApiResponse } from "next"
import bcrypt from "bcryptjs"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { researchId, password } = req.body

  if (!researchId || !password) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  // Get the hashed password from environment variables
  const envPassword = process.env[`RESEARCH_${researchId}_PASSWORD`]

  if (!envPassword) {
    return res.status(404).json({ error: "Research ID not found" })
  }

  // Compare the provided password with the stored hash
  const isValid = await bcrypt.compare(password, envPassword)

  if (isValid) {
    return res.status(200).json({ success: true })
  } else {
    return res.status(401).json({ error: "Invalid password" })
  }
}
