import React, { useState } from "react";
import { Form, Button, Container, Spinner, Alert } from "react-bootstrap";
import { AxiosInstance } from "../../config/AxiosInstance";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const UserSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      const cleaned = value.replace(/\D/g, "");
      if (cleaned.length <= 10) {
        setFormData((prev) => ({ ...prev, [name]: cleaned }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, mobile, password } = formData;

    if (!name || !email || !mobile || !password) {
      setErrorMessage("All fields are required");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      return;
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
      setErrorMessage("Mobile number must be exactly 10 digits");
      return;
    }

    try {
      setLoading(true);
      const response = await AxiosInstance.post("/user/signup", formData);
      toast.success(response.data.message);
      navigate("/login");
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "125vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #000000 0%, #434343 100%)",
      }}
    >
      <Container className="d-flex justify-content-center align-items-center">
        <div
          className="p-4 rounded shadow-lg"
          style={{
            width: "100%",
            maxWidth: "500px",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            color: "#fff",
          }}
        >
          <h2
            className="text-center mb-4 "
            style={{
              letterSpacing: "2px",
              fontWeight: "700",
              color: "#fff",
            }}
          >
            Create Your Account
          </h2>

          {errorMessage && (
            <Alert
              variant="danger"
              className="text-center"
              style={{
                borderRadius: "8px",
                fontSize: "0.9rem",
              }}
            >
              {errorMessage}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label className="fw-semibold">
                Full Name<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  borderRadius: "6px",
                  padding: "10px",
                  fontSize: "0.95rem",
                }}
              />
            </Form.Group>

            <Form.Group controlId="email" className="mb-3">
              <Form.Label className="fw-semibold">
                Email Address<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  borderRadius: "6px",
                  padding: "10px",
                  fontSize: "0.95rem",
                }}
              />
            </Form.Group>

            <Form.Group controlId="mobile" className="mb-3">
              <Form.Label className="fw-semibold">
                Mobile Number<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your mobile number"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                style={{
                  borderRadius: "6px",
                  padding: "10px",
                  fontSize: "0.95rem",
                }}
              />
            </Form.Group>

            <Form.Group controlId="password" className="mb-4">
              <Form.Label className="fw-semibold">
                Password<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter a password (min 8 characters)"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  borderRadius: "6px",
                  padding: "10px",
                  fontSize: "0.95rem",
                }}
              />
            </Form.Group>

            <Button
              type="submit"
              disabled={loading}
              className="w-100 fw-semibold"
              style={{
                letterSpacing: "2px",
                borderRadius: "8px",
                padding: "10px 0",
                fontWeight: "600",
                backgroundColor: "#000",
                border: "none",
                color: "#fff",
                transition: "0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#222")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#000")}
            >
              {loading ? <Spinner animation="border" size="sm" /> : "SIGN UP"}
            </Button>

            <div className="text-center mt-4">
              <p
                style={{
                  marginBottom: "5px",
                  color: "#ccc",
                  letterSpacing: "1px",
                }}
              >
                Already have an account?
              </p>
              <Link
                to="/login"
                className="text-decoration-none fw-bold"
                style={{
                  color: "#0d6efd",
                  letterSpacing: "2px",
                  display: "block",
                  marginTop: "5px",
                  transition: "0.3s",
                }}
                onMouseOver={(e) => (e.target.style.color = "#000000ff")}
                onMouseOut={(e) => (e.target.style.color = "#ffffffff")}
              >
                SIGN IN
              </Link>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );

};

export default UserSignup;
