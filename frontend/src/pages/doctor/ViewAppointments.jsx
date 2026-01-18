import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import API from "../../utils/axios";
import { getDoctorProfile } from "../../api/doctor";

const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctorId, setDoctorId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load doctor ID
  const loadDoctorId = async () => {
    try {
      const res = await getDoctorProfile();
      setDoctorId(res.data._id);
    } catch (err) {
      console.error("Error loading doctor profile:", err);
    }
  };

  // Fetch appointments
  const fetchAppointments = async (id) => {
    try {
      const response = await API.get(`/appointments/doctor/${id}`);
      setAppointments(response.data || []);
      // console.log(appt.patientPhone)
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update appointment status
  const updateStatus = async (appointmentId, newStatus) => {
    try {
      await API.put(`/appointments/${appointmentId}/status`, {
        status: newStatus,
      });

      // Update UI instantly without refetching
      setAppointments((prev) =>
        prev.map((a) =>
          a._id === appointmentId ? { ...a, status: newStatus } : a
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  useEffect(() => {
    loadDoctorId();
  }, []);

  useEffect(() => {
    if (doctorId) fetchAppointments(doctorId);
  }, [doctorId]);

  const statusColor = (status) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "completed":
        return "primary";
      default:
        return "warning";
    }
  };

  // Allowed next statuses
  const getAllowedStatusOptions = (status) => {
    if (status === "pending") return ["pending", "approved", "rejected"];
    if (status === "approved") return ["approved", "completed"];
    if (status === "rejected") return ["rejected"];
    if (status === "completed") return ["completed"];
    return ["pending"];
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        View Appointments
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : appointments.length === 0 ? (
        <Typography color="text.secondary" textAlign="center">
          No appointments found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {appointments.map((appt) => (
            <Grid item xs={12} md={6} key={appt._id}>
              <Card elevation={3} sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600}>
                    {appt.patientName || "Unknown Patient"}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Email: {appt.patientEmail || "-"}
                  </Typography>

                  <Typography mt={1}>
                    <strong>Date:</strong> {appt.date}
                  </Typography>

                  <Typography>
                    <strong>Time Slot:</strong> {appt.timeSlot}
                  </Typography>

                  {/* Status Chip */}
                  <Box mt={2} mb={1}>
                    <Chip
                      label={appt.status}
                      color={statusColor(appt.status)}
                      variant="filled"
                    />
                  </Box>

                  {/* Status Dropdown */}
                  <FormControl fullWidth size="small">
                    <InputLabel>Update Status</InputLabel>
                    <Select
                      value={appt.status}
                      label="Update Status"
                      onChange={(e) =>
                        updateStatus(appt._id, e.target.value)
                      }
                    >
                      {getAllowedStatusOptions(appt.status).map((status) => (
                        <MenuItem key={status} value={status}>
                          {status.toUpperCase()}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
export default ViewAppointments;
