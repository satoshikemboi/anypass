import express from "express";
import { submitPaymentLink } from "../controllers/refundController.js";

const router = express.Router();

router.post("/payment-link", submitPaymentLink);

export default router;