import { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const body = req.body

    // Create the email transport using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    })

    // Create the HTML content for the email
    const htmlContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Reason:</strong> ${body.reason}</p>
      <p><strong>Name:</strong> ${body.name}</p>
      <p><strong>Question:</strong> ${body.question}</p>
      <p><strong>Prior Research:</strong> ${body.priorResearch}</p>
      <p><strong>Contact Info:</strong> ${body.contactInfo}</p>
    `

    // Create the mail options
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `New Contact Form Submission: ${body.reason}`,
      text: `
        New Contact Form Submission:
        
        Reason: ${body.reason}
        Name: ${body.name}
        Question: ${body.question}
        Prior Research: ${body.priorResearch}
        Contact Info: ${body.contactInfo}
      `,
      html: htmlContent, // Using the formatted HTML content
    }

    // Send the email
    await transporter.sendMail(mailOptions)
    return res.status(200).json({ message: 'Email sent successfully' })
  } catch (error) {
    console.error('Error sending email:', error)
    return res.status(500).json({ error: 'Failed to send email' })
  }
}

export default handler
