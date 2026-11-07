import User from "../models/User.js";
import { sendSignupNotification } from "../services/telegramService.js";

// Function to format join time
const formatJoinedAt = (date) =>
  new Date(date).toLocaleString("en-KE", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
    hour12: false,
  });

// GET /api/users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    const formattedUsers = users.map((user) => ({
      ...user.toObject(),
      joinedAt: formatJoinedAt(user.createdAt),
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET /api/users/:id
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      ...user.toObject(),
      joinedAt: formatJoinedAt(user.createdAt),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// POST /api/users/register
export const registerUser = async (req, res) => {
  try {
    const {
      name,
      fullName,
      email,
      phone,
      password,
    } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Create user
    // Ensure your User model hashes passwords before saving.
    const user = await User.create({
      name,
      fullName,
      email,
      phone,
      password,
    });

    // Send Telegram notification without blocking registration
    sendSignupNotification(user).catch((error) => {
      console.error("Signup Telegram notification failed:", error);
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        _id: user._id,
        name: user.name,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        joinedAt: formatJoinedAt(user.createdAt),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};