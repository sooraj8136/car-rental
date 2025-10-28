import React, { useEffect, useState } from "react";
import { Spinner, Table, Alert } from "react-bootstrap";
import { AxiosInstance } from "../../config/AxiosInstance";

const AllOwners = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await AxiosInstance.get("/owner/get-all-owners");
        setOwners(response.data.data);
      } catch (err) {
        setError("Failed to fetch owners");
        console.error("Fetch owners error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOwners();
  }, []);

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4">
      <h3 className="mb-3">All Owners</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {owners.map((owner, index) => (
            <tr key={owner._id}>
              <td>{index + 1}</td>
              <td>{owner.name}</td>
              <td>{owner.email}</td>
              <td>{owner.mobile}</td>
              <td>{new Date(owner.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AllOwners;
