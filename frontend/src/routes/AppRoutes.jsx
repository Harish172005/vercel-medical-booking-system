import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Doctor Pages
import DoctorDashboard from "../pages/doctor/Dashboard";
import ViewAppointmentsDoctor from "../pages/doctor/ViewAppointments";
import ManageAvailability from "../pages/doctor/ManageAvailability";
import EditProfileDoctor from "../pages/doctor/EditProfile";

// Patient Pages
import PatientDashboard from "../pages/patient/Dashboard";
import BookAppointment from "../pages/patient/BookAppointment";
import ViewAppointmentsPatient from "../pages/patient/ViewAppointments";
import EditProfilePatient from "../pages/patient/EditProfile";

// Public Pages
import Login from "../pages/Login";
import Register from "../pages/Register";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" replace />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Doctor Routes */}
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute allowedRole="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/view-appointments"
        element={
          <ProtectedRoute allowedRole="doctor">
            <ViewAppointmentsDoctor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/manage-availability"
        element={
          <ProtectedRoute allowedRole="doctor">
            <ManageAvailability />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/edit-profile"
        element={
          <ProtectedRoute allowedRole="doctor">
            <EditProfileDoctor />
          </ProtectedRoute>
        }
      />

      {/* Patient Routes */}
      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute allowedRole="patient">
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/book-appointment"
        element={
          <ProtectedRoute allowedRole="patient">
            <BookAppointment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/view-appointments"
        element={
          <ProtectedRoute allowedRole="patient">
            <ViewAppointmentsPatient />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/edit-profile"
        element={
          <ProtectedRoute allowedRole="patient">
            <EditProfilePatient />
          </ProtectedRoute>
        }
      />

      {/* Default Redirect */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to={`/${user.role}/dashboard`} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

export default AppRoutes;
