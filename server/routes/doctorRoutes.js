import express from "express";
import {
  getSpecializations,
  getDoctorsBySpecialization,
  createDoctor,
  getAllDoctors,
  getDoctorProfile,
  updateDoctor,
  getDoctorById,
  getDoctors,
  getRegions
} from "../controllers/doctorController.js";
import { protect,isDoctor } from "../middleware/authMiddleware.js";

const router = express.Router();


// route
router.post("/register",  createDoctor);

router.get("/profile", protect, isDoctor, getDoctorProfile); // Doctor gets own profile
router.put("/:id", protect, isDoctor, updateDoctor);

// GET all appointments for a doctor

router.get("/", getDoctors);
router.get("/:id", getDoctorById);


export default router;
