import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaBoxOpen, FaPlusCircle, FaTools } from 'react-icons/fa';

function DemoNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/');
  };

  const getLinkStyle = (path) => ({
    color: location.pathname === path ? '#f1f1f1' : '#fff',
    fontWeight: location.pathname === path ? 'bold' : 'normal',
    cursor: 'pointer',
  });

  return (
    <Navbar expand="lg" variant="dark" className="shadow-sm" style={{ backgroundColor: '#dc143c' }}>
      <Container>
        <Navbar.Brand
          onClick={() => navigate('/home')}
          style={{ cursor: 'pointer', color: '#fff', fontWeight: 'bold' }}
        >
          <img
            style={{ borderRadius: 20 }}
            src="https://i.ibb.co/NdMtyvc4/Chat-GPT-Image-May-21-2025-10-48-44-PM.png"
            alt="logo"
            width="30"
            height="30"
            className="d-inline-block align-top me-2"
          />
          <strong>DEMO</strong>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto px-3">
            <Nav.Link style={getLinkStyle('/catalog')} onClick={() => navigate('/catalog')}>
              <FaBoxOpen className="me-1" /> Catalog
            </Nav.Link>
            <Nav.Link style={getLinkStyle('/create')} onClick={() => navigate('/create')}>
              <FaPlusCircle className="me-1" /> Create Listing
            </Nav.Link>
            <Nav.Link style={getLinkStyle('/manage')} onClick={() => navigate('/manage')}>
              <FaTools className="me-1" /> Manage Listings
            </Nav.Link>
            <Nav.Link style={{ color: '#fff' }} onClick={handleLogout}>
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default DemoNavbar;
