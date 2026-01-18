// src/components/auth/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { login as apiLogin } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();   // ✅ use login() method from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await apiLogin(email, password);
      const { token, user, doctor } = res.data;

      // Save auth data using context login()
      login(user, token);

      // Store doctor separately if exists
      if (doctor) {
        localStorage.setItem("doctor", JSON.stringify(doctor));
      }

      // Redirect based on role
      if (user.role === "doctor") navigate("/doctor/dashboard");
      else if (user.role === "patient") navigate("/patient/dashboard");
      else navigate("/");

    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid email or password");
    }

  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background:
          "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <motion.div
        className="card shadow-lg border-0"
        style={{
          maxWidth: 420,
          width: "100%",
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
        }}
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <div className="card-body p-5">
          <motion.h3
            className="text-center mb-4 fw-bold"
            style={{
              color: "#0d47a1",
              fontSize: "1.8rem",
              letterSpacing: "0.5px",
            }}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Welcome Back 👋
          </motion.h3>

          {error && (
            <motion.div
              className="alert alert-danger text-center py-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <motion.div
              className="mb-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="email" className="form-label fw-semibold">
                Email
              </label>
              <input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="form-control p-3 rounded-3 shadow-sm"
                required
                autoComplete="email"
                placeholder="Enter your email"
                style={{ borderColor: "#64b5f6" }}
              />
            </motion.div>

            <motion.div
              className="mb-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="password" className="form-label fw-semibold">
                Password
              </label>
              <input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="form-control p-3 rounded-3 shadow-sm"
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                style={{ borderColor: "#64b5f6" }}
              />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: "#0d47a1" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="btn w-100 fw-semibold text-white py-3 rounded-3 shadow-sm"
              style={{
                background:
                  "linear-gradient(135deg, #42a5f5, #1e88e5, #1976d2)",
                border: "none",
                fontSize: "1rem",
              }}
              type="submit"
            >
              Login
            </motion.button>
          </form>

          <motion.div
            className="mt-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="mb-0 text-secondary">
              New here?{" "}
              <Link
                to="/register"
                className="text-decoration-none fw-semibold"
                style={{ color: "#1565c0" }}
              >
                Create an account
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
