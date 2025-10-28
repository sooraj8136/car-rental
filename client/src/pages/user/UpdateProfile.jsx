import React, { useState, useEffect } from "react";
import { Container, Form, Button, Spinner, Alert } from "react-bootstrap";
import { AxiosInstance } from "../../config/AxiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    profilePic: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await AxiosInstance.get("/user/profile", {
          withCredentials: true,
        });
        const { name, email, mobile, profilePic } = res.data.data;
        setFormData({ name, email, mobile, profilePic: profilePic || "" });
      } catch (err) {
        setErrorMessage("Failed to fetch user profile. Please log in again.");
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessage(""); // Clear error on input change
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { name, email, mobile, profilePic } = formData;

    if (!name && !email && !mobile && !profilePic) {
      setErrorMessage("At least one field must be filled to update.");
      return;
    }

    if (name && name.length < 3) {
      setErrorMessage("Name must be at least 3 characters.");
      return;
    }

    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      setErrorMessage("Invalid email format.");
      return;
    }

    if (mobile && !/^[0-9]{10}$/.test(mobile)) {
      setErrorMessage("Mobile number must be 10 digits.");
      return;
    }

    try {
      setLoading(true);
      const response = await AxiosInstance.put(
        "/user/update-user-profile",
        { name, email, mobile, profilePic },
        { withCredentials: true }
      );
      toast.success(response.data.message);
      navigate("/user/profile");
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <h3 className="mb-4 text-center" style={{wordSpacing:"4px"}}>UPDATE PROFILE</h3>
      {errorMessage && (
        <Alert variant="danger" className="text-center">
          {errorMessage}
        </Alert>
      )}
      <Form onSubmit={handleUpdate}>
        <Form.Group controlId="name" className="mb-3">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter new name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter new email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="mobile" className="mb-3">
          <Form.Label>Mobile Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter new mobile number"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
          />
        </Form.Group>

        <div className="d-flex flex-column flex-sm-row gap-3 mt-3">
          <Button
            type="submit"
            disabled={loading}
            className="w-100"
            variant="dark"
            style={{borderRadius:"0px"}}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Update Profile"}
          </Button>

          <Button
            type="button"
            variant="outline-dark"
            className="w-100"
            onClick={() => navigate(-1)}
            style={{borderRadius:"0px"}}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default UpdateProfile;
