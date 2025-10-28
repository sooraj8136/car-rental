import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { AxiosInstance } from "../../config/AxiosInstance";
import { FaUserFriends, FaGasPump, FaCarSide, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import CarAvailabilityChecker from "../../components/user/CarAvailabilityChecker"; // ✅ NEW IMPORT

const CarDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

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

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!pickupDate || !dropoffDate) {
      return toast.error("Please select both pickup and return dates");
    }

    setBookingLoading(true);

    try {
      const res = await AxiosInstance.post("/booking/create-booking", {
        carId: id,
        pickupDate,
        dropoffDate,
      });

      toast.success("Booking created! Redirecting to payment...");
      navigate(`/user/booking-payment/${res.data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

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
    <Container className="my-5" style={{marginTop:"150px"}}>
      {/* <div className="mb-3">
        <a href="/all-cars" className="text-decoration-none text-muted">
          ← Back to all cars
        </a>
      </div> */}

      <Row>
        {/* Left Side: Car Details */}
        <Col lg={8} style={{marginTop:"100px"}}>
          <img
            src={car.images?.[0]}
            alt={`${car.brand} ${car.model}`}
            className="img-fluid rounded mb-4"
            style={{ maxHeight: "400px", objectFit: "cover", width: "100%" }}
          />

          <h2 className="fw-bold">{car.brand} {car.model}</h2>
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

        {/* Right Side: Booking Sidebar */}
        <Col lg={4} style={{marginTop:"100px"}}>
          <div className="border rounded p-4 shadow-sm">
            <h4 className="fw-bold text-primary">₹{car.rentalPricePerDay}</h4>
            <p className="text-muted">per day</p>

            <form onSubmit={handleBooking}>
              <div className="mb-3">
                <label className="form-label">Pickup Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Return Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={dropoffDate}
                  onChange={(e) => setDropoffDate(e.target.value)}
                />
              </div>

              {/* ✅ Availability Checker */}
              <CarAvailabilityChecker carId={id} pickupDate={pickupDate} dropoffDate={dropoffDate} />

              {/* <button type="submit" className="btn btn-primary w-100 mt-3" disabled={bookingLoading}>
                {bookingLoading ? "Booking..." : "Book Now"}
              </button> */}
              {/* ⚠️ No Refund Message */}
              <div className="bg-warning-subtle text-warning-emphasis p-2 rounded mt-2 text-sm border border-warning">
                ⚠️ <strong>Note:</strong> This booking is <u>non-refundable</u>. If the owner declines your request, no refund will be issued.
              </div>

              <button type="submit" className="btn btn-dark w-100 mt-3" disabled={bookingLoading} style={{borderRadius:"0px"}}>
                {bookingLoading ? "Booking..." : "Book Now"}
              </button>

            </form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CarDetailsPage;
