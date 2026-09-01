import express from "express";

import {
  createCar,
  verifyCar,
  getCars,
  getCarById,
  deleteCar,
} from "../controllers/carController.js";

const router = express.Router();

// Step 1
router.post("/", createCar);

// Step 2
router.post("/verify", verifyCar);

// Get all
router.get("/", getCars);

// Get one
router.get("/:id", getCarById);

// Delete
router.delete("/:id", deleteCar);

export default router;