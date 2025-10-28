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
        backgroundImage:
          "url('https://images.ctfassets.net/s699s7kh1jys/3vRxIaN45HiOejDXcdWaRK/0ec8a537ecf89284992ee6bb92315e71/porsche_911_wallpapers_carrera_gts_1_desktop.jpg')",
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
          className="p-4 rounded shadow-lg"
          style={{
            width: "100%",
            maxWidth: "400px",
            // backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            color: "#fff",
          }}
        >
          <h3 className="mb-4 text-center text-font" style={{ letterSpacing: "2px" }}>Login your account</h3>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">
                Email*
              </label>
              <input
                type="email"
                {...register("email")}
                className="form-control"
                id="email"
                placeholder="Enter your email"
                required
                style={{ borderRadius: 0 }}
              />
            </div>

            <div className="mb-3 position-relative">
              <label htmlFor="password" className="form-label fw-semibold">
                Password*
              </label>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="form-control"
                id="password"
                placeholder="Enter your password"
                required
                style={{ borderRadius: 0 }}
              />
              <small
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "38px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  color: "#060000ff",
                  fontWeight: "500",
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </small>
            </div>

            <div className="d-grid  text-font">
              <button type="submit" className="btn btn-dark" style={{ letterSpacing: "2px", borderRadius: 0 }}>
                Sign In
              </button>
            </div>
          </form>

          <div className="text-center mt-3">
            <p style={{ marginBottom: "5px", color: "#fff", letterSpacing: "1px" }}>Don’t have an account?</p>
            <Link
              to={user.signup_route}
              className="text-decoration-none text-light fw-bold"
              style={{ letterSpacing: "2px", display: "block", marginTop: "5px" }}
            >
              SIGNUP
            </Link>
          </div>

        </div>
      </Container>
    </div>
  );
};

export default UserLogin;
