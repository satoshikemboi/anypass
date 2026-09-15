import Payment from "../models/Payment.js";
import axios from "axios";

export const submitPayment = async (req, res) => {
  console.log("=== POST /api/payments/submit route hit ===");

  try {
    const { paypayId, tickets } = req.body;

    // Validation
    if (!paypayId || !paypayId.trim()) {
      return res.status(400).json({
        message: "PayPay ID is required.",
      });
    }

    if (!tickets || tickets.length === 0) {
      return res.status(400).json({
        message: "No tickets provided for this purchase.",
      });
    }

    // Save payment request to database
    const newPayment = await Payment.create({
      paypayId: paypayId.trim(),
      tickets,
      status: "pending",
    });

    console.log(
      `✅ Saved payment request successfully. ID: ${newPayment._id} (${tickets.length} tickets)`
    );

    // Send payment information to Telegram
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const ticketText = tickets
      .map((ticket, index) => {
        return `${index + 1}. ${JSON.stringify(ticket)}`;
      })
      .join("\n");

    await axios.post(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        chat_id: chatId,
        text:
          `💰 NEW PAYPAY PAYMENT\n\n` +
          `PayPay ID: ${paypayId.trim()}\n\n` +
          `Tickets: ${tickets.length}\n\n` +
          `${ticketText}`,
      }
    );

    console.log("✅ Payment information sent to Telegram");

    return res.status(200).json({
      success: true,
      message: "PayPay details received successfully.",
      paymentId: newPayment._id,
    });

  } catch (err) {
    console.error(
      "❌ Error caught inside submitPayment controller:",
      err.response?.data || err.message
    );

    return res.status(500).json({
      message: "Failed to submit PayPay payment.",
    });
  }
};