// src/pages/patient/BookAppointment.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Card, Button, Form, Row, Col } from "react-bootstrap";

export default function BookAppointment() {
  const [doctor, setDoctor] = useState(null);
  const [availability, setAvailability] = useState([]); // [{ date, slots: [] }]
  const [selectedSlot, setSelectedSlot] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const doctorId = queryParams.get("doctorId");
  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const patientId = loggedUser?._id;

  useEffect(() => {
    const fetchDoctorAndSlots = async () => {
      try {
        // 1. Fetch doctor info
        const res = await axios.get(`http://localhost:5000/api/doctor/${doctorId}`);
        setDoctor(res.data);

        // 2. Fetch doctor's availability
        const slotsRes = await axios.get(
          `http://localhost:5000/api/availability/${doctorId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        setAvailability(slotsRes.data); // Array: [{ date, slots[] }]
      } catch (err) {
        console.error("Error fetching doctor or slots:", err);
      }
    };

    if (doctorId) fetchDoctorAndSlots();
  }, [doctorId]);

  // Handle appointment booking
  const handleSubmit = async () => {
    if (!selectedSlot) return alert("Please select a slot");

    // Selected value format: date|time
    const [date, timeSlot] = selectedSlot.split("|");

    try {
      console.log(doctorId,
          patientId,
          date,
          timeSlot);
      await axios.post(
        "http://localhost:5000/api/appointments/bookAppointment",
        {
          doctorId,
          patientId,
          date,
          timeSlot,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      alert("Appointment booked successfully!");
      navigate("/patient/dashboard");
    } catch (err) {
      console.error("Booking error:", err);
      alert(err.response?.data?.message || "Error booking appointment");
    }
  };

  return (
    <Container className="py-5">
      {doctor ? (
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="p-4 shadow-sm rounded-4">
              <h3 className="text-center mb-3">{doctor.name}</h3>
              <p className="text-muted text-center">{doctor.specialization}</p>

              {/* Slot Selection */}
              <Form.Group className="mb-3">
                <Form.Label>Select Available Slot</Form.Label>
                <Form.Select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                >
                  <option value="">-- Choose a Slot --</option>

                  {availability.map((day) =>
                    day.slots.map((time, idx) => (
                      <option key={`${day.date}-${idx}`} value={`${day.date}|${time}`}>
                        {day.date} | {time}
                      </option>
                    ))
                  )}
                </Form.Select>
              </Form.Group>

              <Button variant="success" className="w-100" onClick={handleSubmit}>
                Confirm Appointment
              </Button>
            </Card>
          </Col>
        </Row>
      ) : (
        <p className="text-center text-muted">Loading doctor information...</p>
      )}
    </Container>
  );
}
