import React, { useEffect, useState } from "react";
import { Container, Card, Spinner, Alert, Row, Col, Badge, } from "react-bootstrap";
import { AxiosInstance } from "../../config/AxiosInstance";
import { format } from "date-fns";

const UserAllBooking = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchBookings = async () => {
        try {
            const response = await AxiosInstance.get("/booking/get-user-booking", {
                withCredentials: true,
            });
            setBookings(response.data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const getStatusVariant = (status) => {
        switch (status) {
            case "completed":
                return "success";
            case "paid":
                return "warning";
            case "declined":
                return "danger";
            case "pending":
            default:
                return "secondary";
        }
    };

    const getConfirmationVariant = (confirmation) => {
        switch (confirmation) {
            case "confirmed":
                return "success";
            case "declined":
                return "danger";
            case "pending":
            default:
                return "secondary";
        }
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="text-center mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    if (bookings.length === 0) {
        return (
            <Container className="text-center mt-5">
                <Alert variant="info">No bookings found.</Alert>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <h3 className="mb-4 text-center" style={{marginTop:"150px"}}>MY BOOKINGS</h3>
            <Row>
                {bookings.map((booking) => (
                    <Col key={booking._id} md={6} lg={4} className="mb-4">
                        <Card className="shadow-sm h-100">
                            {booking.carId?.images && (
                                <Card.Img
                                    variant="top"
                                    src={booking.carId.images}
                                    style={{ height: "200px", objectFit: "cover" }}
                                    alt={`${booking.carId.brand} ${booking.carId.model}`}
                                />
                            )}
                            <Card.Body>
                                <Card.Title className="text-center mb-3">
                                    {booking.carId?.brand} {booking.carId?.model}
                                </Card.Title>
                                <Card.Text>
                                    <strong>Year:</strong> {booking.carId?.year} <br />
                                    <strong>₹{booking.carId?.rentalPricePerDay}</strong>/Day <br />
                                    <strong>Pickup:</strong>{" "}
                                    {format(new Date(booking.pickupDate), "dd MMM yyyy")} <br />
                                    <strong>Dropoff:</strong>{" "}
                                    {format(new Date(booking.dropoffDate), "dd MMM yyyy")} <br />
                                    <strong>Status:</strong>{" "}
                                    <Badge bg={getStatusVariant(booking.status)}>
                                        {booking.status}
                                    </Badge>{" "}
                                    <br />
                                    <strong>Owner Confirmation:</strong>{" "}
                                    <Badge bg={getConfirmationVariant(booking.ownerConfirmation)}>
                                        {booking.ownerConfirmation}
                                    </Badge>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default UserAllBooking;
