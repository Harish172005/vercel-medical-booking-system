import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  Experience: {
    type: String,
    required: true
  },
  Region: {
    type: String,
    required: true
  },
  qualification:{
     type: String
  },
  bio:{
     type: String
  },
  specialization: {
    type: String,
    required: true
  },
  idProof: {
    type: String,
    required: true
  }
});

export default mongoose.model("Doctor", doctorSchema);

