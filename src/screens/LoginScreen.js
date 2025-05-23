import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Container fluid className="vh-100">
      <Row className="h-100">
        {/* Image side */}
        <Col md={6} className="d-none d-md-block p-0">
          <img
            src="https://i.ibb.co/NdMtyvc4/Chat-GPT-Image-May-21-2025-10-48-44-PM.png" // replace with new URL if desired
            alt="Visual"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Col>

        {/* Form side */}
        <Col md={6} className="d-flex align-items-center justify-content-center bg-light" style={{ paddingBottom: '60px' }}>
          <Card style={{ width: '100%', maxWidth: 400 }} className="p-4 shadow">
            <h5 className="mb-4 text-muted" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
              Explore Cutting Edge Electronics and More 
              <span style={{ color: 'crimson', fontSize: '2.5rem', verticalAlign: 'middle' }}>*</span>
            </h5>


            <h2 className="text-center mb-4" style={{ color: 'crimson' }}>
              Login
            </h2>
            <Form>
              <Form.Group controlId="formBasicEmail" className="mb-3">
                <Form.Label className='fw-bold'>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword" className="mb-3">
                <Form.Label className='fw-bold'>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Button
                variant="danger"
                onClick={handleLogin}
                className="w-100"
                style={{ backgroundColor: 'crimson', border: 'none' }}
              >
                Login
              </Button>
            </Form>

            <p className="mt-3 text-center">
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginScreen;