// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { Container } from "react-bootstrap";
// import { AxiosInstance } from "../../config/AxiosInstance";
// import { useForm } from "react-hook-form";
// import { useSelector } from "react-redux";

// const UserLogin = () => {
//   const { register, handleSubmit } = useForm();
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);

//   const user = {
//     login_api: "/user/login",
//     profile_route: "/user/profile",
//     signup_route: "/signup",
//   };

//   const onSubmit = async (data) => {
//     try {
//       const response = await AxiosInstance.post(user.login_api, data);
//       toast.success("Login successful");
//       navigate(user.profile_route);
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || error.response?.data?.message;

//       if (errorMessage === "Incorrect password") {
//         toast.error("Incorrect password. Please try again.");
//       } else if (errorMessage === "User not found") {
//         toast.error("User not found. Please check your email.");
//       } else if (
//         errorMessage ===
//         "Sorry, you cannot login because your account has been deactivated! Contact Admin..."
//       ) {
//         toast.error("Account deactivated. Contact admin.");
//       } else {
//         toast.error(errorMessage || "Login failed. Try again.");
//       }
//     }
//   };

//   return (
//     <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
//       <div className="p-4 border rounded shadow" style={{ width: "100%", maxWidth: "400px", backgroundColor: "#f8f9fa" }}>
//         <h4 className="mb-4 text-center">Sign In to Your Account</h4>

//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="mb-3">
//             <label htmlFor="email" className="form-label">
//               Email
//             </label>
//             <input
//               type="email"
//               {...register("email")}
//               className="form-control"
//               id="email"
//               placeholder="Enter your email"
//               required
//             />
//           </div>

//           <div className="mb-3 position-relative">
//             <label htmlFor="password" className="form-label">
//               Password
//             </label>
//             <input
//               type={showPassword ? "text" : "password"}
//               {...register("password")}
//               className="form-control"
//               id="password"
//               placeholder="Enter your password"
//               required
//             />
//             <small
//               onClick={() => setShowPassword(!showPassword)}
//               className="text-dark"
//               style={{
//                 position: "absolute",
//                 right: "10px",
//                 top: "38px",
//                 cursor: "pointer",
//                 fontWeight: "500",
//                 fontSize: "0.75rem",
//               }}
//             >
//               {showPassword ? "Hide" : "Show"}
//             </small>
//           </div>

//           {/* <div className="mb-3 text-end">
//             <Link to="/user/user-forgot-password" className="text-decoration-none small text-secondary">
//               Forgot password?
//             </Link>
//           </div> */}

//           <div className="d-grid">
//             <button type="submit" className="btn btn-dark">
//               Sign In
//             </button>
//           </div>
//         </form>

//         <div className="text-center mt-3">
//           <Link to={user.signup_route} className="text-decoration-none text-secondary small">
//             Signup
//           </Link>
//         </div>
//       </div>
//     </Container>
//   );
// };

// export default UserLogin;



import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Container } from "react-bootstrap";
import { AxiosInstance } from "../../config/AxiosInstance";
import { useForm } from "react-hook-form";
import { FaLock, FaLockOpen } from "react-icons/fa";

const UserLogin = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const user = {
    login_api: "/user/login",
    profile_route: "/user/profile",
    signup_route: "/signup",
  };

  const onSubmit = async (data) => {
    try {
      await AxiosInstance.post(user.login_api, data);
      toast.success("Login successful");
      navigate(user.profile_route);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.response?.data?.message;
      if (errorMessage === "Incorrect password") {
        toast.error("Incorrect password. Please try again.");
      } else if (errorMessage === "User not found") {
        toast.error("User not found. Please check your email.");
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
        background: "linear-gradient(135deg, #000000 0%, #434343 100%)", // subtle gradient
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
            className="mb-4 text-center "
            style={{
              letterSpacing: "2px",
              fontWeight: "700",
              color: "#fff",
            }}
          >
            Login to Your Account
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

            <div className="d-grid ">
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
                  transition: "0.3s",
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#222")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#000")}
              >
                SIGN IN
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
              to={user.signup_route}
              className="text-decoration-none fw-bold"
              style={{
                letterSpacing: "2px",
                color: "#ffffffff",
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

export default UserLogin;
