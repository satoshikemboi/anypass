import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    total_number: {
      type: String,
      required: true,
      match: /^\d{1,16}$/,
    },

    car_number: {
      type: String,
      required: true,
      match: /^\d{4}$/,
    },

    fleet_id: {
      type: String,
      required: true,
      match: /^\d{3}$/,
    },

    parking_ticket_number: {
      type: String,
      required: false,
      default: null,
      match: /^\d{1,6}$/,
    },
  },
  {
    timestamps: true,
  }
);

const Car = mongoose.model("Car", carSchema);

export default Car;