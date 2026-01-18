import React, { useEffect, useState } from "react";
import API from "../../utils/axios";
import { getDoctorProfile } from "../../api/doctor";
import { Container, Form, Button, Spinner } from "react-bootstrap";

const EditProfileDoctor = () => {
  const [doctorId, setDoctorId] = useState(null);

  const [doctorData, setDoctorData] = useState({
    name: "",
    email: "",
    specialization: "",
    phone: "",
    bio: "",
    experience: "",
    qualification: "",
    region: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Load doctorId from backend (Doctor._id)
  const loadDoctorId = async () => {
    try {
      const res = await getDoctorProfile();
      setDoctorId(res.data._id);
    } catch (err) {
      console.error("Failed to load doctor profile:", err);
    }
  };

  // Fetch doctor details
  const fetchDoctorDetails = async (doctorId) => {
    try {
      const res = await API.get(`/doctor/${doctorId}`);
      console.log(res.data);
      setDoctorData({
        name: res.data.user.name,
        email: res.data.user.email,
        specialization: res.data.specialization || "",
        phone: res.data.user?.phone || "",
        bio: res.data.user?.bio || "",
        experience: res.data.Experience || "",
        qualification: res.data.qualification || "",
        region: res.data.Region || "",
        gender: res.data.gender || "",
        consultationFee: res.data.consultationFee || "",
      });
    } catch (err) {
      console.error("Error fetching doctor details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctorId();
  }, []);

  useEffect(() => {
    if (doctorId) fetchDoctorDetails(doctorId);
  }, [doctorId]);

  const handleChange = (e) =>
    setDoctorData({ ...doctorData, [e.target.name]: e.target.value });

  // Save changes
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doctorId) return;

    setSaving(true);
    try {
      await API.put(`/doctor/${doctorId}`, doctorData);
      setSuccessMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container className="mt-4 p-4" style={{ maxWidth: "700px" }}>
      <h3 className="mb-4">Edit Doctor Profile</h3>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Form onSubmit={handleSubmit}>

          {/* BASIC DETAILS */}
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={doctorData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={doctorData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
           <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="String"
              name="phone"
              value={doctorData.phone}
              onChange={handleChange}
              placeholder=""
              min="0"
            />
          </Form.Group>

          {/* ADDITIONAL FIELDS */}
          <Form.Group className="mb-3">
            <Form.Label>Gender</Form.Label>
            <Form.Select name="gender" value={doctorData.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Specialization</Form.Label>
            <Form.Control
              type="text"
              name="specialization"
              value={doctorData.specialization}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Years of Experience</Form.Label>
            <Form.Control
              type="String"
              name="experience"
              value={doctorData.experience}
              onChange={handleChange}
              placeholder="Example: 5 years"
              min="0"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Qualification</Form.Label>
            <Form.Control
              type="text"
              name="qualification"
              value={doctorData.qualification}
              onChange={handleChange}
              placeholder="Example: MBBS, MD"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Region / City</Form.Label>
            <Form.Control
              type="text"
              name="region"
              value={doctorData.region}
              onChange={handleChange}
              placeholder="Example: Chennai, Bengaluru"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Bio</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="bio"
              value={doctorData.bio}
              onChange={handleChange}
              placeholder="Short description aboutyou"
            />
          </Form.Group>

          {/* Submit */}
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>

          {successMessage && (
            <p className="text-success mt-3">{successMessage}</p>
          )}
        </Form>
      )}
    </Container>
  );
};

export default EditProfileDoctor;
