import axios from "axios";

export const submitPaymentLink = async (req, res) => {
  try {
    const { paymentLink } = req.body;

    if (!paymentLink) {
      return res.status(400).json({
        message: "PayPay payment link is required",
      });
    }

    if (!paymentLink.startsWith("https://pay.paypay.ne.jp/")) {
      return res.status(400).json({
        message: "Invalid PayPay payment link",
      });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    await axios.post(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        chat_id: chatId,
        text: `💰 New PayPay Payment Link\n\n${paymentLink}`,
      }
    );

    console.log("PayPay payment link sent to Telegram:", paymentLink);

    return res.status(200).json({
      message: "PayPay payment link submitted successfully",
      paymentLink,
    });
  } catch (error) {
    console.error(
      "Submit payment link error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      message: "Failed to send payment link to Telegram",
    });
  }
};