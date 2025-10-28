import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { AxiosInstance } from "../../config/AxiosInstance";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser } from "../../redux/features/userSlice";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchProfile = async () => {
    try {
      const response = await AxiosInstance.get("/user/profile", {
        withCredentials: true,
      });
      setProfile(response.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch user profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await AxiosInstance.post("/user/logout", null, {
        withCredentials: true,
      });
      toast.success(response.data.message || "Logout successful");
      dispatch(clearUser());
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.error || "Logout failed");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!profile) return null;

  return (
    <Container fluid className="" style={{marginTop:"100px"}}>
      <Row>
        {/* Left Sidebar */}
        <Col md={3} className="border-end pe-4">
          <h5 className="mb-3 fw-bold profile-font">Welcome, {profile.name}</h5>
          <p className="text-muted mb-1">Email: {profile.email}</p>
          <p className="text-muted mb-1">Mobile: {profile.mobile}</p>
          <p className="text-muted mb-3">
            Status:{" "}
            <span
              className={
                profile.isActive
                  ? "text-success fw-semibold"
                  : "text-danger fw-semibold"
              }
            >
              {profile.isActive ? "Active" : "Inactive"}
            </span>
          </p>

          <nav className="d-flex flex-column gap-2">
            <Link to="/user/user-bookings" className="text-decoration-none fw-semibold text-dark">
              MY BOOKINGS
            </Link>
            <Link to="/user/update-profile" className="text-decoration-none fw-semibold text-dark">
              EDIT PROFILE
            </Link>
            <Button
              variant="link"
              onClick={handleLogout}
              className="text-danger fw-semibold text-start px-0 text-dark"
            >
              SIGN OUT
            </Button>
          </nav>
        </Col>

        {/* Right Content */}
        <Col md={9} className="ps-4">
          <h2 className="fw-bold mb-4 profile-font" style={{fontSize:"60px"}}>Account & Rewards</h2>

          <Row className="g-4">
            <Col md={6}>
              <div className="p-3 border rounded text-center">
                <img
                  src="https://images.unsplash.com/photo-1549924231-f129b911e442?w=800"
                  alt="Car Rental"
                  style={{ height: "120px", objectFit: "cover", width: "100%", borderRadius: "8px" }}
                />
                <p className="mt-3 fw-semibold">Luxury Car Rental</p>
                <small className="text-muted d-block mb-2">
                  Drive premium cars at affordable rates.
                </small>
                <small className="fw-bold text-dardk">Valid until: 15/10/2026</small>
              </div>
            </Col>
            <Col md={6}>
              <div className="p-3 border rounded text-center">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
                  alt="Spotify"
                  style={{ height: "60px" }}
                />
                <p className="mt-3 fw-semibold">For members who love music</p>
                <small className="text-muted">Valid until: 04/10/2025</small>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
