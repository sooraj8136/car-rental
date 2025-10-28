import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { AxiosInstance } from "../../config/AxiosInstance";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearOwner } from "../../redux/features/ownerSlice";

const OwnerProfile = () => {
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchProfile = async () => {
    try {
      const response = await AxiosInstance.get("/owner/owner-profile", {
        withCredentials: true,
      });
      setOwner(response.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch owner profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await AxiosInstance.post("/owner/owner-logout", null, {
        withCredentials: true,
      });
      toast.success(response.data.message || "Logout successful");
      dispatch(clearOwner());
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.error || "Logout failed");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to permanently delete your account? This action cannot be undone."
      );
      if (!confirmDelete) return;

      await AxiosInstance.delete("/owner/delete-own-account", {
        withCredentials: true,
      });
      toast.success("Account deleted successfully");
      dispatch(clearOwner());
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5 pt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!owner) return null;

  return (
    <Container fluid style={{ marginTop: "100px" }}>
      <Row>
        {/* Left Sidebar */}
        <Col md={3} className="border-end pe-4">
          <h5 className="mb-3 fw-bold profile-font">Welcome, {owner.name}</h5>
          <p className="text-muted mb-1">Email: {owner.email}</p>
          <p className="text-muted mb-1">Mobile: {owner.mobile}</p>
          <p className="text-muted mb-3">
            Status:{" "}
            <span className={owner.isActive ? "text-success fw-semibold" : "text-danger fw-semibold"}>
              {owner.isActive ? "Active" : "Inactive"}
            </span>
          </p>

          <nav className="d-flex flex-column gap-2">
            <Link to="/owner/change-password" className="text-decoration-none fw-semibold text-dark">
              CHANGE PASSWORD
            </Link>
            <Link to="/owner/update-profile" className="text-decoration-none fw-semibold text-dark">
              EDIT PROFILE
            </Link>
            <Button
              variant="link"
              onClick={handleLogout}
              className="text-danger fw-semibold text-start px-0 text-dark"
            >
              SIGN OUT
            </Button>
            <Button
              variant="link"
              onClick={handleDeleteAccount}
              className="text-danger fw-semibold text-start px-0 text-dark"
            >
              DELETE ACCOUNT
            </Button>
          </nav>
        </Col>

        {/* Right Content */}
        <Col md={9} className="ps-4">
          <h2 className="fw-bold mb-4 profile-font" style={{ fontSize: "50px" }}>
            Account & Dashboard
          </h2>

          <Row className="g-4">
            <Col md={6}>
              <div className="p-3 border rounded text-center">
                <img
                  src="https://images.unsplash.com/photo-1549924231-f129b911e442?w=800"
                  alt="Manage Cars"
                  style={{ height: "120px", objectFit: "cover", width: "100%", borderRadius: "8px" }}
                />
                <p className="mt-3 fw-semibold">Manage Cars</p>
                <small className="text-muted d-block mb-2">
                  Add, edit or remove cars from your inventory.
                </small>
              </div>
            </Col>
            <Col md={6}>
              <div className="p-3 border rounded text-center">
                <img
                  src="https://imgd.aeplcdn.com/1280x720/n/cw/ec/178277/porsche-911-left-front-three-quarter1.jpeg?isig=0&wm=0"
                  alt="Booking Requests"
                  style={{ height: "120px", objectFit: "cover", width: "100%", borderRadius: "8px" }}
                />
                <p className="mt-3 fw-semibold">Pending Requests</p>
                <small className="text-muted d-block">
                  Check and manage booking requests from users.
                </small>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default OwnerProfile;
