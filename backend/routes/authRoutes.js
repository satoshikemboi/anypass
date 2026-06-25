import express from "express";
import {
  signup,
  login,
  getProfile
} from "../controllers/authController.js";
import { protect } from "../controllers/authMiddleware.js";

const router = express.Router();

// Create account
router.post("/signup", signup);

// Login
router.post("/login", login);
router.get("/profile", protect, getProfile);

export default router;