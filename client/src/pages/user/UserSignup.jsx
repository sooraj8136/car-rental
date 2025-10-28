// import React, { useState } from "react";
// import { Form, Button, Container, Spinner, Alert } from "react-bootstrap";
// import { AxiosInstance } from "../../config/AxiosInstance";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// const UserSignup = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     mobile: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "mobile") {
//       // Allow only numbers
//       const cleaned = value.replace(/\D/g, "");
//       if (cleaned.length <= 10) {
//         setFormData((prev) => ({
//           ...prev,
//           [name]: cleaned,
//         }));
//       }
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }

//     setErrorMessage("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const { name, email, mobile, password } = formData;

//     if (!name || !email || !mobile || !password) {
//       setErrorMessage("All fields are required");
//       return;
//     }

//     if (password.length < 8) {
//       setErrorMessage("Password must be at least 8 characters long");
//       return;
//     }

//     if (!/^[0-9]{10}$/.test(mobile)) {
//       setErrorMessage("Mobile number must be exactly 10 digits");
//       return;
//     }

//     try {
//       setLoading(true);

//       const response = await AxiosInstance.post("/user/signup", formData);

//       toast.success(response.data.message);
//       navigate("/login");
//     } catch (err) {
//       setErrorMessage(err.response?.data?.error || "Signup failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container className="mt-5" style={{ maxWidth: "500px" }}>
//       <h2 className="text-center mb-4">User Signup</h2>
//       {errorMessage && (
//         <Alert variant="danger" className="text-center">
//           {errorMessage}
//         </Alert>
//       )}
//       <Form onSubmit={handleSubmit}>
//         <Form.Group controlId="name" className="mb-3">
//           <Form.Label>Full Name</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Enter your name"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//         </Form.Group>

//         <Form.Group controlId="email" className="mb-3">
//           <Form.Label>Email Address</Form.Label>
//           <Form.Control
//             type="email"
//             placeholder="Enter email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </Form.Group>

//         <Form.Group controlId="mobile" className="mb-3">
//           <Form.Label>Mobile Number</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Enter mobile number"
//             name="mobile"
//             value={formData.mobile}
//             onChange={handleChange}
//             required
//           />
//         </Form.Group>

//         <Form.Group controlId="password" className="mb-4">
//           <Form.Label>Password</Form.Label>
//           <Form.Control
//             type="password"
//             placeholder="Enter a password (min 8 characters)"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//         </Form.Group>

//         <Button variant="primary" type="submit" disabled={loading} className="w-100">
//           {loading ? <Spinner animation="border" size="sm" /> : "Signup"}
//         </Button>
//       </Form>
//     </Container>
//   );
// };

// export default UserSignup;



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
        backgroundImage:
          "url('https://images.unsplash.com/photo-1520587210458-bd3bee813b97?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZG9kZ2V8ZW58MHx8MHx8fDA%3D')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container className="d-flex justify-content-center align-items-center">
        <div
          className="p-4 shadow-lg"
          style={{
            width: "100%",
            maxWidth: "500px",
            // background: "rgba(255,255,255,0.15)",
            // backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            color: "#fff",
            borderRadius: "0px", // sharp edges
          }}
        >
          <h2
            className="text-center mb-4 text-font"
            style={{ letterSpacing: "2px" }}
          >
            User Signup
          </h2>

          {errorMessage && (
            <Alert variant="danger" className="text-center">
              {errorMessage}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Full Name*</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ borderRadius: "0px" }}
              />
            </Form.Group>

            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email Address*</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ borderRadius: "0px" }}
              />
            </Form.Group>

            <Form.Group controlId="mobile" className="mb-3">
              <Form.Label>Mobile Number*</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter mobile number"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                style={{ borderRadius: "0px" }}
              />
            </Form.Group>

            <Form.Group controlId="password" className="mb-4">
              <Form.Label>Password*</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter a password (min 8 characters)"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ borderRadius: "0px" }}
              />
            </Form.Group>

            <Button
              variant="dark"
              type="submit"
              disabled={loading}
              className="w-100"
              style={{ borderRadius: "0px", letterSpacing: "2px" }}
            >
              {loading ? <Spinner animation="border" size="sm" /> : "SIGNUP"}
            </Button>
            <div className="text-center mt-3">
              <Link
                to={"/login"}
                className="text-decoration-none text-light "
                style={{ letterSpacing: "2px", display: "block", marginTop: "5px" }}
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
