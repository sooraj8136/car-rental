import React, { useState } from 'react';
import { Navbar, Nav, Container, Collapse, Form } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import logo from "../../../public/L.png"; // adjust the path as needed

function UserHeader() {
    const [expanded, setExpanded] = useState(false);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim() !== "") {
            navigate(`/cars?search=${encodeURIComponent(search.trim())}`);
            setExpanded(false);
        }
    };

    return (
        <Navbar bg="white" expand="md" fixed="top"  style={{ minHeight: '70px' }}>
            <Container className="d-flex align-items-center justify-content-between">
                {/* Logo + Brand */}
                <div className="d-flex align-items-center">
                    <Navbar.Brand as={Link} to="/" className="d-flex align-items-center me-2 mb-0">
                        <img
                            src={logo}
                            alt="Lucent Mobility"
                            style={{
                                height: "60px",  // bigger logo height
                                width: "auto",
                                objectFit: "contain",
                            }}
                        />
                    </Navbar.Brand>

                    <p
                        className="anton-regular text-dark mb-0"
                        style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            lineHeight: "1",    // align vertically with logo
                            whiteSpace: "nowrap",
                            marginLeft: "6px"
                        }}
                    >
                        LUCENT MOBILITY
                    </p>
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setExpanded(prev => !prev)}
                    aria-controls="basic-navbar-nav"
                    aria-expanded={expanded}
                    className="border-0 bg-transparent d-md-none"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                    >
                        <path
                            fillRule="evenodd"
                            d="M2.5 12.5a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10a.5.5 0 0 1-.5-.5z"
                        />
                    </svg>
                </button>

                <Collapse in={expanded}>
                    <div
                        className="d-md-flex align-items-center justify-content-between w-100 mt-3 mt-md-0"
                        id="basic-navbar-nav"
                    >
                        {/* Navigation */}
                        <Nav className="ms-md-auto flex-column flex-md-row">
                            <Nav.Link as={Link} to="/" className="text-dark me-md-4 mb-2 mb-md-0" style={{ fontWeight: "600", letterSpacing: "0.5px" }}>
                                HOME
                            </Nav.Link>
                            <Nav.Link as={Link} to="/all-cars" className="text-dark me-md-4 mb-2 mb-md-0" style={{ fontWeight: "600", letterSpacing: "0.5px" }}>
                                CARS
                            </Nav.Link>
                            <Nav.Link as={Link} to="/user/profile" className="text-dark me-md-4 mb-2 mb-md-0" style={{ fontWeight: "600", letterSpacing: "0.5px" }}>
                                ACCOUNT
                            </Nav.Link>
                        </Nav>

                        {/* Search */}
                        <Form
                            className="d-flex align-items-center mt-3 mt-md-0 ms-md-3"
                            onSubmit={handleSearch}
                            style={{ borderBottom: '1px solid #ccc', paddingBottom: '4px', maxWidth: '220px' }}
                        >
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search cars..."
                                className="form-control border-0 shadow-none px-1"
                                style={{ fontSize: '14px', backgroundColor: 'transparent' }}
                            />
                            <button type="submit" className="border-0 bg-transparent p-0 ms-2">
                                <FaSearch size={16} className="text-secondary" />
                            </button>
                        </Form>
                    </div>
                </Collapse>
            </Container>
        </Navbar>
    );
}

export default UserHeader;
