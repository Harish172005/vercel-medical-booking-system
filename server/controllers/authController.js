// controllers/authController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Availability from "../models/Availability.js"; 

export const verifyToken = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ valid: false, message: "No token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ valid: true, userId: decoded.userId, role: decoded.role });
  } catch (err) {
    return res.status(401).json({ valid: false, message: "Invalid token" });
  }
};

export const register = async (req, res) => {
  const { name, email, password, role, specialization, Experience, Region } = req.body;
  let { availability } = req.body;

  try {
    // Fix: Handle Availability JSON parsing
    if (availability) {
      try {
        availability = JSON.parse(availability);  // Convert JSON string → array
      } catch (err) {
        console.log("Availability was not JSON → skipping parse");
      }
    }

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    if (!req.file) {
      return res.status(400).json({ error: "ID Proof file is required" });
    }

    const idProof = `/uploads/${req.file.filename}`;

    // If doctor, create Doctor profile and Availability
    if (role === "doctor") {
      // Create doctor record
      const newDoctor = await Doctor.create({
        user: newUser._id,
        specialization,
        Experience,
        Region,
        idProof
      });

      // Store availability
      if (Array.isArray(availability) && availability.length > 0) {
        const availabilityDocs = availability.map(item => ({
          doctor: newDoctor._id,
          date: item.date,
          slots: item.slots
        }));

        await Availability.insertMany(availabilityDocs);
      }
    }

    // Create JWT
    const payload = {
      userId: newUser._id,
      email: newUser.email,
      role: newUser.role
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.status(201).json({
      message: "Registration successful",
      token
    });

  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, age, gender } = req.body;

    // Optional: Validate fields
    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and Email are required" });
    }

    const updateUser = await User.findByIdAndUpdate(
      id,
      { name, email, phone, age, gender },
      { new: true, runValidators: true }
    ).select("-password"); // exclude password

    if (!updateUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user: updateUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Server error while updating profile" });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const isMatch =  await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      message: "Login successful",
       user: {
        _id: user._id,  // ✅ Include user ID
        email: user.email,
        role: user.role
      },
      token
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password"); // exclude password
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// controllers/userController.js
export const getUserProfile = (req, res) => {
  if (!req.user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(req.user); // req.user is already attached in protect middleware
};

