import nodemailer from "nodemailer";

const DEFAULT_EMAIL_USER = "dailyclgproject@gmail.com";
const DEFAULT_EMAIL_PASS = "wrbimcktkcejmipb";

export const sendEmail = async ({ to, subject, html }) => {
  const user = process.env.EMAIL_USER || DEFAULT_EMAIL_USER;
  const pass = process.env.EMAIL_PASS || DEFAULT_EMAIL_PASS;
  const from = process.env.EMAIL_FROM || `Daily <${user}>`;

  // Try Port 587 STARTTLS first (best for serverless cloud environments), fallback to 465
  const createTransporter = (port, secure) =>
    nodemailer.createTransport({
      host: "smtp.gmail.com",
      port,
      secure,
      auth: { user, pass },
      connectionTimeout: 3000,
      greetingTimeout: 3000,
      socketTimeout: 3000,
      tls: { rejectUnauthorized: false },
    });

  try {
    const transporter = createTransporter(587, false);
    const info = await transporter.sendMail({ from, to, subject, html });
    console.log(`[Nodemailer Success 587] Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error587) {
    console.warn(`[Nodemailer Notice 587] ${error587.message}, trying port 465...`);
    try {
      const transporter465 = createTransporter(465, true);
      const info = await transporter465.sendMail({ from, to, subject, html });
      console.log(`[Nodemailer Success 465] Email sent to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error465) {
      console.error(`[Nodemailer Error] Failed to send email to ${to}:`, error465.message);
      return { success: false, error: error465.message };
    }
  }
};
