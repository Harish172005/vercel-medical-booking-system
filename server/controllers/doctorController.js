// controllers/doctorController.js
import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import Availability from "../models/Availability.js";

/**
 * @desc Get all unique specializations
 */
export const getSpecializations = async (req, res) => {
  try {
    const specializations = await Doctor.distinct("specialization");
    res.json(specializations);
  } catch (error) {
    console.error("Error fetching specializations:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Get doctors by specialization
 */

export const getDoctorsBySpecialization = async (req, res) => {
  try {
    const { specialization } = req.params;

    const doctors = await Doctor.find({
      specialization: { $regex: `^${specialization}$`, $options: "i" }
    })
      .populate("user", "name email phone")  // add more user fields
      .select("specialization Experience"); // doctor fields you need

    res.json(doctors);

  } catch (error) {
    console.error("Error fetching doctors by specialization:", error);
    res.status(500).json({ message: "Server error" });
  }
};




export const createDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      specialization,
      availability
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "doctor"
    });

    const newDoctor = await Doctor.create({
      user: newUser._id,
      specialization,
      Experience,
      Region,
      idProof: req.file ? req.file.filename:null // ✅ Save file path
    });

    if (Array.isArray(availability) && availability.length > 0) {
      const availabilityDocs = availability.map(slot => ({
        doctor: newDoctor._id,
        date: slot.date,
        timeSlots: slot.timeSlots
      }));
      await Availability.insertMany(availabilityDocs);
    }

    res.status(201).json({
      message: "Doctor registered successfully",
      doctorId: newDoctor._id
    });
  } catch (error) {
    console.error("Error registering doctor:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id).populate("user"); // <-- populate user reference

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET all doctors
export const getAllDoctors = async (req, res) => {
  try {
    // Populate user details for each doctor
    const doctors = await Doctor.find()
      .populate("user", "name email role idProof Experience qualification description")
      .lean();

    // Format response
    const formattedDoctors = doctors.map((doc) => ({
      _id: doc._id,
      name: doc.user.name,
      email: doc.user.email,
      specialization: doc.specialization,
      experience: doc.Experience,
      qualification: doc.qualification,
      description: doc.description,
      idProof: doc.idProof?.replace("/uploads/", "") || null
    }));

    return res.status(200).json(formattedDoctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



export const getDoctorProfile = async (req, res) => {
  try {
    const userId = req.user._id; // ensure auth middleware sets req.user
    const doctor = await Doctor.findOne({ user: userId }).populate("user", "name email");

    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    return res.json({
      _id: doctor._id,
      specialization: doctor.specialization || "",
      Experience: doctor.Experience || "",
      Region: doctor.Region || "",
      idProof: doctor.idProof || "",
      user: {
        name: doctor.user?.name || "",
        email: doctor.user?.email || ""
      }
    });
  } catch (err) {
    console.error("Error fetching doctor profile:", err);
    return res.status(500).json({ message: "Server error", details: err.message });
  }
};
export const getRegions = async (req, res) => {
  try {
    const regions = await Doctor.distinct("Region");  // Field name in schema

    res.status(200).json(regions);
  } catch (error) {
    console.error("Error fetching regions:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getDoctors = async (req, res) => {
  try {
    const { region, specialization, experience } = req.query;

    const filter = {};
    if (region) filter.Region = region;
    if (specialization) filter.specialization = specialization;
    if (experience) {
      const minExp = parseInt(experience);
      filter.Experience = { $regex: new RegExp(`^(${minExp}|[${minExp}-9][0-9]*)`) };
    }

    const doctors = await Doctor.find(filter)
      .populate("user", "name email") // ensure user has name + email
      .lean();

    // Format consistently
    const formattedDoctors = doctors.map((doc) => ({
      _id: doc._id,
      name: doc.user?.name || "No Name",
      email: doc.user?.email || "No Email",
      specialization: doc.specialization || "N/A",
      experience: doc.Experience || "N/A",
      qualification: doc.qualification || "N/A",
      region: doc.Region || "N/A",
      bio: doc.bio || "",
      idProof: doc.idProof || null,
    }));

    res.status(200).json(formattedDoctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params; // doctorId

    const {
      name,
      email,
      phone,
      gender,
      specialization,
      qualification,
      experience,
      region,
      bio
    } = req.body;

    // If updating file (idProof), check req.file
    const idProof = req.file ? `/uploads/${req.file.filename}` : null;

    // 1️⃣ Fetch doctor by ID
    const doctor = await Doctor.findById(id).populate("user");
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    const user = doctor.user;
    // 2️⃣ Update User details
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (gender) user.gender = gender;


    await user.save();

    // 3️⃣ Update Doctor details
    if (specialization) doctor.specialization = specialization;
    if (qualification) doctor.qualification = qualification;
    if (experience) doctor.Experience = experience;
    if (region) doctor.Region = region;
    if (bio) doctor.bio = bio;

    // Update ID proof only if new file uploaded
    if (idProof) doctor.idProof = idProof;

    await doctor.save();

    res.json({
      message: "Doctor updated successfully",
      doctor
    });

  } catch (error) {
    console.error("Error updating doctor:", error);
    res.status(500).json({ message: "Server error" });
  }
};
