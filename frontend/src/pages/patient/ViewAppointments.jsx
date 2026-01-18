import React, { useEffect, useState } from "react";
import { Card, Spinner, Alert, Row, Col } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { getUserAppointments } from "../../api/user";

export default function ViewAppointmentsPatient() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !user._id) return;

    const fetchAppointments = async () => {
      try {
        const res = await getUserAppointments(user._id);
        setAppointments(res.data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" style={{ margin: "20px" }}>
        {error}
      </Alert>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h3 style={{ marginBottom: "20px" }}>My Appointments</h3>

      {appointments.length > 0 ? (
        <Row>
          {appointments.map((appt) => (
            <Col md={6} lg={4} key={appt._id} style={{ marginBottom: "20px" }}>
              <Card style={{ borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                <Card.Body>
                  <Card.Title style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                    {appt.doctorId?.user?.name || "Unknown Doctor"}
                  </Card.Title>

                  <Card.Subtitle className="mb-2 text-muted">
                    {appt.doctorId?.specialization || "N/A"}
                  </Card.Subtitle>

                  <div style={{ marginTop: "10px" }}>
                    <p><strong>Date:</strong> {new Date(appt.date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {appt.timeSlot}</p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        style={{
                          color:
                            appt.status === "confirmed"
                              ? "green"
                              : appt.status === "cancelled"
                              ? "red"
                              : "orange",
                          fontWeight: "bold",
                        }}
                      >
                        {appt.status}
                      </span>
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info">No appointments found.</Alert>
      )}
    </div>
  );
}
