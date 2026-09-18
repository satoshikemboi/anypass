import express from "express";
import {
  getRefundRequests,
  createRefundRequest,
} from "../controllers/refundRequestController.js";

const router = express.Router();

// POST /api/refunds
router.post("/", createRefundRequest);
router.get("/", getRefundRequests);

export default router;