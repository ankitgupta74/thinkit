import nodemailer from "nodemailer";

// Email service configuration used for sending application emails.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  // Login credentials for the SMTP server.
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Reusable transporter instance.
export default transporter;

// Simple helper used anywhere an email needs to be sent.
export async function sendEmail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
  }) {
    // Sends the actual email through the configured SMTP server.
    return transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      // Email content is sent as HTML.
      html: body,
    });
  }