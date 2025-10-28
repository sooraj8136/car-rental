import React, { useState, useEffect } from "react";
import { Form, Button, Container, Spinner, Alert, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { AxiosInstance } from "../../config/AxiosInstance";
import toast from "react-hot-toast";

const UpdateCarForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        brand: "",
        model: "",
        year: "",
        color: "",
        registrationNumber: "",
        fuelType: "",
        transmission: "",
        seats: "",
        rentalPricePerDay: "",
        available: true,
        description: "",
        category: "",
        location: "",
    });

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState("");

    // Fetch existing car details
    useEffect(() => {
        const fetchCar = async () => {
            try {
                const res = await AxiosInstance.get(`/car/get-a-car/${id}`);
                setFormData(res.data.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch car details");
            } finally {
                setFetching(false);
            }
        };
        fetchCar();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === "checkbox" ? checked : value;
        setFormData((prev) => ({ ...prev, [name]: val }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await AxiosInstance.put(`/car/update-owner-car/${id}`, formData);
            toast.success(res.data.message);
            navigate("/owner/owner-cars");
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="my-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <h2 className="mb-4">Update Car Details</h2>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Brand</Form.Label>
                            <Form.Control type="text" name="brand" value={formData.brand} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Model</Form.Label>
                            <Form.Control type="text" name="model" value={formData.model} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Year</Form.Label>
                            <Form.Control type="number" name="year" value={formData.year} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Color</Form.Label>
                            <Form.Control type="text" name="color" value={formData.color} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Registration Number</Form.Label>
                            <Form.Control type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Control type="text" name="category" value={formData.category} onChange={handleChange} />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Fuel Type</Form.Label>
                            <Form.Select name="fuelType" value={formData.fuelType} onChange={handleChange}>
                                <option value="">Select</option>
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Electric">Electric</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Transmission</Form.Label>
                            <Form.Select name="transmission" value={formData.transmission} onChange={handleChange}>
                                <option value="">Select</option>
                                <option value="Manual">Manual</option>
                                <option value="Automatic">Automatic</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Seats</Form.Label>
                            <Form.Control type="number" name="seats" value={formData.seats} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Rental Price Per Day</Form.Label>
                            <Form.Control type="number" name="rentalPricePerDay" value={formData.rentalPricePerDay} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Location</Form.Label>
                            <Form.Control type="text" name="location" value={formData.location} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Available"
                                name="available"
                                checked={formData.available}
                                onChange={handleChange}
                            />
                        </Form.Group>

                    </Col>
                </Row>

                <Form.Group className="mb-4">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={4} name="description" value={formData.description} onChange={handleChange} />
                </Form.Group>

                <Button type="submit" variant="dark" disabled={loading} style={{borderRadius:"0px"}}>
                    {loading ? "Updating..." : "Update Car"}
                </Button>
            </Form>
        </Container>
    );
};

export default UpdateCarForm;
