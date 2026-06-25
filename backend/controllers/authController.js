import jwt from "jsonwebtoken";
import User from "../models/User.js";

// JWT Secret Key (In production, place this in your .env file!)
const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key_12345";

export const signup = async (req, res) => {
  try {
    const { fullName, email, phone, username, password } = req.body;

    const user = await User.create({
      fullName,
      email,
      phone,
      username,
      password,
    });

    res.status(201).json({
      message: "Account created",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    /* ── FIX: Generate a real JWT token using the user's ID ── */
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      message: "Login successful",
      token, // Sending token out to the frontend!
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ── NEW: Profile Fetch Controller ── */
export const getProfile = async (req, res) => {
  try {
    // req.user comes from the middleware layer we'll build in Step 2
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile loaded successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};