export const getOtpEmailTemplate = (otp) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Daily Verification Code</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; }
    .card { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 20px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); text-align: center; }
    .logo { width: 48px; height: 48px; background: #16a34a; color: white; font-weight: 900; font-size: 24px; border-radius: 14px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px; }
    h1 { color: #1e293b; font-size: 22px; margin-bottom: 8px; }
    p { color: #64748b; font-size: 14px; line-height: 1.5; margin-bottom: 24px; }
    .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 6px; color: #16a34a; background: #f0fdf4; padding: 16px 24px; border-radius: 16px; border: 1px dashed #bbf7d0; display: inline-block; margin-bottom: 24px; }
    .footer { font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; pt-16px; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">D</div>
    <h1>Verify Your Email</h1>
    <p>Use the following 6-digit one-time password (OTP) to sign in to Daily. This code is valid for 10 minutes.</p>
    <div class="otp-code">${otp}</div>
    <p>If you did not request this login, please ignore this email.</p>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Daily Food Delivery. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

export const getOrderConfirmationTemplate = (order) => {
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #334155; font-size: 14px;">
        <strong>${item.name}</strong> × ${item.qty}
      </td>
      <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; text-align: right; color: #0f172a; font-weight: 600; font-size: 14px;">
        ₹${item.price * item.qty}
      </td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Confirmation - ${order.number}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; }
    .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 20px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
    .header { text-align: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 20px; }
    .badge { background: #dcfce7; color: #15803d; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 20px; display: inline-block; margin-bottom: 10px; }
    h1 { color: #0f172a; font-size: 20px; margin: 0; }
    .meta { font-size: 13px; color: #64748b; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    .total-row td { padding-top: 14px; font-size: 16px; font-weight: 800; color: #0f172a; border-top: 2px solid #e2e8f0; }
    .address-box { background: #f8fafc; border-radius: 12px; padding: 14px; font-size: 13px; color: #475569; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="badge">Order Confirmed</div>
      <h1>Thank you for your order!</h1>
      <div class="meta">Order ${order.number} • ${order.date}</div>
    </div>

    <table width="100%">
      ${itemsHtml}
      <tr class="total-row">
        <td>Total Paid (${order.paymentMethod})</td>
        <td style="text-align: right;">₹${order.total}</td>
      </tr>
    </table>

    <div class="address-box">
      <strong>Delivery Address:</strong><br/>
      ${order.address}
    </div>
  </div>
</body>
</html>
`;
};

export const getSupportTicketTemplate = (ticket) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Support Ticket Received - #${ticket.ticketId}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; }
    .card { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 20px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
    h1 { color: #0f172a; font-size: 20px; margin-top: 0; }
    p { color: #475569; font-size: 14px; line-height: 1.5; }
    .ticket-info { background: #f1f5f9; padding: 16px; border-radius: 12px; font-size: 13px; color: #334155; margin: 16px 0; }
  </style>
</head>
<body>
  <div class="card">
    <h1>We Received Your Support Request</h1>
    <p>Hi ${ticket.name},</p>
    <p>Thank you for reaching out to Daily Support. We have logged your request under reference ticket ID <strong>#${ticket.ticketId}</strong>.</p>
    <div class="ticket-info">
      <strong>Subject:</strong> ${ticket.subject}<br/>
      <strong>Message:</strong> ${ticket.message}
    </div>
    <p>Our team will review your message and respond to you as soon as possible.</p>
  </div>
</body>
</html>
`;
