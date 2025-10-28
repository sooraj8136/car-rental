import React from "react";
import { Container, Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const BookingCancelled = () => {
  return (
    <Container className="text-center my-5">
      <Alert
        variant="light"
        className="border border-danger rounded-3 py-4"
        style={{ maxWidth: "500px", margin: "0 auto" }}
      >
        <h5 className="text-danger mb-3">Payment Cancelled</h5>
        <p className="text-muted mb-4">
          Your booking was not confirmed. You can return to the homepage.
        </p>
        <Link to="/">
          <Button variant="danger" size="sm">
            Go to Home
          </Button>
        </Link>
      </Alert>
    </Container>
  );
};

export default BookingCancelled;
