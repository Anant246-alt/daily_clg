import nodemailer from "nodemailer";

const DEFAULT_EMAIL_USER = "dailyclgproject@gmail.com";
const DEFAULT_EMAIL_PASS = "wrbimcktkcejmipb";

export const sendEmail = async ({ to, subject, html }) => {
  const user = process.env.EMAIL_USER || DEFAULT_EMAIL_USER;
  const pass = process.env.EMAIL_PASS || DEFAULT_EMAIL_PASS;
  const from = process.env.EMAIL_FROM || `Daily <${user}>`;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user,
        pass,
      },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Nodemailer Success] Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Nodemailer Error] Failed to send email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};
