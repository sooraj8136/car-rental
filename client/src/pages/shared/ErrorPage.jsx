import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from '../../components/user/Header';
import Footer from '../../components/user/Footer';

function ErrorPage({ role = "guest" }) {
  const navigate = useNavigate();

  const handleNavigation = () => {
    if (role === "user") {
      navigate("/");
    } else if (role === "admin") {
      navigate("/admin");
    } else if (role === "owner") {
      navigate("/owner");
    } else {
      navigate("/"); // for guest or unknown role
    }
  };

  return (
    <>
      <Header />
      <Container className="my-5 text-center">
        <div style={{ marginTop: "140px" }}>
          <h1 className="fw-bold" style={{color:"gray"}}>PAGE NOT FOUND</h1>
        </div>
        <div className="mt-3">
          <p className="fw-medium">
            WE'RE SORRY, BUT THE PAGE YOU'RE LOOKING FOR IS CURRENTLY UNAVAILABLE.
          </p>
          <br />
          <Link onClick={handleNavigation} className="text-black fw-semibold" style={{ cursor: 'pointer' }}>
            BACK TO HOME
          </Link>
        </div>
      </Container>
      <Footer />
    </>
  );
}

export default ErrorPage;
