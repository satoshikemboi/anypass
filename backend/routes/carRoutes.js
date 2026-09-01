import express from "express";

import {
  createCar,
  getCars,
  getCarById,
  deleteCar,
} from "../controllers/carController.js";

const router = express.Router();

// Create car / parking record
router.post("/", createCar);

// Get all car records
router.get("/", getCars);

// Get one car record
router.get("/:id", getCarById);

// Delete car record
router.delete("/:id", deleteCar);

export default router;