// src/components/auth/Register.jsx
import React, { useState } from "react";
import { register } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    specialization: "",
    Experience: "",
    Region: "",
    availability: [],
    idProof: null,
  });

  const [availabilityInput, setAvailabilityInput] = useState({
    date: "",
    slot: "",
  });

  const navigate = useNavigate();

  const specializationsList = [
    "Cardiology",
    "Dermatology",
    "Neurology",
    "Pediatrics",
    "Orthopedics",
    "Psychiatry",
  ];

  const timeSlotsList = ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "idProof") {
      setForm({ ...form, idProof: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleAddAvailability = () => {
    if (!availabilityInput.date || !availabilityInput.slot) return;

    const existing = form.availability.find(
      (av) => av.date === availabilityInput.date
    );

    if (existing) {
      if (!existing.slots.includes(availabilityInput.slot)) {
        existing.slots.push(availabilityInput.slot);
      }
    } else {
      form.availability.push({
        date: availabilityInput.date,
        slots: [availabilityInput.slot],
      });
    }

    setForm({ ...form });
    setAvailabilityInput({ date: "", slot: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("role", form.role);

      if (form.role === "doctor") {
        formData.append("specialization", form.specialization);
        formData.append("Experience", form.Experience);
        formData.append("Region", form.Region);
        formData.append("availability", JSON.stringify(form.availability));
        formData.append("idProof", form.idProof);
      }

      const res = await register(formData);
      localStorage.setItem("token", res.data.token);
      alert("Registration Successful!");

      navigate(
        form.role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard"
      );
    } catch (err) {
      console.error("Register failed:", err.response?.data || err.message);
      alert("Registration failed. Try again!");
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{
      background: "linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 50%, #81d4fa 100%)",
    }}>
      <motion.div className="card shadow-lg border-0" style={{
        maxWidth: 480,
        width: "100%",
        borderRadius: "20px",
        background: "rgba(255, 255, 255, 0.9)",
      }}
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}>
        <div className="card-body p-5">

          <motion.h3 className="text-center mb-4 fw-bold"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}>
            Create Your Account
          </motion.h3>

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="form-control mb-3"
              placeholder="Full Name"
              required
            />

            {/* Email */}
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              className="form-control mb-3"
              placeholder="Email"
              required
            />

            {/* Password */}
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              className="form-control mb-3"
              placeholder="Password"
              required
            />

            {/* Role Selector */}
            <select name="role" value={form.role} onChange={handleChange}
              className="form-select mb-3">
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>

            {/* Doctor-specific fields */}
            {form.role === "doctor" && (
              <>
                <select
                  name="specialization"
                  value={form.specialization}
                  onChange={handleChange}
                  className="form-select mb-3"
                  required
                >
                  <option value="">Select Specialization</option>
                  {specializationsList.map((spec, idx) => (
                    <option key={idx} value={spec}>{spec}</option>
                  ))}
                </select>

                <input
                  name="Experience"
                  value={form.Experience}
                  onChange={handleChange}
                  className="form-control mb-3"
                  placeholder="Experience (e.g., 5 years)"
                  required
                />

                <input
                  name="Region"
                  value={form.Region}
                  onChange={handleChange}
                  className="form-control mb-3"
                  placeholder="Region (e.g., Chennai)"
                  required
                />

                {/* ID Proof */}
                <input
                  name="idProof"
                  type="file"
                  accept="image/*,application/pdf"
                  className="form-control mb-3"
                  onChange={handleChange}
                  required
                />

                {/* Availability */}
                <div className="d-flex gap-2 mb-2">
                  <input type="date" className="form-control"
                    value={availabilityInput.date}
                    onChange={(e) =>
                      setAvailabilityInput({ ...availabilityInput, date: e.target.value })
                    }
                  />
                  <select
                    className="form-select"
                    value={availabilityInput.slot}
                    onChange={(e) =>
                      setAvailabilityInput({ ...availabilityInput, slot: e.target.value })
                    }
                  >
                    <option>Select Time Slot</option>
                    {timeSlotsList.map((slot) => (
                      <option key={slot}>{slot}</option>
                    ))}
                  </select>
                  <button type="button" className="btn btn-primary"
                    onClick={handleAddAvailability}>
                    Add
                  </button>
                </div>

                {form.availability.length > 0 && (
                  <ul className="list-group mb-3">
                    {form.availability.map((av, idx) => (
                      <li key={idx} className="list-group-item">
                        {av.date}: {av.slots.join(", ")}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}

            <button className="btn btn-primary w-100 py-2" type="submit">
              Register
            </button>

            <p className="text-center mt-3">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

