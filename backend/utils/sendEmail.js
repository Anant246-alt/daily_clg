import nodemailer from "nodemailer";

const DEFAULT_EMAIL_USER = "dailyclgproject@gmail.com";
const DEFAULT_EMAIL_PASS = "wrbimcktkcejmipb";

export const sendEmail = async ({ to, subject, html }) => {
  const user = process.env.EMAIL_USER || DEFAULT_EMAIL_USER;
  const pass = process.env.EMAIL_PASS || DEFAULT_EMAIL_PASS;
  const from = process.env.EMAIL_FROM || `Daily <${user}>`;

  // 1. Try Official Nodemailer Gmail Service first
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
    const info = await transporter.sendMail({ from, to, subject, html });
    return { success: true, messageId: info.messageId };
  } catch (err1) {
    // 2. Fallback to Port 587 STARTTLS
    try {
      const transporter587 = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
      });
      const info = await transporter587.sendMail({ from, to, subject, html });
      return { success: true, messageId: info.messageId };
    } catch (err2) {
      // Return false silently without printing red error text into Vercel logs
      return { success: false, error: err2.message };
    }
  }
};
