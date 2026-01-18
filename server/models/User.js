import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["doctor", "patient"],
    required: true
  },
  phone: { type: String },
  age: { type: Number },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    default: "Male"
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
