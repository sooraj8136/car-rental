import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { AxiosInstance } from "../../config/AxiosInstance";
import {
  FaUserFriends,
  FaGasPump,
  FaCarSide,
  FaMapMarkerAlt,
  FaCheckCircle,
} from "react-icons/fa";
import DeleteCarButton from "../../components/owner/DeleteCarButton ";

const OwnerCarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await AxiosInstance.get(`/car/get-a-car/${id}`);
        setCar(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch car details");
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row>
        {/* Left Side: Car Details */}
        <Col lg={8}>
          <img
            src={car.images?.[0]}
            alt={`${car.brand} ${car.model}`}
            className="img-fluid rounded mb-4"
            style={{ maxHeight: "400px", objectFit: "cover", width: "100%", marginTop: "100px" }}
          />
          <h2 className="fw-bold">{car.brand} {car.model}</h2>

          {/* Rental Price shown just below the title */}
          <h4 className="text-primary mb-3">
            ₹{car.rentalPricePerDay} <small className="text-muted">/ day</small>
          </h4>

          <p className="text-muted">{car.category} · {car.year}</p>

          <Row className="mb-4 text-muted">
            <Col md={3}><FaUserFriends className="me-2" />{car.seats} Seats</Col>
            <Col md={3}><FaGasPump className="me-2" />{car.fuelType}</Col>
            <Col md={3}><FaCarSide className="me-2" />{car.transmission}</Col>
            <Col md={3}><FaMapMarkerAlt className="me-2" />{car.location}</Col>
          </Row>

          <h5 className="fw-bold">Description</h5>
          <p className="text-muted">{car.description || "No description provided."}</p>

          <h5 className="fw-bold mt-4">Features</h5>
          <Row>
            <Col md={6}>
              {(car.features || []).slice(0, 3).map((feature, idx) => (
                <p key={idx}><FaCheckCircle className="text-primary me-2" />{feature}</p>
              ))}
            </Col>
            <Col md={6}>
              {(car.features || []).slice(3).map((feature, idx) => (
                <p key={idx}><FaCheckCircle className="text-primary me-2" />{feature}</p>
              ))}
            </Col>
          </Row>
        </Col>

        {/* Right Side */}
        <Col lg={4}>
          <div className=" rounded p-4 mb-3">
            <h5 className="fw-bold" style={{ marginTop: "150px" }}>Booking Info</h5>
            <p className="text-muted">Bookings are disabled by default for owners.</p>
          </div>

          {/* Link to Edit Car */}
          <div className="d-grid">
            <Link
              to={`/owner/update-car/${car._id}`}
              className="btn"
              style={{
                backgroundColor: "#000000ff",
                color: "white",
                transition: "all 0.4s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#4c555eff";
                e.target.style.transform = "scale(1.05)";
                e.target.style.boxShadow = "0 0 10px rgba(0, 76, 147, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#000000ff";
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "none";
              }}
            >
              Edit Car
            </Link>
            <br />
            <DeleteCarButton carId={car._id} onSuccess={() => window.location.href = "/owner/owner-cars"} />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default OwnerCarDetails;
