// server/routes/appointmentRoutes.js
import express from "express";
import { bookAppointment, getAppointments,updateAppointmentStatus, getAppointmentsByDoctor, getAppointmentsByPatient } from "../controllers/appointmentController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  getDoctorStats,
  getDoctorToday,
  getDoctorRecent,
  getDoctorAppointments
} from "../controllers/appointmentController.js";
const router = express.Router();

// Doctor Dashboard Routes
router.get("/doctor/:doctorId/stats", getDoctorStats);
router.get("/doctor/:doctorId/today", getDoctorToday);
router.get("/doctor/:doctorId/recent", getDoctorRecent);

// Fallback/Full list
router.get("/doctor/:doctorId", getDoctorAppointments);



router.post("/bookAppointment", bookAppointment);
//router.get("/", getAppointments);
router.get("/doctor/:doctorId", getAppointmentsByDoctor);
router.get("/patient/:patientId", protect, getAppointmentsByPatient);
// PUT /appointments/:id/status
router.put("/:id/status", updateAppointmentStatus);


export default router;

