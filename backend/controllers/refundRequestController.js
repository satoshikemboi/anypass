
import RefundRequest from "../models/RefundRequest.js";

const sendTelegramMessage = async (message) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    throw new Error("Telegram credentials are missing.");
  }

  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const response = await fetch(telegramUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "HTML",
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(
      data.description || "Failed to send Telegram message."
    );
  }

  return data;
};

// POST: Submit refund request
export const createRefundRequest = async (req, res) => {
  console.log("=== POST /api/refunds ===");

  try {
    const {
      ticketNumber,
      fullName,
      phone,
      email,
      paypayId,
      amount,
      note,
    } = req.body;

    // Validate required fields
    if (
      !ticketNumber ||
      !fullName ||
      !phone ||
      !email ||
      !paypayId ||
      amount === undefined ||
      amount === null ||
      !note
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    const refundAmount = Number(amount);

    if (!Number.isFinite(refundAmount) || refundAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid refund amount.",
      });
    }

    // Clean input values
    const cleanTicketNumber = String(ticketNumber).trim();
    const cleanFullName = String(fullName).trim();
    const cleanPhone = String(phone).trim();
    const cleanEmail = String(email).trim();
    const cleanPaypayId = String(paypayId).trim();
    const cleanNote = String(note).trim();

    // Prevent duplicate ticket numbers
    const existingRequest = await RefundRequest.findOne({
      ticketNumber: cleanTicketNumber,
    });

    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message: "This refund request already exists.",
      });
    }

    // Create refund request in MongoDB
    const refundRequest = await RefundRequest.create({
      ticketNumber: cleanTicketNumber,
      fullName: cleanFullName,
      phone: cleanPhone,
      email: cleanEmail,
      paypayId: cleanPaypayId,
      amount: refundAmount,
      note: cleanNote,
      status: "pending",
    });

    // Escape HTML special characters for Telegram
    const escapeHtml = (value) =>
      String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Format Telegram notification
    const telegramMessage = `
<b>🔔 NEW REFUND REQUEST</b>

<b>🎫 Ticket Number:</b>
${escapeHtml(cleanTicketNumber)}

<b>👤 Full Name:</b>
${escapeHtml(cleanFullName)}

<b>📞 Phone:</b>
${escapeHtml(cleanPhone)}

<b>📧 Email:</b>
${escapeHtml(cleanEmail)}

<b>💳 PayPay ID:</b>
${escapeHtml(cleanPaypayId)}

<b>💴 Refund Amount:</b>
¥${refundAmount.toLocaleString("en-US")}

<b>📝 Note:</b>
${escapeHtml(cleanNote)}

<b>📌 Status:</b>
Pending

<b>🆔 Request ID:</b>
${escapeHtml(refundRequest._id)}

<b>⏰ Submitted:</b>
${escapeHtml(refundRequest.createdAt.toISOString())}
`;

    // Send notification to Telegram
    try {
      await sendTelegramMessage(telegramMessage);

      console.log("Telegram notification sent successfully.");
    } catch (telegramError) {
      console.error(
        "Telegram notification failed:",
        telegramError.message
      );

      // The refund is already saved in MongoDB.
      // Do not falsely report the Telegram notification as sent.
    }

    // Return success response
    return res.status(201).json({
      success: true,
      message: "Refund request submitted successfully.",
      refundRequest: {
        id: refundRequest._id,
        ticketNumber: refundRequest.ticketNumber,
        status: refundRequest.status,
        createdAt: refundRequest.createdAt,
      },
    });
  } catch (error) {
    console.error("Refund submission error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while submitting refund request.",
    });
  }
};

// GET: Fetch all refund requests (Admin)
export const getRefundRequests = async (req, res) => {
  console.log("=== GET /api/refundRequest ===");

  try {
    const refundRequests = await RefundRequest.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      refundRequests,
    });
  } catch (error) {
    console.error("Fetch refund requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching refund requests.",
    });
  }
};