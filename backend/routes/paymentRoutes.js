import express from "express";
import { submitPayment } from "../controllers/paymentController.js";
import Payment from "../models/Payment.js";

const router = express.Router();

// Matches: POST http://localhost:5000/api/payments/submit
router.post("/submit", submitPayment);

// Matches: GET http://localhost:5000/api/payments/submit
router.get("/submit", async (req, res) => {
  console.log("=== GET /api/payments/submit route hit ===");
  try {
    const records = await Payment.find().sort({ createdAt: -1 });
    return res.status(200).json(records);
  } catch (err) {
    console.error("❌ Error fetching payment submissions:", err.message);
    return res.status(500).json({ message: "Failed to fetch payment submissions." });
  }
});

// 👇 ADD THIS NEW ROUTE HERE 👇
// Matches: DELETE http://localhost:5000/api/payments/:id
router.delete("/:id", async (req, res) => {
  console.log(`=== DELETE /api/payments/${req.params.id} route hit ===`);
  try {
    const { id } = req.params;
    const deletedRecord = await Payment.findByIdAndDelete(id);

    if (!deletedRecord) {
      return res.status(404).json({ message: "Transaction record not found." });
    }

    return res.status(200).json({ message: "Transaction deleted successfully." });
  } catch (err) {
    console.error("❌ Error deleting payment submission:", err.message);
    return res.status(500).json({ message: "Failed to delete transaction." });
  }
});

export default router;