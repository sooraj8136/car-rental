import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner, Container, Row, Col } from "react-bootstrap";
import { AxiosInstance } from "../../config/AxiosInstance";

const CarAvailabilityChecker = ({ carId }) => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [message, setMessage] = useState("");
  const [unavailableRanges, setUnavailableRanges] = useState([]);
  const [loadingRanges, setLoadingRanges] = useState(true);

  // Fetch unavailable dates
  useEffect(() => {
    const fetchUnavailable = async () => {
      try {
        const response = await AxiosInstance.get(`/booking/car-availability/ranges/${carId}`);
        setUnavailableRanges(response.data.unavailableRanges || []);
      } catch (err) {
        console.error("Failed to load unavailable dates", err);
      } finally {
        setLoadingRanges(false);
      }
    };

    fetchUnavailable();
  }, [carId]);

  const checkAvailability = () => {
    if (!pickup || !dropoff) {
      setMessage("Please select both pickup and dropoff dates.");
      return;
    }

    setMessage("Dates selected. Please review the unavailable ranges below to avoid conflicts.");
  };

  return (
    <Container className="my-5">
      {message && (
        <Alert variant="info" className="mt-3">
          {message}
        </Alert>
      )}

      <div className="mt-4">
        <h5 style={{color:"white"}}>Unavailable Date Ranges:</h5>
        {loadingRanges ? (
          <Spinner animation="border" />
        ) : unavailableRanges.length === 0 ? (
          <p style={{color:"white"}}>No unavailable dates.</p>
        ) : (
          <ul>
            {unavailableRanges.map((range, idx) => (
              <li key={idx}>
                {new Date(range.pickupDate).toLocaleDateString()} to{" "}
                {new Date(range.dropoffDate).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Container>
  );
};

export default CarAvailabilityChecker;
