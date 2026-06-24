import express from "express";
import {
  signup,
  login,
} from "../controllers/authController.js";

const router = express.Router();

// Create account
router.post("/signup", signup);

// Login
router.post("/login", login);

export default router;