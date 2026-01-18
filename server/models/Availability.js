// models/Availability.js
import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  date: { type: String, required: true },
  slots: [{ type: String }]
});

export default mongoose.model("Availability", availabilitySchema);


