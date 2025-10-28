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
        <Container className="mt-5 d-flex justify-content-center">
            <Card style={{ width: "100%", maxWidth: "500px" }} className="p-4 shadow-sm">
                <h3 className="text-center mb-4">Owner Signup</h3>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="name" className="mb-3">
                        <Form.Label>Name*</Form.Label>
                        <Form.Control type="text" name="name" value={form.name} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group controlId="email" className="mb-3">
                        <Form.Label>Email*</Form.Label>
                        <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group controlId="mobile" className="mb-3">
                        <Form.Label>Mobile*</Form.Label>
                        <Form.Control
                            type="tel"
                            name="mobile"
                            value={form.mobile}
                            onChange={handleChange}
                            required
                            placeholder="Enter 10-digit number"
                            pattern="\d{10}"
                            maxLength={10}
                        />
                    </Form.Group>

                    <Form.Group controlId="password" className="mb-3">
                        <Form.Label>Password*</Form.Label>
                        <Form.Control type="password" name="password" value={form.password} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group controlId="companyName" className="mb-3">
                        <Form.Label>Company Name* </Form.Label>
                        <Form.Control type="text" name="companyName" value={form.companyName} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group controlId="address" className="mb-4">
                        <Form.Label>Address*</Form.Label>
                        <Form.Control type="text" name="address" value={form.address} onChange={handleChange} required />
                    </Form.Group>

                    <Button type="submit" className="w-100" disabled={loading}>
                        {loading ? <Spinner size="sm" animation="border" /> : "Signup"}
                    </Button>
                    <div  className="text-center mt-3">
                        <Link
                            to={"/owner/login"}
                            className="text-decoration-none text-dark "
                            style={{ letterSpacing: "2px", display: "block", marginTop: "5px" }}
                        >
                            Sign in
                        </Link>
                    </div>
                </Form>
            </Card>
        </Container>
    );
};

export default OwnerSignup;
