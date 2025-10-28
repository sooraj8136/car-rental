import React from "react";
import logo from "../../../public/L.png";

function Footer() {
  return (
    <footer style={{ color: "black", padding: "2rem 1rem", marginTop: "150px"}}>
      <div style={{ maxWidth: "1200px", margin: "auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "2rem" }}>

        {/* Logo & Description */}
        <div style={{ flex: "1 1 250px" }}>
          <img
            src={logo}
            alt="Lucent Mobility"
            height="30"
            style={{ objectFit: 'contain' }}
          />
          <p>Your trusted car rental platform across the USA. Reliable. Fast. Affordable.</p>
        </div>

        {/* Quick Links */}
        <div style={{ flex: "1 1 150px" }}>
          <h4>Quick Links</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {/* <li><a href="/admin/login" style={{ color: "black", textDecoration: "none" }}>Admin Login</a></li> */}
            <li><a href="/owner/login" style={{ color: "black", textDecoration: "none" }}>Owner Login</a></li>
            <li><a href="/about" style={{ color: "black", textDecoration: "none" }}>About</a></li>
            <li><a href="/contact" style={{ color: "black", textDecoration: "none" }}>Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div style={{ flex: "1 1 200px" }}>
          <h4>Contact</h4>
          <p>Email: support@sjrentals.com</p>
          <p>Phone: +1 800 123 4567</p>
          <p>Location: Los Angeles, CA</p>
        </div>

        {/* Social Media */}
        <div style={{ flex: "1 1 150px" }}>
          <h4>Follow Us</h4>
          <div style={{ display: "flex", gap: "1rem" }}>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ color: "black" }}>Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: "black" }}>Instagram</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" style={{ color: "black" }}>Twitter</a>
          </div>
        </div>
      </div>

      <hr style={{ margin: "2rem 0", borderColor: "#444" }} />

      <div style={{ textAlign: "center", fontSize: "0.9rem" }}>
        &copy; {new Date().getFullYear()} S&J Rentals. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
