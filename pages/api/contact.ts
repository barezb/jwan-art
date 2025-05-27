import { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse } from "../../types";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const { name, email, subject, message }: ContactFormData = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email address",
      });
    }

    // Here you would typically:
    // 1. Send an email using a service like SendGrid, Nodemailer, etc.
    // 2. Save the message to your database
    // 3. Send a notification to the admin

    // For now, we'll just log the message and return success
    console.log("Contact form submission:", {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
    });

    // Example of how you might send an email:
    /*
    import sgMail from '@sendgrid/mail'
    
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!)
    
    const msg = {
      to: process.env.CONTACT_EMAIL, // Your email
      from: process.env.FROM_EMAIL, // Verified sender
      subject: `Contact Form: ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    }
    
    await sgMail.send(msg)
    */

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully!",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to send message. Please try again later.",
    });
  }
}