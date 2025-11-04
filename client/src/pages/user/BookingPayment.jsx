import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner, Container, Alert, Image } from "react-bootstrap";
import { AxiosInstance } from "../../config/AxiosInstance";
import toast from "react-hot-toast";

const BookingPayment = () => {
  const { bookingId } = useParams();
  const [loading, setLoading] = useState(true);
  const [car, setCar] = useState(null);
  const [carId, setCarId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingAndPay = async () => {
      try {
        // 1. Fetch booking details (with car info)
        const { data } = await AxiosInstance.get(`/booking/get-booking-byid/${bookingId}`);
        const booking = data.booking;
        if (!booking || !booking.carId) {
          throw new Error("Booking or car info not found.");
        }

        setCar(booking.model); // save car info (name & image)
        setCarId(booking.carId._id); // save carId for fallback redirect

        // 2. Initiate Stripe session
        const res = await AxiosInstance.post("/payment/create-checkout-session", {
          bookingId,
          carId: booking.carId._id,
        });

        // 3. Redirect to Stripe
        setTimeout(() => {
          window.location.href = res.data.url;
        }, 2000);

      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Payment initiation failed");

        // Redirect to car details if carId is available
        if (carId) {
          navigate(`/car-details/${carId}`);
        } else {
          navigate("/user/bookings");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookingAndPay();
  }, [bookingId, navigate, carId]);

  return (
    <Container className="text-center my-5">
      {loading ? (
        <>
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Redirecting to payment...</p>
          {car && (
            <div className="mt-3">
              <h4>{car.name}</h4>
              <Image src={car.images?.[0] || "/default-car.jpg"} alt={car.name} fluid rounded />
            </div>
          )}
        </>
      ) : (
        <Alert style={{marginTop:"150px"}}>Please wait...</Alert>
      )}
    </Container>
  );
};

export default BookingPayment;
