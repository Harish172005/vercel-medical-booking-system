import React, { useEffect, useState, useCallback } from "react";
import API from "../../utils/axios";
import { getDoctorProfile } from "../../api/doctor";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ManageAvailability() {
  const [doctorId, setDoctorId] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [error, setError] = useState("");

  const timeSlotsList = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM"
  ];

  // Load logged-in doctor ID
  const loadDoctorId = useCallback(async () => {
  try {
    const res = await getDoctorProfile();
    setDoctorId(res.data._id);
  } catch (err) {
    console.error("Failed to load doctor profile:", err);
    setError("Unable to load doctor profile.");
  }
}, []);


  // Fetch Doctor Availability
  const fetchAvailability = useCallback(async () => {
  if (!doctorId) return;

  try {
    const res = await API.get(`/availability/${doctorId}`);
    setAvailability(res.data);
  } catch (err) {
    console.error("Error fetching availability:", err);
    setError("Failed to fetch availability.");
  }
}, [doctorId]);

  // Add or update availability
  const handleAddAvailability = async () => {
    if (!newDate || !selectedSlot) {
      setError("Please select a date and time slot.");
      return;
    }

    try {
      const res = await API.post(`/availability/${doctorId}`, {
        date: newDate,
        slots: [selectedSlot],
      });

      setAvailability((prev) => {
        const exists = prev.find((a) => a.date === newDate);
        if (exists) {
          return prev.map((a) => (a.date === newDate ? res.data : a));
        }
        return [...prev, res.data];
      });

      setNewDate("");
      setSelectedSlot("");
      setError("");

    } catch (error) {
      console.error("Error adding availability:", error);
      setError(error.response?.data?.message || "Failed to add availability.");
    }
  };

  // Delete an availability record
  const handleDeleteAvailability = async (id) => {
    try {
      await API.delete(`/availability/${id}`);
      setAvailability((prev) => prev.filter((a) => a._id !== id));
    } catch (error) {
      console.error("Error deleting availability:", error);
      setError("Failed to delete availability.");
    }
  };

  // Load doctorId on mount
 useEffect(() => {
  loadDoctorId();
}, [loadDoctorId]);

  // Fetch availability once doctorId is loaded
useEffect(() => {
  fetchAvailability();
}, [fetchAvailability]);


  return (
    <Box maxWidth="700px" mx="auto" mt={5}>
      <Typography variant="h4" gutterBottom>
        Manage Availability
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Add Availability Card */}
      <Card sx={{ mb: 4, p: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Add / Update Availability
          </Typography>

          <TextField
            type="date"
            label="Choose Date"
            fullWidth
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Time Slot</InputLabel>
            <Select
              label="Select Time Slot"
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
            >
              {timeSlotsList.map((slot) => (
                <MenuItem key={slot} value={slot}>
                  {slot}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={handleAddAvailability}
          >
            Save Availability
          </Button>
        </CardContent>
      </Card>

      {/* Availability List */}
      <Card sx={{ p: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Existing Availability
          </Typography>

          {availability.length === 0 ? (
            <Typography>No availability added yet.</Typography>
          ) : (
            <List>
              {availability.map((a) => (
                <React.Fragment key={a._id}>
                  <ListItem
                    secondaryAction={
                      <IconButton
                        edge="end"
                        color="error"
                        onClick={() => handleDeleteAvailability(a._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={a.date}
                      secondary={a.slots.join(", ")}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
