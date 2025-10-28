import React, { useEffect, useState } from "react";
import { Spinner, Card, Row, Col, Container, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AxiosInstance } from "../../config/AxiosInstance";
import { FaUserFriends, FaGasPump, FaCarSide, FaMapMarkerAlt } from "react-icons/fa";

const AllCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await AxiosInstance.get("/car/get-all-car");
        setCars(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setErrorMsg(error?.response?.data?.message || "Failed to fetch cars");
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading cars...</p>
      </div>
    );
  }

  if (errorMsg) {
    return <p className="text-danger text-center mt-4">{errorMsg}</p>;
  }

  return (
    <Container className="mt-5">
      <Row xs={1} sm={2} md={3} className="g-4">
        {cars.map((car) => (
          <Col key={car._id}>
            <div style={{ position: "relative" }}>
              {car.isAvailable && (
                <Badge
                  bg="primary"
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    zIndex: 10,
                    padding: "6px 12px",
                    fontSize: "0.8rem",
                  }}
                >
                  Available Now
                </Badge>
              )}
              <Badge
                bg="dark"
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  zIndex: 10,
                  padding: "6px 12px",
                  fontSize: "0.9rem",
                }}
              >
                ₹{car.rentalPricePerDay} / day
              </Badge>

              {/* Link wraps the entire Card */}
              <Link
                to={`/car-details/${car._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Card className="car-card h-100 shadow-sm border-0">
                  <Card.Img
                    variant="top"
                    src={car.images[0]}
                    alt={`${car.brand} ${car.model}`}
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title className="fw-bold">
                      {car.brand} {car.model}
                    </Card.Title>
                    <Card.Text className="text-muted mb-2">
                      {car.category} · {car.year || "N/A"}
                    </Card.Text>

                    <Row className="text-muted small g-2">
                      <Col xs={6}>
                        <FaUserFriends className="me-2" />
                        {car.seats} Seats
                      </Col>
                      <Col xs={6}>
                        <FaGasPump className="me-2" />
                        {car.fuelType}
                      </Col>
                      <Col xs={6}>
                        <FaCarSide className="me-2" />
                        {car.transmission}
                      </Col>
                      <Col xs={6}>
                        <FaMapMarkerAlt className="me-2" />
                        {car.location}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Link>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AllCars;
