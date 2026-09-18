import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const DEFAULT_EMAIL_USER = "dailyclgproject@gmail.com";
const DEFAULT_EMAIL_PASS = "kcrpntwyafcvepip";

export const sendEmail = async ({ to, subject, html }) => {
  const recipient = (to || "").trim().toLowerCase();
  if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
    return { success: false, error: "Invalid recipient email address" };
  }

  const envUser = (process.env.EMAIL_USER || DEFAULT_EMAIL_USER).trim();
  const rawPass = (process.env.EMAIL_PASS || DEFAULT_EMAIL_PASS).trim();
  const envPass = rawPass.replace(/\s+/g, ""); // Strip whitespace from App Passwords

  const attemptsMap = new Map();
  // 1. Try env variables first if present
  attemptsMap.set(`primary_${envPass}`, { user: envUser, pass: envPass, source: "primary_env" });
  // 2. Always include verified default credentials as a guaranteed fallback
  attemptsMap.set(`verified_${DEFAULT_EMAIL_PASS}`, { user: DEFAULT_EMAIL_USER, pass: DEFAULT_EMAIL_PASS, source: "verified_default" });

  const authAttempts = Array.from(attemptsMap.values());
  let lastError = "";

  for (const auth of authAttempts) {
    if (!auth.user || !auth.pass) continue;

    // 1. Try Gmail Service (Port 465 SSL)
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: auth.user, pass: auth.pass },
        connectionTimeout: 6000,
        greetingTimeout: 6000,
        socketTimeout: 10000,
      });
      const info = await transporter.sendMail({
        from: `Daily <${auth.user}>`,
        to: recipient,
        subject,
        html,
      });
      console.log(`[Nodemailer Success] Dispatched email via ${auth.source} (${auth.user}) to ${recipient}`);
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
          connectionTimeout: 6000,
          greetingTimeout: 6000,
          socketTimeout: 10000,
        });
        const info = await transporter587.sendMail({
          from: `Daily <${auth.user}>`,
          to: recipient,
          subject,
          html,
        });
        console.log(`[Nodemailer Success] Dispatched email via 587 ${auth.source} (${auth.user}) to ${recipient}`);
        return { success: true, messageId: info.messageId };
      } catch (err2) {
        lastError = err2.message;
      }
    }
  }

  console.error(`[Nodemailer Failed] Could not deliver email to ${recipient}. Error: ${lastError}`);
  return { success: false, error: lastError };
};
