import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

function About() {
  return (
    <Container style={{ marginTop: "150px" }}>
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow border-0 p-4">
            <Card.Body>
              <h2 className="text-center mb-4 fw-bold">About Our Car Rental Service</h2>
              <p className="text-muted fs-5 text-center">
                Welcome to our car rental platform — your trusted partner for quick, easy, and reliable car rentals.
                Whether you’re planning a weekend getaway, a business trip, or a long journey, we make it simple to find the perfect car that suits your needs.
              </p>
              <p className="fs-6 mt-4">
                Our mission is to provide a seamless car booking experience with real-time availability, instant booking, and secure payments.
                With a wide range of cars from trusted owners, we ensure transparency, safety, and convenience at every step.
              </p>
              <p className="fs-6">
                We believe that renting a car shouldn’t be complicated. That’s why our platform connects owners and customers directly — no hidden charges,
                no waiting for approval. Just search, book, and drive!
              </p>
              <p className="text-center mt-4 fw-semibold text-orange">
                Drive your journey with comfort and confidence — wherever you go.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default About;
