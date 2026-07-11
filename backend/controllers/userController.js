// controllers/userController.js

import User from "../models/User.js";

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