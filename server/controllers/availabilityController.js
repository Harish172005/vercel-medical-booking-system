// controllers/availabilityController.js
import Availability from "../models/Availability.js";
import Doctor from "../models/Doctor.js";


// ------------------------------------------------------------
// GET — All availability entries for a doctor
// Route: GET /availability/:userId
// ------------------------------------------------------------
export const getDoctorAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId );
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const availability = await Availability.find({ doctor: doctor._id })
      .sort({ date: 1 });

    res.json(availability);
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ------------------------------------------------------------
// POST — Add or update availability
// Route: POST /availability/:userId
// ------------------------------------------------------------
export const addDoctorAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ _id: req.params.doctorId });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const { date, slots } = req.body;

    if (!date || !slots || slots.length === 0) {
      return res.status(400).json({ message: "Date and slots are required" });
    }

    const doctorId = doctor._id;

    // Check if this date already exists for this doctor
    let availability = await Availability.findOne({
      doctor: doctorId,
      date,
    });

    if (availability) {
      // Merge slots with no duplicates
      availability.slots = [...new Set([...availability.slots, ...slots])];
    } else {
      // Create new availability entry
      availability = new Availability({
        doctor: doctorId,
        date,
        slots,
      });
    }

    await availability.save();
    res.status(201).json(availability);

  } catch (error) {
    console.error("Error adding availability:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ------------------------------------------------------------
// DELETE — Delete availability record by ID
// Route: DELETE /availability/availability/:availabilityId
// ------------------------------------------------------------
export const deleteDoctorAvailability = async (req, res) => {
  try {
    const { availabilityId } = req.params;

    const availability = await Availability.findById(availabilityId);
    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    await availability.deleteOne();
    res.json({ message: "Availability deleted successfully" });

  } catch (error) {
    console.error("Error deleting availability:", error);
    res.status(500).json({ message: "Server error" });
  }
};
