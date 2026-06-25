import Payment from "../models/Payment.js";

export const submitPayment = async (req, res) => {
  console.log("=== POST /api/payments/submit route hit ===");
  
  try {
    const { paypayId, tickets } = req.body;

    // Validation
    if (!paypayId) {
      return res.status(400).json({ message: "PayPay ID is required." });
    }
    if (!tickets || tickets.length === 0) {
      return res.status(400).json({ message: "No tickets provided for this purchase." });
    }

    // Save the payment request to the database
    const newPayment = await Payment.create({
      paypayId: paypayId.trim(),
      tickets: tickets,
      status: "pending"
    });

    console.log(`✅ Saved payment request successfully. ID: ${newPayment._id} (${tickets.length} tickets)`);

    return res.status(200).json({
      success: true,
      message: "PayPay details received successfully.",
      paymentId: newPayment._id
    });

  } catch (err) {
    console.error("❌ Error caught inside submitPayment controller:", err.message);
    return res.status(500).json({
      message: err.message,
    });
  }
};