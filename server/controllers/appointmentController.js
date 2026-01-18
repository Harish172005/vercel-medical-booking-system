import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import Availability from "../models/Availability.js";


export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, patientId, date, timeSlot } = req.body;

    // Validate inputs
    if (!doctorId || !patientId || !date || !timeSlot) {
      return res.status(400).json({
        message: "doctorId, patientId, date, and timeSlot are required",
      });
    }

    // Check doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Check patient exists
    const patient = await User.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Check availability exists
    const availability = await Availability.findOne({
      doctor: doctorId,
      date: date,
    });

    if (!availability) {
      return res
        .status(404)
        .json({ message: "No availability found for this date" });
    }

    // Slot must exist
    if (!availability.slots.includes(timeSlot)) {
      return res.status(400).json({
        message: "Selected time slot is not available",
      });
    }

    // Check if appointment already exists for same doctor, date, timeSlot
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date,
      timeSlot,
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "This time slot is already booked. Choose another slot.",
      });
    }

    // Create the appointment
    const appointment = new Appointment({
      doctorId,
      patientId,
      date,
      timeSlot,
      status: "pending",
    });

    await appointment.save();

    // Remove the booked slot from availability
    availability.slots = availability.slots.filter((s) => s !== timeSlot);
    await availability.save();

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Server error while booking appointment" });
  }
};
// controllers/appointmentController.js

import { startOfDay, endOfDay, subDays } from "date-fns";


// -----------------------------------------------------
// 1) DOCTOR DASHBOARD STATS
// -----------------------------------------------------
export const getDoctorStats = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const total = await Appointment.countDocuments({ doctorId });

    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const today = await Appointment.countDocuments({
      doctorId,
      date: { $gte: todayStart, $lte: todayEnd }
    });

    const pending = await Appointment.countDocuments({ doctorId, status: "pending" });
    const confirmed = await Appointment.countDocuments({ doctorId, status: "confirmed" });
    const cancelled = await Appointment.countDocuments({ doctorId, status: "cancelled" });

    // Trend — last 7 days
    const last7 = subDays(new Date(), 7);

    const trendRaw = await Appointment.aggregate([
      {
        $match: {
          doctorId: doctorId,
          date: { $gte: last7 }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const trend = trendRaw.map(item => ({
      date: item._id,
      count: item.count
    }));

    const statusBreakdown = [
      { name: "Confirmed", value: confirmed },
      { name: "Pending", value: pending },
      { name: "Cancelled", value: cancelled }
    ];

    res.json({
      total,
      today,
      pending,
      confirmed,
      cancelled,
      trend,
      statusBreakdown
    });

  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: "Failed to fetch doctor stats" });
  }
};


// -----------------------------------------------------
// 2) TODAY’S APPOINTMENTS
// -----------------------------------------------------
export const getDoctorToday = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const list = await Appointment.find({
      doctorId,
      date: { $gte: todayStart, $lte: todayEnd }
    }).sort({ date: 1 });

    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch today's appointments" });
  }
};


// -----------------------------------------------------
// 3) RECENT APPOINTMENTS
// -----------------------------------------------------
export const getDoctorRecent = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const recent = await Appointment.find({ doctorId })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("patientId", "name email");

    const formatted = recent.map(r => ({
      _id: r._id,
      patientName: r.patientId?.name,
      patientEmail: r.patientId?.email,
      date: r.date,
      timeSlot: r.timeSlot,
      status: r.status
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Recent error:", err);
    res.status(500).json({ error: "Failed to fetch recent appointments" });
  }
};


// -----------------------------------------------------
// 4) FULL LIST (Fallback by React)
// -----------------------------------------------------
export const getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const list = await Appointment.find({ doctorId })
      .populate("patientId", "name email")
      .sort({ date: -1 });

    const formatted = list.map(a => ({
      _id: a._id,
      patientName: a.patientId?.name,
      patientEmail: a.patientId?.email,
      date: a.date,
      timeSlot: a.timeSlot,
      status: a.status
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};





export const getAppointments = async (req, res) => {
  try {
    const appts = await Appointment.find({
      $or: [{ patientId: req.user.userId }, { doctorId: req.user.userId }]
    })
      .populate("doctorId")
      .populate("patientId");

    res.json(appts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const getAppointmentsByPatient = async (req, res) => {
  try {
    const patientId = req.params.patientId;

   const appointments = await Appointment.find({ patientId })
  .populate({
    path: "doctorId",
    select: "specialization Experience Region",  // doctor fields
    populate: {
      path: "user",
      select: "name email"  // user fields
    }
  })
  .populate("patientId", "name email");



    if (!appointments.length) {
      return res.status(404).json({ message: "No appointments found" });
    }

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// controllers/appointmentController.js

export const getAppointmentsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    // populate patient info from User model
   const appointments = await Appointment.find({ doctorId })
      .populate("patientId", "name email gender age phone") 
      .sort({ date: 1 }) 
      .lean();

    // format response
    const formatted = appointments.map(appt => ({
      _id: appt._id,
      patientName: appt.patientId?.name || "Unknown",
      patientEmail: appt.patientId?.email || "N/A",
      patientPhone: appt.patientId?.phone,
      date: appt.date,
      timeSlot: appt.timeSlot,
      status: appt.status
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ message: "Server error" });``
  }
};
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params; // or appointmentId depending on route
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(appointment);
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// export const uploadPrescription = async (req, res) => {
//   const { id } = req.params;
//   const { prescription } = req.body;
//   try {
//     await Appointment.findByIdAndUpdate(id, { prescription });
//     await generatePDF(prescription, id); // creates a downloadable PDF
//     res.json({ message: "Prescription uploaded" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

