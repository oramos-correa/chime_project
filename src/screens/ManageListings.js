import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import DemoNavbar from './DemoNavbar';

function ManageListings() {
  const [listings, setListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const querySnapshot = await getDocs(collection(db, 'catalog'));
      const userListings = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(item => item.seller === user.email);

      setListings(userListings);
    };

    fetchListings();
  }, []);

  const handleDelete = async (id, name) => {
  const confirmed = window.confirm(`Are you sure you want to delete "${name}"?`);
  if (!confirmed) return;

  await deleteDoc(doc(db, 'catalog', id));
  setListings(listings.filter(item => item.id !== id));
};


  const filteredListings = listings.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <DemoNavbar />
  <div style={{ background: 'linear-gradient(135deg, #b2e2d4, #e8f5f2)', minHeight: '100vh', paddingTop: '2rem' }}>
    <Container className="py-5">
      <h2 className="mb-3 fw-bold" >Manage Your Listings</h2>

      <Row className="mb-4">
        <Col xs={12} sm={8} md={6}>
          <Form.Group controlId="searchListings">
            <Form.Control
              type="text"
              placeholder="Search your listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      {filteredListings.length === 0 ? (
        <Row>
          <Col xs={12} sm={8} md={6}>
            <p style={{ color: '#00796b' }}>No matching listings found.</p>
          </Col>
        </Row>
      ) : (
        filteredListings.map((item) => (
          <Row key={item.id} className="mb-4">
            <Col xs={12} sm={8} md={12}>
              <Card className="h-100 shadow" style={{ border: '1px solid #ccc' }}>
                <Row className="g-0 align-items-center">
                  <Col xs={4}>
                    <Card.Img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'contain',
                        backgroundColor: '#f8f9fa', // light grey for consistency
                        borderRadius: '0.25rem 0 0 0.25rem',
                        padding: '0.5rem',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        setModalImage(item.image);
                        setShowModal(true);
                      }}
                    />

                  </Col>
                  <Col xs={8}>
                    <Card.Body className="d-flex flex-column justify-content-between h-100">
                      <div>
                        <Card.Title>{item.name}</Card.Title>
                        <Card.Text>
                          <strong>${parseFloat(item.price).toFixed(2)}</strong><br />
                          Stock: {item.stock}
                        </Card.Text>
                      </div>
                      <div className="mt-3">
                        <Button
                          variant="outline-primary"
                          className="me-2"
                          onClick={() =>navigate(`/edit/${item.id}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          onClick={() => handleDelete(item.id, item.name)}
                        >
                          Delete
                        </Button>
                      </div>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Modal
              show={showModal}
              onHide={() => setShowModal(false)}
              centered
              size="sm"
              backdropClassName="custom-modal-backdrop"
            >
              <Modal.Body
                className="text-center"
                style={{ backgroundColor: '#f0f0f0' }}
              >
                <img
                  src={modalImage}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '400px',
                    objectFit: 'contain',
                    margin: 'auto',
                    display: 'block'
                  }}
                />
              </Modal.Body>
            </Modal>

          </Row>
        ))
      )}
    </Container>
  </div>
  </>
);

}

export default ManageListings;
