import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { FaBoxOpen} from 'react-icons/fa';
import DemoNavbar from './DemoNavbar';

function HomeScreen() {
  const navigate = useNavigate();

  return (
    <>
      <DemoNavbar/>
    <div className="home-screen-wrapper">
      <Container className="content d-flex align-items-center justify-content-start">
        <Row>
          <Col md={12}>
            <div className="welcome-section">
              <h1 className="welcome-title">Welcome to the Interactive Catalog Demo</h1>
              <p className="welcome-message">
                Explore our demo catalog to see how listings work in a modern interface.
              </p>
              <button className="catalog-btn mt-3" onClick={() => navigate('/catalog')}>
                <FaBoxOpen style={{ marginRight: 8 }} />
                Enter Catalog
              </button>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Background Squares or decorations */}
      <div className="square square1"></div>
      <div className="square square2"></div>
      <div className="square square3"></div>
    </div>

    </>
  );
}

export default HomeScreen;
