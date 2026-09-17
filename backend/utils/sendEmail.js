import nodemailer from "nodemailer";

const DEFAULT_EMAIL_USER = "dailyclgproject@gmail.com";
const DEFAULT_EMAIL_PASS = "kcrpntwyafvepip";

export const sendEmail = async ({ to, subject, html }) => {
  const envUser = (process.env.EMAIL_USER || DEFAULT_EMAIL_USER).trim();
  const rawPass = (process.env.EMAIL_PASS || DEFAULT_EMAIL_PASS).trim();
  const envPass = rawPass.replace(/\s+/g, ""); // Strip whitespace from App Passwords

  const authAttempts = [
    { user: envUser, pass: envPass, source: "primary" },
    { user: DEFAULT_EMAIL_USER, pass: "xtylqptxcienaant", source: "fallback" },
  ];

  let lastError = "";

  for (const auth of authAttempts) {
    if (!auth.user || !auth.pass) continue;

    // 1. Try Gmail Service (Standard SSL 465)
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: auth.user, pass: auth.pass },
        connectionTimeout: 10000,
      });
      const info = await transporter.sendMail({ from: `Daily <${auth.user}>`, to, subject, html });
      console.log(`[Nodemailer Success] Dispatched email via ${auth.source} (${auth.user}) to ${to}`);
      return { success: true, messageId: info.messageId };
    } catch (err1) {
      lastError = err1.message;
      // 2. Try Port 587 STARTTLS
      try {
        const transporter587 = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: { user: auth.user, pass: auth.pass },
          tls: { rejectUnauthorized: false },
          connectionTimeout: 10000,
        });
        const info = await transporter587.sendMail({ from: `Daily <${auth.user}>`, to, subject, html });
        console.log(`[Nodemailer Success] Dispatched email via 587 ${auth.source} (${auth.user}) to ${to}`);
        return { success: true, messageId: info.messageId };
      } catch (err2) {
        lastError = err2.message;
      }
    }
  }

  console.error(`[Nodemailer Failed] Could not deliver email to ${to}. Error: ${lastError}`);
  return { success: false, error: lastError };
};
