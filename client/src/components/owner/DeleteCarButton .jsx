import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { AxiosInstance } from "../../config/AxiosInstance";

const DeleteCarButton = ({ carId, onSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await AxiosInstance.delete(`/car/delete-owner-car/${carId}`);
      toast.success(response.data.message || "Car deleted successfully");

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("❌ Delete error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete car. Please try again."
      );
    } finally {
      setDeleting(false);
      setShowModal(false);
    }
  };

  return (
  <>
    <Button
      variant="danger"
      size="md"
      onClick={() => setShowModal(true)}
      className="w-100 mt-2 py-2 border-0"
      style={{
        backgroundColor: "#ff0000",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => (e.target.style.backgroundColor = "#d00000")}
      onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff0000")}
    >
      Delete Car
    </Button>

    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to permanently delete this car?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)} disabled={deleting}>
          Cancel
        </Button>
        <Button variant="dark" onClick={handleDelete} disabled={deleting}>
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  </>
);

};

export default DeleteCarButton;
