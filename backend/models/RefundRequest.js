import mongoose from "mongoose";

const refundRequestSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    paypayId: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    note: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "under_review",
        "approved",
        "rejected",
        "completed",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const RefundRequest = mongoose.model(
  "RefundRequest",
  refundRequestSchema
);

export default RefundRequest;