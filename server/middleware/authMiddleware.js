// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find user in DB
    const user = await User.findById(decoded.userId).select("-password"); // ✅ use decoded.userId
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // ✅ attach user to request
    next(); // ✅ pass to next middleware / controller
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
export const isDoctor = (req, res, next) => {
  if (req.user && req.user.role === "doctor") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Doctors only." });
  }
};

// ✅ Patient role middleware (if needed)
export const isPatient = (req, res, next) => {
  if (req.user && req.user.role === "patient") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Patients only." });
  }
};

