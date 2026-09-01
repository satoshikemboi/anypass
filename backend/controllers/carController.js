import Car from "../models/Car.js";

// ==========================================
// STEP 1 — Validate vehicle information
// ==========================================
export const createCar = async (req, res) => {
  try {
    const {
      total_number,
      car_number,
      fleet_id,
    } = req.body;

    // Check required fields
    if (
      total_number === undefined ||
      car_number === undefined ||
      fleet_id === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "total_number, car_number and fleet_id are required",
      });
    }

    const totalNumber = String(total_number).trim();
    const carNumber = String(car_number).trim();
    const fleetId = String(fleet_id).trim();

    // total_number: 1–16 digits
    if (!/^\d{1,16}$/.test(totalNumber)) {
      return res.status(400).json({
        success: false,
        message:
          "total_number must contain 1–16 digits",
      });
    }

    // car_number: exactly 4 digits
    if (!/^\d{4}$/.test(carNumber)) {
      return res.status(400).json({
        success: false,
        message:
          "car_number must contain exactly 4 digits",
      });
    }

    // fleet_id: exactly 3 digits
    if (!/^\d{3}$/.test(fleetId)) {
      return res.status(400).json({
        success: false,
        message:
          "fleet_id must contain exactly 3 digits",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle information accepted",
      data: {
        total_number: totalNumber,
        car_number: carNumber,
        fleet_id: fleetId,
      },
    });
  } catch (error) {
    console.error("Create car error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// STEP 2 — Complete vehicle record
// ==========================================
export const verifyCar = async (req, res) => {
  try {
    const {
      total_number,
      car_number,
      fleet_id,
      parking_ticket_number,
    } = req.body;

    // Check all fields
    if (
      total_number === undefined ||
      car_number === undefined ||
      fleet_id === undefined ||
      parking_ticket_number === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All vehicle record fields are required",
      });
    }

    const totalNumber = String(total_number).trim();
    const carNumber = String(car_number).trim();
    const fleetId = String(fleet_id).trim();
    const parkingTicketNumber =
      String(parking_ticket_number).trim();

    // Validate total_number
    if (!/^\d{1,16}$/.test(totalNumber)) {
      return res.status(400).json({
        success: false,
        message:
          "total_number must contain 1–16 digits",
      });
    }

    // Validate car_number
    if (!/^\d{4}$/.test(carNumber)) {
      return res.status(400).json({
        success: false,
        message:
          "car_number must contain exactly 4 digits",
      });
    }

    // Validate fleet_id
    if (!/^\d{3}$/.test(fleetId)) {
      return res.status(400).json({
        success: false,
        message:
          "fleet_id must contain exactly 3 digits",
      });
    }

    // Validate parking ticket
    if (!/^\d{1,6}$/.test(parkingTicketNumber)) {
      return res.status(400).json({
        success: false,
        message:
          "parking_ticket_number must contain 1–6 digits",
      });
    }

    // Create complete record
    const car = await Car.create({
      total_number: totalNumber,
      car_number: carNumber,
      fleet_id: fleetId,
      parking_ticket_number: parkingTicketNumber,
    });

    return res.status(201).json({
      success: true,
      message:
        "Vehicle record created successfully",
      data: car,
    });
  } catch (error) {
    console.error("Verify car error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// GET ALL CARS
// ==========================================
export const getCars = async (req, res) => {
  try {
    const cars = await Car.find().sort({
      createdAt: -1,
    });

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
    const car = await Car.findByIdAndDelete(
      req.params.id
    );

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