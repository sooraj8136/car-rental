import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Spinner, Alert } from "react-bootstrap";
import { AxiosInstance } from "../../config/AxiosInstance";
import toast from "react-hot-toast";

const BookingSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [status, setStatus] = useState("loading");
    const [bookingId, setBookingId] = useState(null);

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const res = await AxiosInstance.get(`/payment/session-status?session_id=${sessionId}`);
                const recentId = localStorage.getItem("recentBookingId");

                if (res.data.status === "paid") {
                    setStatus("success");
                    toast.success("Payment successful!");

                    if (recentId) {
                        setBookingId(recentId);
                        try {
                            await AxiosInstance.post("/owner/send-request", { bookingId: recentId });
                        } catch (err) {
                            console.error("Owner request failed:", err);
                        }
                        localStorage.removeItem("recentBookingId");
                    }
                } else {
                    setStatus("incomplete");
                    localStorage.removeItem("recentBookingId");
                }

            } catch (err) {
                console.error(err);
                setStatus("error");
                toast.error("Payment verification failed.");
                localStorage.removeItem("recentBookingId");
            }
        };

        if (sessionId) verifyPayment();
        else {
            setStatus("error");
            localStorage.removeItem("recentBookingId");
        }
    }, [sessionId]);

    return (
        <>
            <Container className="text-center my-5">
                {status === "loading" && <Spinner animation="border" />}

                {status === "success" && (
                    <Alert variant="">
                        🎉 <strong>Payment successful!</strong><br />
                        Your booking is <strong>awaiting owner confirmation.</strong><br />
                        You’ll receive a notification once the owner responds.
                        <br />
                        <div className="text-center p-3" >
                            <a href="/" className=" text-dark mx-2">Home</a>
                            <span className="text-dark">|</span>
                            <a href="/user/user-bookings" className=" text-dark mx-2">
                                My Bookings
                            </a>
                        </div>
                    </Alert>
                )}

                {status === "incomplete" && (
                    <Alert variant="warning">
                        We're Sorry, payment not completed. Please try again or contact support.
                    </Alert>
                )}

                {status === "error" && (
                    <Alert variant="danger">
                        An error occurred while verifying your payment. Please try again later.
                    </Alert>
                )}
            </Container>
        </>
    );
};

export default BookingSuccess;

