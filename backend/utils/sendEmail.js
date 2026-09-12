import nodemailer from "nodemailer";

const DEFAULT_EMAIL_USER = "dailyclgproject@gmail.com";
const DEFAULT_EMAIL_PASS = "xtylqptxcienaant";

export const sendEmail = async ({ to, subject, html }) => {
  const envUser = process.env.EMAIL_USER;
  const envPass = process.env.EMAIL_PASS;
  const from = process.env.EMAIL_FROM || `Daily <${DEFAULT_EMAIL_USER}>`;

  // List of authentication credential pairs to attempt sequentially
  const authAttempts = [];

  if (envUser && envPass) {
    authAttempts.push({ user: envUser, pass: envPass, source: "env" });
  }
  // Always include verified default credentials as guaranteed fallback
  authAttempts.push({ user: DEFAULT_EMAIL_USER, pass: DEFAULT_EMAIL_PASS, source: "default" });

  let lastError = "";

  for (const auth of authAttempts) {
    // 1. Try Gmail Service
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: auth.user, pass: auth.pass },
      });
      const info = await transporter.sendMail({ from: `Daily <${auth.user}>`, to, subject, html });
      console.log(`[Nodemailer Success] Dispatched via ${auth.source} (${auth.user}) to ${to}`);
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
        });
        const info = await transporter587.sendMail({ from: `Daily <${auth.user}>`, to, subject, html });
        console.log(`[Nodemailer Success] Dispatched via 587 ${auth.source} (${auth.user}) to ${to}`);
        return { success: true, messageId: info.messageId };
      } catch (err2) {
        lastError = err2.message;
      }
    }
  }

  return { success: false, error: lastError };
};
