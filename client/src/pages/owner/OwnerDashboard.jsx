import React, { useEffect, useState } from "react";
import { Spinner, Card, Row, Col, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AxiosInstance } from "../../config/AxiosInstance";
import Barchart from "../../components/owner/Barchart";

function OwnerDashboard() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchOwnerBookings = async () => {
      try {
        const res = await AxiosInstance.get("/booking/get-owner-booking");
        setBookings(res.data.data || []);
      } catch (error) {
        console.error("Error fetching owner bookings:", error);
      }
    };

    const fetchOwnerCars = async () => {
      try {
        const res = await AxiosInstance.get("/car/get-owner-cars");
        setCars(res.data.data?.cars || []);
      } catch (error) {
        console.error("Error fetching owner cars:", error);
      }
    };

    Promise.all([fetchOwnerBookings(), fetchOwnerCars()]).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="dark" />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column flex-md-row" style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <div
        className="p-3"
        style={{
          width: "100%",
          maxWidth: "250px",
          backgroundColor: "transparent",
          position: "relative",
          zIndex: 1000,
        }}
      >
        <Nav className="flex-column" style={{ marginTop: "100px" }}>
          <Nav.Item>
            <Link to="/owner/owner-cars" className="nav-link text-dark">
              Manage Cars
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/owner/pending-req" className="nav-link text-dark">
              Pending Requests
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/owner/create-car" className="nav-link text-dark">
              Create car
            </Link>
          </Nav.Item>
        </Nav>
      </div>

      <div className="flex-grow-1 p-4" style={{ backgroundColor: "transparent", borderRadius: "0px" }}>
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-dark">Owner Dashboard</h2>
          </div>

          <Row className="gy-4">
            <Col xs={12} sm={6} md={4}>
              <Card className="bg-light text-dark" style={{ borderRadius: "0px" }}>
                <Card.Body>
                  <h5>Total Bookings</h5>
                  <p className="h5">{bookings.length}</p>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Card className="bg-light text-dark" style={{ borderRadius: "0px" }}>
                <Card.Body>
                  <h5>Total Sales</h5>
                  <p className="h5">$12,450</p>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Card className="bg-light text-dark" style={{ borderRadius: "0px" }}>
                <Card.Body>
                  <h5>Total Cars</h5>
                  <p className="h5">{cars.length}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className="my-5">
            <Barchart role="owner" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboard;
