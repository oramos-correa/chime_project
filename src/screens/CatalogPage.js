import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import DemoNavbar from './DemoNavbar';
import { Modal } from 'react-bootstrap';

function CatalogPage() {
  const [items, setItems] = useState([]);
  const [userFunds, setUserFunds] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const [modalImage, setModalImage] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);

  useEffect(() => {
    // Fetch catalog items
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, 'catalog'));
      const items = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setItems(items);
    };

    // Fetch user funds
    const fetchFunds = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserFunds(userSnap.data().funds || 0);
        }
      }
    };

    fetchItems();
    fetchFunds();
  }, []);

  const handlePurchase = async (item) => {
  const user = auth.currentUser;
  if (!user) return;

  const itemPrice = parseFloat(item.price);
  if (userFunds < itemPrice || item.stock <= 0) return;

  const newBuyerFunds = Math.round((userFunds - itemPrice) * 100) / 100;

  const buyerRef = doc(db, 'users', user.uid);
  await updateDoc(buyerRef, { funds: newBuyerFunds });
  setUserFunds(newBuyerFunds);

  // Pay the seller
  if (item.seller && item.seller !== user.email) {
    try {
      // Find seller by email
      const sellerSnap = await getDocs(collection(db, 'users'));
      const sellerDoc = sellerSnap.docs.find(doc => doc.data().email === item.seller);

      if (sellerDoc) {
        const sellerFunds = sellerDoc.data().funds || 0;
        const newSellerFunds = Math.round((sellerFunds + itemPrice) * 100) / 100;

        const sellerRef = doc(db, 'users', sellerDoc.id);
        await updateDoc(sellerRef, { funds: newSellerFunds });

        const itemRef = doc(db, 'catalog', item.id);
        await updateDoc(itemRef, { stock: item.stock - 1 });

        setItems(prevItems =>
          prevItems.map(i =>
            i.id === item.id ? { ...i, stock: item.stock - 1 } : i
          )
        );

      } else {
        console.warn('Seller not found:', item.seller);
      }
    } catch (err) {
      console.error('Failed to pay seller:', err);
    }
  }

  alert(`You bought a ${item.name} for $${itemPrice.toFixed(2)}!`);
};

const filteredItems = items.filter((item) =>
  [item.name, item.seller]
    .some(field => field?.toLowerCase().includes(searchQuery.toLowerCase()))
);



 return (
  <>
      <DemoNavbar />
  <div style={{ background: 'linear-gradient(135deg, #b2e2d4, #e8f5f2)', minHeight: '100vh', paddingTop: '2rem' }}>
    <Container className="py-5">
      <h2 className="mb-3 fw-bold">Product Catalog</h2>
      <p className="mb-4" style={{ color: '#00796b' }}>Your Funds: <strong>${userFunds.toFixed(2)}</strong></p>

      <Row className="mb-4">
        <Col xs={12} sm={8} md={6}>
          <Form.Group controlId="search">
            <Form.Control
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      {filteredItems.length === 0 && (
        <Row>
          <Col>
            <p className="text-white">No products match your search.</p>
          </Col>
        </Row>
      )}

      <Row className="g-4">
        {filteredItems.map((item) => {
          const itemPrice = parseFloat(item.price);
          const canAfford = userFunds >= itemPrice && item.stock > 0;
          const isOwnItem = item.seller === auth.currentUser?.email;
          const isDisabled = !canAfford || isOwnItem;

          return (
            <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 shadow" style={{ opacity: canAfford ? 1 : 0.5, border: '1px solid #ccc' }}>
                <div
                  style={{
                    cursor: 'pointer',
                    height: '200px',
                    backgroundColor: '#f0f0f0',
                    paddingTop: '5px',
                    paddingBottom: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={() => {
                    setModalImage(item.image);
                    setShowModal(true);
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </div>

                <Card.Body className="text-center">
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>
                    <strong>${itemPrice.toFixed(2)}</strong><br />
                    Stock: {item.stock}
                  </Card.Text>
                  <Button
                    variant={isDisabled ? 'secondary' : undefined}
                    style={
                      isDisabled
                        ? {}
                        : { backgroundColor: 'crimson', borderColor: 'crimson' }
                    }
                    disabled={isDisabled}
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to purchase ${item.name} for $${parseFloat(item.price).toFixed(2)}?`)) {
                        handlePurchase(item);
                      }
                    }}
                  >
                    {isOwnItem
                      ? 'Your Item'
                      : item.stock <= 0
                      ? 'Out of Stock'
                      : canAfford
                      ? 'Add to Cart'
                      : 'Not enough funds'}
                  </Button>
                </Card.Body>
              </Card>
                <Modal
                  show={showModal}
                  onHide={() => setShowModal(false)}
                  centered
                  size="sm" // Make the modal more compact
                  contentClassName="custom-modal-content" // Optional: for additional fine-tuning via CSS
                  backdropClassName="custom-modal-backdrop" // Optional: for transparent backdrop styling
                >

                  <Modal.Header closeButton />
                  <Modal.Body className="text-center">
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

            </Col>
          );
        })}
      </Row>
    </Container>
  </div>
  </>
);


}

export default CatalogPage;
