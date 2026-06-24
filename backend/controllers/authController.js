import User from "../models/User.js";

export const signup = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      username,
      password,
    } = req.body;

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
    res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } =
      req.body;

    const user =
      await User.findOne({ email });

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

    res.status(200).json({
      message: "Login successful",
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};