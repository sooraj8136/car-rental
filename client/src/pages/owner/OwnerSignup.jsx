import React, { useState } from "react";
import { Form, Button, Card, Container, Spinner } from "react-bootstrap";
import { AxiosInstance } from "../../config/AxiosInstance";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

const OwnerSignup = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        companyName: "",
        address: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "mobile") {
            // Allow only numbers
            const cleaned = value.replace(/\D/g, "");
            if (cleaned.length <= 10) {
                setForm({ ...form, [name]: cleaned });
            }
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, email, mobile, password, address, companyName } = form;

        if (!name || !email || !mobile || !password || !address || !companyName) {
            return toast.error("Please fill all required fields.");
        }

        if (!/^\d{10}$/.test(mobile)) {
            return toast.error("Mobile number must be exactly 10 digits.");
        }

        if (password.length < 8) {
            return toast.error("Password must be at least 8 characters.");
        }

        try {
            setLoading(true);
            const response = await AxiosInstance.post("/owner/owner-signup", form, {
                withCredentials: true,
            });

            toast.success(response.data.message || "Signup successful!");
            navigate("/owner/login")
        } catch (err) {
            toast.error(err.response?.data?.error || "Signup failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "150vh",
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
                    <h3
                        className="text-center mb-4"
                        style={{
                            letterSpacing: "2px",
                            fontWeight: "700",
                            color: "#fff",
                        }}
                    >
                        Owner Signup
                    </h3>

                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="name" className="mb-3">
                            <Form.Label className="fw-semibold">
                                Name<span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={form.name}
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
                                Email<span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={form.email}
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
                                Mobile<span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                                type="tel"
                                name="mobile"
                                value={form.mobile}
                                onChange={handleChange}
                                required
                                placeholder="Enter 10-digit number"
                                pattern="\d{10}"
                                maxLength={10}
                                style={{
                                    borderRadius: "6px",
                                    padding: "10px",
                                    fontSize: "0.95rem",
                                }}
                            />
                        </Form.Group>

                        <Form.Group controlId="password" className="mb-3">
                            <Form.Label className="fw-semibold">
                                Password<span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                style={{
                                    borderRadius: "6px",
                                    padding: "10px",
                                    fontSize: "0.95rem",
                                }}
                            />
                        </Form.Group>

                        <Form.Group controlId="companyName" className="mb-3">
                            <Form.Label className="fw-semibold">
                                Company Name<span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="companyName"
                                value={form.companyName}
                                onChange={handleChange}
                                required
                                style={{
                                    borderRadius: "6px",
                                    padding: "10px",
                                    fontSize: "0.95rem",
                                }}
                            />
                        </Form.Group>

                        <Form.Group controlId="address" className="mb-4">
                            <Form.Label className="fw-semibold">
                                Address<span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={form.address}
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
                                to="/owner/login"
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

export default OwnerSignup;
