import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Container } from "react-bootstrap";
import { AxiosInstance } from "../../config/AxiosInstance";
import { useForm } from "react-hook-form";

const OwnerLogin = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const owner = {
    login_api: "/owner/owner-login",
    profile_route: "/owner/profile",
    signup_route: "/owner/signup",
  };

  const onSubmit = async (data) => {
    try {
      const response = await AxiosInstance.post(owner.login_api, data);
      toast.success("Login successful");
      navigate(owner.profile_route);
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message;

      if (errorMessage === "Incorrect password") {
        toast.error("Incorrect password. Please try again.");
      } else if (errorMessage === "User not found") {
        toast.error("Owner not found. Please check your email.");
      } else if (
        errorMessage ===
        "Sorry, you cannot login because your account has been deactivated! Contact Admin..."
      ) {
        toast.error("Account deactivated. Contact admin.");
      } else {
        toast.error(errorMessage || "Login failed. Try again.");
      }
    }
  };

  return (
  <div
    style={{
      minHeight: "100vh",
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
          maxWidth: "400px",
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "12px",
          color: "#fff",
        }}
      >
        <h3
          className="mb-4 text-center"
          style={{
            letterSpacing: "2px",
            fontWeight: "700",
            color: "#fff",
          }}
        >
          Owner Sign In
        </h3>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">
              Email<span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="email"
              {...register("email")}
              className="form-control"
              id="email"
              placeholder="Enter your email"
              required
              style={{
                borderRadius: "6px",
                padding: "10px",
                fontSize: "0.95rem",
              }}
            />
          </div>

          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label fw-semibold">
              Password<span style={{ color: "red" }}>*</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className="form-control"
              id="password"
              placeholder="Enter your password"
              required
              style={{
                borderRadius: "6px",
                padding: "10px",
                fontSize: "0.95rem",
              }}
            />
            <small
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "12px",
                top: "43px",
                cursor: "pointer",
                fontSize: "0.85rem",
                color: "#000000ff",
                fontWeight: "600",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </small>
          </div>

          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-dark"
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
              Sign In
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p
            style={{
              marginBottom: "5px",
              color: "#ccc",
              letterSpacing: "1px",
            }}
          >
            Don’t have an account?
          </p>
          <Link
            to={owner.signup_route}
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
            SIGN UP
          </Link>
        </div>
      </div>
    </Container>
  </div>
);

};

export default OwnerLogin;
