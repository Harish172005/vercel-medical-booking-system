import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';


const ViewDoctors = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get('/api/doctors', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setDoctors(res.data);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Failed to load doctors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [user.token]);

  return (
    <Container className="mt-4">
      <h3 className="mb-4 text-center">Available Doctors</h3>

      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      )}

      {error && (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      )}

      <Row>
        {doctors.map((doctor) => (
          <Col md={4} key={doctor._id} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{doctor.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {doctor.specialization}
                </Card.Subtitle>
                <Card.Text>
                  <strong>Experience:</strong> {doctor.experience} <br />
                  <strong>Email:</strong> {doctor.email}
                </Card.Text>
                <Button
                  variant="primary"
                  href={`/patient/book-appointment?doctorId=${doctor._id}`}
                >
                  Book Appointment
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ViewDoctors;
