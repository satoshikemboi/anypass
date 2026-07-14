import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    artist: {
      type: String,
      required: true,
    },

    event: {
      type: String,
      required: true,
    },

    venue: {
      type: String,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    seatType: {
      type: String,
      required: true,
    },

    seatUnit: {
      type: String,
      enum: ["seat", "piece"],
      default: "seat",
    },

    seats: {
      type: Number,
      default: 1,
    },

    price: {
      type: String,
      required: true,
    },

    systemFee: {
      type: Number,
      required: true,
    },

    status: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Ticket", ticketSchema);