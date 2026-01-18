// src/pages/patient/PatientDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  Stack,
} from "@mui/material";

export default function PatientDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [specializations, setSpecializations] = useState([]);
  const [regions, setRegions] = useState([]);

  const [filterSpecialization, setFilterSpecialization] = useState("");
  const [filterRegion, setFilterRegion] = useState("");
  const [filterExperience, setFilterExperience] = useState("");

  const navigate = useNavigate();

  // Fetch all doctors with filters
  const fetchDoctors = useCallback(async () => {
  try {
    const params = {};
    if (filterSpecialization) params.specialization = filterSpecialization;
    if (filterRegion) params.region = filterRegion;
    if (filterExperience) params.experience = filterExperience;

    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/doctor`,
      { params }
    );

    setDoctors(res.data);

    const specs = [...new Set(res.data.map(doc => doc.specialization))];
    const regs = [...new Set(res.data.map(doc => doc.region))];

    setSpecializations(specs);
    setRegions(regs);
  } catch (err) {
    console.error("Error fetching doctors:", err);
  }
}, [filterSpecialization, filterRegion, filterExperience]);

  const handleViewDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const handleBookAppointment = (doctorId) => {
    navigate(`/patient/book-appointment?doctorId=${doctorId}`);
  };

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" align="center" gutterBottom color="primary">
        🩺 Find Your Doctor
      </Typography>

      {/* Filters */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={4} justifyContent="center">
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Specialization</InputLabel>
          <Select
            value={filterSpecialization}
            onChange={(e) => setFilterSpecialization(e.target.value)}
            label="Specialization"
          >
            <MenuItem value="">All</MenuItem>
            {specializations.map((spec, idx) => (
              <MenuItem key={idx} value={spec}>
                {spec}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Region</InputLabel>
          <Select
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            label="Region"
          >
            <MenuItem value="">All</MenuItem>
            {regions.map((reg, idx) => (
              <MenuItem key={idx} value={reg}>
                {reg}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Experience</InputLabel>
          <Select
            value={filterExperience}
            onChange={(e) => setFilterExperience(e.target.value)}
            label="Experience"
          >
            <MenuItem value="">Any</MenuItem>
            <MenuItem value="1">1+ years</MenuItem>
            <MenuItem value="3">3+ years</MenuItem>
            <MenuItem value="5">5+ years</MenuItem>
            <MenuItem value="10">10+ years</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Doctor Cards */}
      <Grid container spacing={3}>
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <Grid item xs={12} sm={6} md={4} key={doctor._id}>
              <Card
                sx={{
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-5px) scale(1.02)", boxShadow: 6 },
                }}
              >
                <Box sx={{ overflow: "hidden" }}>
                  <CardMedia
                    component="img"
                    height="240"
                    image={doctor.idProof ?  `http://localhost:5000/${doctor.idProof.replace(/^\/+/, "")}` : "/default-doctor.jpg"}
                    alt={doctor.name || "Doctor"}
                    sx={{
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": { transform: "scale(1.1)" },
                    }}
                  />
                </Box>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6" color="primary">
                    {doctor.name || "No Name"}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {doctor.specialization || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {doctor.experience ? `${doctor.experience} of experience` : "Experience not available"}
                  </Typography>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => handleViewDetails(doctor)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" align="center" sx={{ width: "100%", mt: 2 }}>
            No doctors found.
          </Typography>
        )}
      </Grid>

      {/* Doctor Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            width: { xs: "90%", sm: 600 },
            borderRadius: 2,
          }}
        >
          {selectedDoctor && (
            <>
              <Stack direction="row" spacing={2} mb={2}>
                <Box flex={1}>
                  <img
                    src={selectedDoctor.idProof ?  `http://localhost:5000/${selectedDoctor.idProof.replace(/^\/+/, "")}` : "/default-doctor.jpg"}
                    alt={selectedDoctor.name || "Doctor"}
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
                </Box>
                <Box flex={1}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {selectedDoctor.name || "No Name"}
                  </Typography>
                  <Typography variant="body2"><strong>Specialization:</strong> {selectedDoctor.specialization || "N/A"}</Typography>
                  <Typography variant="body2"><strong>Email:</strong> {selectedDoctor.email || "N/A"}</Typography>
                  <Typography variant="body2"><strong>Experience:</strong> {selectedDoctor.experience || "N/A"} years</Typography>
                  <Typography variant="body2"><strong>Qualification:</strong> {selectedDoctor.qualification || "N/A"}</Typography>
                  <Typography variant="body2" mt={1}>{selectedDoctor.bio || "No details available"}</Typography>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => handleBookAppointment(selectedDoctor._id)}
                  >
                    Book Appointment
                  </Button>
                </Box>
              </Stack>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
}
