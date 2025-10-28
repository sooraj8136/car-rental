import React, { useState } from "react";
import { Form, Button, Container, Alert, Spinner } from "react-bootstrap";
import { AxiosInstance } from "../../config/AxiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const OwnerChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await AxiosInstance.post("/owner/change-owner-password", formData);
      toast.success(res.data.message);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      navigate("/owner/profile");
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Something went wrong";
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: "600px" }}>
      <h3 style={{marginTop:"120px"}}>Change Password</h3>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label style={{marginTop:"50px"}}>Current Password</Form.Label>
          <Form.Control
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
            minLength={8}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Confirm New Password</Form.Label>
          <Form.Control
            type="password"
            name="confirmNewPassword"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button type="submit" variant="dark" disabled={loading} style={{borderRadius:"0px"}}>
          {loading ? <Spinner animation="border" size="sm" /> : "Change Password"}
        </Button>
      </Form>
    </Container>
  );
};

export default OwnerChangePassword;
