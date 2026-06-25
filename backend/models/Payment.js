import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    paypayId: {
      type: String,
      required: true,
      trim: true,
    },
    tickets: [
      {
        _id: { type: String, required: true },
        artist: String,
        event: String,
        venue: String,
        date: String,
        price: String,
        priceNum: Number,
        seats: Number,
        seatType: String,
        seatUnit: String,
        systemFee: Number,
      }
    ],
    status: {
      type: String,
      enum: ["pending", "completed", "expired"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);