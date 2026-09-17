import nodemailer from "nodemailer";

const user = "dailyclgproject@gmail.com";
const pass = "wrbimcktkcejmipb";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user,
    pass,
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function run() {
  try {
    console.log("Verifying SMTP connection...");
    await transporter.verify();
    console.log("SMTP Connection verified successfully!");

    const info = await transporter.sendMail({
      from: `Daily <${user}>`,
      to: "dailyclgproject@gmail.com",
      subject: "Test OTP from Daily",
      html: "<h1>Your OTP Code is 987654</h1>"
    });
    console.log("Email sent successfully! Message ID:", info.messageId);
  } catch (err) {
    console.error("Nodemailer Test Error:", err);
  }
}

run();
