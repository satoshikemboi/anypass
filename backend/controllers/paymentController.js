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

    if (!Array.isArray(tickets) || tickets.length === 0) {
      return res.status(400).json({
        message: "No tickets provided for this purchase.",
      });
    }

    // Save payment
    const newPayment = await Payment.create({
      paypayId: paypayId.trim(),
      tickets,
      status: "pending",
    });

    console.log(
      `✅ Saved payment request successfully. ID: ${newPayment._id}`
    );

    // Telegram
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Format tickets as normal text — NO JSON.stringify()
    const ticketText = tickets
      .map((ticket, index) => {
        const price = Number(
          String(ticket.price || "0").replace(/[¥,]/g, "")
        );

        const systemFee = Number(ticket.systemFee || 0);
        const quantity = Number(ticket.seats || 1);

        // Price per ticket × quantity + system fee
        const totalAmount = price * quantity + systemFee;

        return [
          `🎫 Ticket ${index + 1}`,
          `Event: ${ticket.event || "N/A"}`,
          `Artist: ${ticket.artist || "N/A"}`,
          `Venue: ${ticket.venue || "N/A"}`,
          `Date: ${ticket.date || "N/A"}`,
          `Seat Type: ${ticket.seatType || "N/A"}`,
          `Number of tickets: ${quantity}`,
          `Price per ticket: ¥${price.toLocaleString()}`,
          `System fee: ¥${systemFee.toLocaleString()}`,
          `Total amount: ¥${totalAmount.toLocaleString()}`,
        ].join("\n");
      })
      .join("\n\n");

    const telegramMessage =
      `💰 NEW PAYPAY PAYMENT\n\n` +
      `PayPay ID: ${paypayId.trim()}\n\n` +
      `${ticketText}`;

    console.log("📨 Telegram message:");
    console.log(telegramMessage);

    await axios.post(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        chat_id: chatId,
        text: telegramMessage,
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
