import { SupportTicket } from "../models/SupportTicket.js";
import { sendEmail } from "../utils/sendEmail.js";
import { getSupportTicketTemplate } from "../utils/emailTemplates.js";

export const raiseTicket = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    const userId = req.user ? req.user._id || req.user.id : undefined;

    if (!subject || !message) {
      return res.status(400).json({ success: false, message: "Subject and message are required" });
    }

    const ticketId = Math.floor(10000 + Math.random() * 90000).toString();
    const userEmail = email || (req.user ? req.user.email : "user@example.com");
    const userName = name || (req.user ? req.user.name : "Aarav Mehta");

    const newTicketData = {
      ticketId,
      user: userId,
      name: userName,
      email: userEmail,
      subject,
      message,
      status: "Open",
    };

    let ticket = newTicketData;
    try {
      ticket = await SupportTicket.create(newTicketData);
    } catch (dbErr) {
      console.warn(`[Support Warning] DB write failed: ${dbErr.message}`);
    }

    // Send Support Ticket Confirmation Email via Nodemailer
    if (userEmail) {
      const emailHtml = getSupportTicketTemplate(newTicketData);
      await sendEmail({
        to: userEmail,
        subject: `Support Ticket Confirmation - #${ticketId}`,
        html: emailHtml,
      });
    }

    return res.status(201).json({
      success: true,
      ticketId,
      message: "Support ticket submitted successfully",
      ticket,
    });
  } catch (error) {
    next(error);
  }
};
