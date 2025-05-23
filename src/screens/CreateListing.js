import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Form } from 'react-bootstrap';
import DemoNavbar from './DemoNavbar';

import '../App.css';

function CreateListing() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]); // get base64 part only
      reader.onerror = reject;
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true); // Show loader

  const user = auth.currentUser;
  if (!user) return;

  const numericPrice = parseFloat(price);
  if (isNaN(numericPrice) || numericPrice <= 0) {
    alert('Enter a valid price');
    setLoading(false);
    return;
  }

  const numericStock = parseInt(stock);
  if (isNaN(numericStock) || numericStock < 0 || !Number.isInteger(numericStock)) {
    alert('Stock must be a non-negative whole number');
    setLoading(false);
    return;
  }

  if (!image) {
    alert('Please upload an image');
    setLoading(false);
    return;
  }

  try {
    const base64Image = await toBase64(image);

    const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=534f17513c673d22789368272e50ba66`, {
      method: 'POST',
      body: new URLSearchParams({
        image: base64Image,
        name: name || 'listing-image',
      }),
    });

    const result = await imgbbResponse.json();
    if (!result.success) throw new Error('Image upload failed');

    const imageUrl = result.data.url;

    await addDoc(collection(db, 'catalog'), {
      name,
      price: numericPrice.toFixed(2),
      stock: numericStock,
      image: imageUrl,
      seller: user.email,
    });

    alert('Item listed!');
    navigate('/home');
  } catch (err) {
    console.error('Error during listing:', err);
    alert('Something went wrong. Check the console for details.');
  } finally {
    setLoading(false); // Hide loader
  }
};


  return (
    <>
      <DemoNavbar />
  <div style={{ background: 'linear-gradient(135deg, #b2e2d4, #e8f5f2)', minHeight: '100vh', paddingTop: '2rem' }}>
    <Container className="py-5">
      <h2 className="mb-4 fw-bold">Create New Listing</h2>

      {loading && <div className="spinner-border text-primary mb-3" role="status" />}

      <Form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Product Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
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
            onChange={e => setPrice(e.target.value)}
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
            onChange={e => setStock(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="image">
          <Form.Label>Upload Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={e => setImage(e.target.files[0])}
            required
          />
        </Form.Group>

        <Button
          type="submit"
          disabled={loading}
          style={{ backgroundColor: 'crimson', borderColor: 'crimson' }}
        >
          {loading ? 'Uploading...' : 'Create Listing'}
        </Button>
      </Form>
    </Container>
  </div>
  </>
);

}

export default CreateListing;
