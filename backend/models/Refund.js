import mongoose from "mongoose";

const refundSchema = new mongoose.Schema(
  {
    paymentLink: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "processing", "confirmed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Refund", refundSchema);