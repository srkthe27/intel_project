import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useExperience } from "./ExperienceContext";
import "./Navbar.css";

interface CustomNavbarProps {
  selectedAvatar: string | null;
}

const CustomNavbar: React.FC<CustomNavbarProps> = ({ selectedAvatar }) => {
  const { experience } = useExperience();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/avatar-selection");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Navbar bg="light" expand="lg" fixed="top" className="custom-navbar">
      <Navbar.Brand
        onClick={() => handleNavigation("/")}
        style={{ cursor: "pointer" }}
      >
        PathRise
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto align-items-center">
          <Nav.Link onClick={() => handleNavigation("/")}>Home</Nav.Link>
          <Nav.Link href="#about">About Us</Nav.Link>
          <Nav.Link href="#testimonials">Testimonials</Nav.Link>

          <Nav.Link onClick={handleProfileClick}>
            {selectedAvatar ? (
              <img
                src={selectedAvatar}
                alt="Avatar"
                className="avatar-icon subtle-bounce"
                style={{ width: "40px", borderRadius: "50%" }}
              />
            ) : (
              <FaUserCircle size={24} className="subtle-bounce" />
            )}
          </Nav.Link>

          <Nav.Item className="ms-3 xp-display">
            <span>XP: {experience}</span>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;
