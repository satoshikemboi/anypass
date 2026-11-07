
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendSignupNotification } from "../services/telegramService.js";

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key_12345";

// POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const { fullName, email, phone, username, password } = req.body;

    // Check required fields
    if (!fullName || !email || !phone || !username || !password) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // Check if email or username already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email or username already exists",
      });
    }

    // Create new user
    const user = await User.create({
      fullName,
      email,
      phone,
      username,
      password,
    });

    // Send Telegram notification
    // Notification failure will not affect registration
    sendSignupNotification(user).catch((error) => {
      console.error("Telegram signup notification failed:", error.message);
    });

    // Return successful registration
    res.status(201).json({
      message: "Account created",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        username: user.username,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET /api/auth/profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile loaded successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};