import type { NextApiRequest, NextApiResponse } from "next"
import nodemailer from "nodemailer"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { researchId, title, name, institution, reason, return: returnAddress } = req.body

  if (!researchId || !title || !name || !institution || !reason || !returnAddress) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  try {
    // Create reusable transporter object using Gmail's SMTP transport with SSL
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",  // Gmail's SMTP server
      port: 465,  // SSL port
      secure: true,  // Use SSL for secure connection
      auth: {
        user: process.env.EMAIL_USER,  // Your Gmail address
        pass: process.env.EMAIL_PASSWORD,  // Your Gmail app password (if 2FA enabled)
      },
    })

    // Email template with returnAddress added
    const emailContent = `
      New Research Access Request
      
      Research ID: ${researchId}
      Title: ${title}
      
      Requester Information:
      Name: ${name}
      Institution: ${institution}
      
      Reason for Access:
      ${reason}
      
      To grant access, please provide the requester with the appropriate password.

      Return Address:
      ${returnAddress}
    `

    // Send email with a return address
    await transporter.sendMail({
      from: process.env.EMAIL_USER,  // From your Gmail address
      to: "krisyotam@protonmail.com",  // Recipient email address
      subject: `Research Access Request: ${title}`,
      text: emailContent,
      replyTo: returnAddress,  // Set the return (reply-to) address
    })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error("Error sending email:", error)
    return res.status(500).json({ error: "Failed to send access request" })
  }
}