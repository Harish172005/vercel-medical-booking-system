import express from "express";
import { 
  getDoctorAvailability,
  addDoctorAvailability,
  deleteDoctorAvailability
} from "../controllers/availabilityController.js";
import { protect, isDoctor } from "../middleware/authMiddleware.js";

const router = express.Router();

// fetch availability using doctorId
router.get("/:doctorId", protect, getDoctorAvailability);


// add availability using doctorId
router.post("/:doctorId", protect, isDoctor, addDoctorAvailability);

// delete availability using availabilityId
router.delete("/:availabilityId", protect, isDoctor, deleteDoctorAvailability);

export default router;

