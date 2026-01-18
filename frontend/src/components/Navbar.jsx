// src/components/Navbar.js
import React from "react";
import {
  Navbar as BootstrapNavbar,
  Container,
  Nav,
  NavDropdown,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { getUser, clearAuthData } from "../utils/auth";
import {
  FaSignOutAlt,
  FaUserCircle,
  FaUserMd,
  FaCalendarAlt,
  FaClock,
  FaHome,
} from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    clearAuthData();
    navigate("/login");
  };

  return (
    <BootstrapNavbar
      bg="dark"
      variant="dark"
      expand="lg"
      className="shadow-sm"
    >
      <Container>
        {/* Brand */}
        <BootstrapNavbar.Brand
          as={Link}
          to="/"
          className="fw-bold"
          style={{ fontSize: "1.35rem" }}
        >
          <FaHome className="me-2" />
          Medical Appointment Booking System
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />

        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">

            {/* If no user → Public navbar */}
            {!user && (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}

            {/* If logged in → Role Based Navigation */}
            {user && (
              <>
                {/* Doctor Navigation */}
                {user.role === "doctor" && (
                  <>
                    <Nav.Link as={Link} to="/doctor/dashboard">
                      <FaUserMd className="me-1" /> Dashboard
                    </Nav.Link>

                    <Nav.Link as={Link} to="/doctor/view-appointments">
                      <FaCalendarAlt className="me-1" /> Appointments
                    </Nav.Link>

                    <Nav.Link as={Link} to="/doctor/manage-availability">
                      <FaClock className="me-1" /> Availability
                    </Nav.Link>
                  </>
                )}

                {/* Patient Navigation */}
                {user.role === "patient" && (
                  <>
                    <Nav.Link as={Link} to="/patient/dashboard">
                      <FaUserCircle className="me-1" /> Dashboard
                    </Nav.Link>

                    <Nav.Link as={Link} to="/patient/view-appointments">
                      <FaCalendarAlt className="me-1" /> My Appointments
                    </Nav.Link>

                  </>
                )}

                {/* User Dropdown */}
                <NavDropdown
                  title={
                    <span className="fw-semibold">
                      <FaUserCircle className="me-1" />
                      {user.email}
                    </span>
                  }
                  align="end"
                  className="ms-3"
                >
                  <NavDropdown.Item as={Link} to={`/${user.role}/dashboard`}>
                    Dashboard
                  </NavDropdown.Item>

                  <NavDropdown.Item as={Link} to={`/${user.role}/edit-profile`}>
                    Edit Profile
                  </NavDropdown.Item>

                  <NavDropdown.Divider />

                  <NavDropdown.Item
                    onClick={handleLogout}
                    className="text-danger fw-bold"
                  >
                    <FaSignOutAlt className="me-2" />
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
