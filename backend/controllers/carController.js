import Car from "../models/Car.js";

// Helper function to send messages to your Telegram bot
const sendTelegramNotification = async (message) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn("Telegram credentials missing in environment variables.");
    return;
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });
  } catch (error) {
    console.error("Failed to send Telegram notification:", error.message);
  }
};

// ==========================================
// STEP 1 — Save initial vehicle information
// ==========================================
export const createCar = async (req, res) => {
  try {
    const { total_number, car_number, fleet_id } = req.body;

    // Check required fields
    if (
      total_number === undefined ||
      car_number === undefined ||
      fleet_id === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "total_number, car_number and fleet_id are required",
      });
    }

    const totalNumber = String(total_number).trim();
    const carNumber = String(car_number).trim();
    const fleetId = String(fleet_id).trim();

    // Validate inputs
    if (!/^\d{1,16}$/.test(totalNumber)) {
      return res.status(400).json({
        success: false,
        message: "total_number must contain 1–16 digits",
      });
    }

    if (!/^\d{4}$/.test(carNumber)) {
      return res.status(400).json({
        success: false,
        message: "car_number must contain exactly 4 digits",
      });
    }

    if (!/^\d{3}$/.test(fleetId)) {
      return res.status(400).json({
        success: false,
        message: "fleet_id must contain exactly 3 digits",
      });
    }

    // CREATE pending record in database
    const car = await Car.create({
      total_number: totalNumber,
      car_number: carNumber,
      fleet_id: fleetId,
      parking_ticket_number: null,
    });

    // Notify Telegram Bot for Step 1
    const telegramMessage = 
      `🚨 <b>New Vehicle Submission (Step 1)</b>\n\n` +
      `<b>ID:</b> <code>${car._id}</code>\n` +
      `<b>Total Number:</b> ${totalNumber}\n` +
      `<b>Car Number:</b> ${carNumber}\n` +
      `<b>Fleet ID:</b> ${fleetId}\n` +
      `<b>Status:</b> ⏳ Awaiting Parking Ticket`;

    sendTelegramNotification(telegramMessage);

    return res.status(201).json({
      success: true,
      message: "Vehicle information saved (Step 1 complete)",
      data: car,
    });
  } catch (error) {
    console.error("Create car error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// ==========================================
// STEP 2 — Match & update record with ticket
// ==========================================
export const verifyCar = async (req, res) => {
  try {
    const {
      total_number,
      car_number,
      fleet_id,
      parking_ticket_number,
      car_id,
    } = req.body;

    // Check required fields
    if (
      total_number === undefined ||
      car_number === undefined ||
      fleet_id === undefined ||
      parking_ticket_number === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All vehicle record fields are required",
      });
    }

    const totalNumber = String(total_number).trim();
    const carNumber = String(car_number).trim();
    const fleetId = String(fleet_id).trim();
    const parkingTicketNumber = String(parking_ticket_number).trim();

    // Validate inputs
    if (!/^\d{1,16}$/.test(totalNumber)) {
      return res.status(400).json({
        success: false,
        message: "total_number must contain 1–16 digits",
      });
    }

    if (!/^\d{4}$/.test(carNumber)) {
      return res.status(400).json({
        success: false,
        message: "car_number must contain exactly 4 digits",
      });
    }

    if (!/^\d{3}$/.test(fleetId)) {
      return res.status(400).json({
        success: false,
        message: "fleet_id must contain exactly 3 digits",
      });
    }

    if (!/^\d{1,6}$/.test(parkingTicketNumber)) {
      return res.status(400).json({
        success: false,
        message: "parking_ticket_number must contain 1–6 digits",
      });
    }

    // MATCH EXISTING RECORD
    let car;
    if (car_id) {
      car = await Car.findById(car_id);
    } else {
      car = await Car.findOne({
        total_number: totalNumber,
        car_number: carNumber,
        fleet_id: fleetId,
        parking_ticket_number: null,
      }).sort({ createdAt: -1 });
    }

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Matching Step 1 record not found",
      });
    }

    // UPDATE record with parking ticket
    car.parking_ticket_number = parkingTicketNumber;
    await car.save();

    // Notify Telegram Bot for Step 2
    const telegramMessage = 
      `✅ <b>Vehicle Registration Completed (Step 2)</b>\n\n` +
      `<b>ID:</b> <code>${car._id}</code>\n` +
      `<b>Total Number:</b> ${car.total_number}\n` +
      `<b>Car Number:</b> ${car.car_number}\n` +
      `<b>Fleet ID:</b> ${car.fleet_id}\n` +
      `<b>Parking Ticket:</b> ${parkingTicketNumber}\n` +
      `<b>Status:</b> 🎉 Verified & Complete`;

    sendTelegramNotification(telegramMessage);

    return res.status(200).json({
      success: true,
      message: "Vehicle record completed successfully",
      data: car,
    });
  } catch (error) {
    console.error("Verify car error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// ==========================================
// GET ALL CARS
// ==========================================
export const getCars = async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: cars.length,
      data: cars,
    });
  } catch (error) {
    console.error("Get cars error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// GET ONE CAR
// ==========================================
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car record not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: car,
    });
  } catch (error) {
    console.error("Get car error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// DELETE CAR
// ==========================================
export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Car record deleted successfully",
    });
  } catch (error) {
    console.error("Delete car error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};