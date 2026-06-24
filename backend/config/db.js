import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log("URI String defined:", !!process.env.MONGO_URI); // Verifies if .env is actually loaded

    // Add serverSelectionTimeoutMS to stop it from hanging forever
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout limit
    });

    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("❌ MongoDB Connection Error Failure:");
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;