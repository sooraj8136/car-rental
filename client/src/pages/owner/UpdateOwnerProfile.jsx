import React, { useEffect, useState } from "react";
import { Form, Button, Alert, Container, Row, Col, Spinner } from "react-bootstrap";
import toast from "react-hot-toast";
import { AxiosInstance } from "../../config/AxiosInstance";
import { useNavigate } from "react-router-dom";

const UpdateOwnerProfile = () => {
    const [owner, setOwner] = useState(null);
    const [formData, setFormData] = useState(null); // initially null
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await AxiosInstance.get("/owner/owner-profile");
                setOwner(res.data.data);
                setFormData({
                    name: res.data.data.name || "",
                    email: res.data.data.email || "",
                    mobile: res.data.data.mobile || "",
                    companyName: res.data.data.companyName || "",
                    address: res.data.data.address || "",
                });
            } catch (err) {
                setError("Failed to load profile");
                navigate("/owner/login");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

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

        // Filter out unchanged fields
        const updatedFields = {};
        Object.keys(formData).forEach((key) => {
            if (formData[key] !== owner[key]) {
                updatedFields[key] = formData[key];
            }
        });

        if (Object.keys(updatedFields).length === 0) {
            toast("No changes made", { icon: "ℹ️" });
            return;
        }

        try {
            const res = await AxiosInstance.put("/owner/update-owner-profile", updatedFields);
            toast.success(res.data.message);
            setOwner(res.data.data);
            navigate("/owner/profile");
        } catch (err) {
            const msg =
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Update failed. Try again.";
            toast.error(msg);
        }
    };

    if (loading || !formData) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
                <Spinner animation="border" />
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <h3>Update Owner Profile</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Mobile</Form.Label>
                            <Form.Control type="tel" name="mobile" value={formData.mobile} onChange={handleChange} />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Company Name</Form.Label>
                            <Form.Control type="text" name="companyName" value={formData.companyName} onChange={handleChange} />
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control as="textarea" rows={3} name="address" value={formData.address} onChange={handleChange} />
                </Form.Group>
                <div className="d-flex gap-2">
                    <Button type="submit" variant="dark" style={{borderRadius:"0px"}}>Update Profile</Button>
                    <Button variant="secondary" onClick={() => navigate("/owner/profile")} style={{borderRadius:"0px"}}>Cancel</Button>
                </div>
            </Form>
        </Container>
    );
};

export default UpdateOwnerProfile;
