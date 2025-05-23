import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import DemoNavbar from './DemoNavbar';

function EditListing() {
  const [listing, setListing] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();

  //Needed for uploading pictures to website Imgbb
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
    });
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const docRef = doc(db, 'catalog', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setListing(data);
          setName(data.name);
          setPrice(data.price);
          setStock(data.stock);
        } else {
          alert('Listing not found');
          navigate('/manage');
        }
      } catch (err) {
        console.error(err);
        alert('Error fetching listing');
        navigate('/manage');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const numericPrice = parseFloat(price);
    const numericStock = parseInt(stock);

    if (isNaN(numericPrice) || numericPrice <= 0) {
      alert('Enter a valid price');
      setLoading(false);
      return;
    }

    if (isNaN(numericStock) || numericStock < 0 || !Number.isInteger(numericStock)) {
      alert('Stock must be a non-negative whole number');
      setLoading(false);
      return;
    }

    let imageUrl = listing.image;

    if (imageFile) {
      try {
        const base64Image = await toBase64(imageFile);

        const uploadRes = await fetch(`https://api.imgbb.com/1/upload?key=534f17513c673d22789368272e50ba66`, {
          method: 'POST',
          body: new URLSearchParams({
            image: base64Image,
            name: name || 'listing-image',
          }),
        });

        const result = await uploadRes.json();
        if (!result.success) throw new Error('Image upload failed');
        imageUrl = result.data.url;
      } catch (err) {
        alert('Image upload failed');
        setLoading(false);
        return;
      }
    }

    try {
      await updateDoc(doc(db, 'catalog', id), {
        name,
        price: numericPrice.toFixed(2),
        stock: numericStock,
        image: imageUrl,
      });

      alert('Listing updated!');
      navigate('/manage');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Error updating listing');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading listing...</p>;

  return (
    <>
      <DemoNavbar />
    <div style={{ background: 'linear-gradient(135deg, #b2e2d4, #e8f5f2)', minHeight: '100vh', paddingTop: '2rem' }}>
      <Container className="py-4">
        <h2 className="mb-4 fw-bold">Edit Listing</h2>
        <Row className="g-4">
          {/* Left Column: Form */}
          <Col xs={12} md={6}>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="productName">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="price">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="stock">
                <Form.Label>Stock Available</Form.Label>
                <Form.Control
                  type="number"
                  step="1"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="imageFile">
                <Form.Label>Update Image (optional)</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </Form.Group>

              <Button type="submit" disabled={loading} variant="primary">
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Form>
          </Col>

          {/* Right Column: Image Preview */}
          <Col xs={12} md={6} className="text-center">
            <h5 className="mb-3">Current Image</h5>
          <img
              src={listing.image}
              alt="Current"
              style={{
                width: '100%',
                maxWidth: '400px',
                height: '300px',
                objectFit: 'contain',
                borderRadius: 12,
                backgroundColor: '#f0f0f0', // optional, helps fill background behind smaller images
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
              }}
            />

          </Col>
        </Row>
      </Container>
    </div>
    </>
  );



}

export default EditListing;
