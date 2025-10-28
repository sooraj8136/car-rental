import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Container } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { AxiosInstance } from "../../config/AxiosInstance"; // Adjust the path based on your project structure

const AdminLogin = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const admin = {
    login_api: "/admin/admin-login",
    profile_route: "/admin/admin-profile",
    signup_route: "/admin/admin-signup", // if you have admin signup
  };

  const onSubmit = async (data) => {
    try {
      const response = await AxiosInstance.post(admin.login_api, data, {
        withCredentials: true, // important to receive cookie
      });

      toast.success("Login successful");
      navigate(admin.profile_route);
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message;

      if (errorMessage === "Incorrect password") {
        toast.error("Incorrect password. Please try again.");
      } else if (errorMessage === "Admin not found") {
        toast.error("Admin not found. Please check your email.");
      } else if (errorMessage === "Admin profile is deactivated") {
        toast.error("Account deactivated. Contact super admin.");
      } else {
        toast.error(errorMessage || "Login failed. Try again.");
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="p-4 border rounded shadow" style={{ width: "100%", maxWidth: "400px", backgroundColor: "#f8f9fa" }}>
        <h4 className="mb-4 text-center">Admin Sign In</h4>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              {...register("email")}
              className="form-control"
              id="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className="form-control"
              id="password"
              placeholder="Enter your password"
              required
            />
            <small
              onClick={() => setShowPassword(!showPassword)}
              className="text-primary"
              style={{
                position: "absolute",
                right: "10px",
                top: "38px",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "0.75rem",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </small>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-dark">Sign In</button>
          </div>
        </form>

        <div className="text-center mt-3">
          <Link to={admin.signup_route} className="text-decoration-none text-secondary small">
            Signup
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default AdminLogin;
