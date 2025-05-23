import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

import { Container, Col, Form, Button } from 'react-bootstrap';

function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: new Date(),
        funds: 100
      });

      navigate('/home');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Container fluid className="vh-100 d-flex p-0">
      {/* Left side with form */}
      <Col
        md={6}
        className="d-flex align-items-center justify-content-center"
        style={{
          background: 'linear-gradient(135deg, crimson, #a10000)',
          color: 'white',
          padding: '2rem'
        }}
      >
        <div style={{ maxWidth: '400px', width: '100%' }}>
          <h1 className="mb-4" style={{ fontWeight: 'bold' }}>
            Create an Account
          </h1>
          <p className="mb-4" style={{ fontSize: '1.1rem' }}>
            Sign up and explore the latest in tech and more.
          </p>
          <Form>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button
              variant="light"
              onClick={handleRegister}
              className="w-100"
              style={{ color: 'crimson', fontWeight: 'bold' }}
            >
              Register
            </Button>
          </Form>
        </div>
      </Col>

      {/* Right side image or promo */}
      <Col
        md={6}
        className="d-none d-md-block"
        style={{
          backgroundImage: `url('https://i.ibb.co/KjG6BxZ4/2ff3edc1-78e8-41a5-a9b3-cb2e7f7cb946.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
    </Container>
  );
}

export default RegisterScreen;
