// import React, { useState } from "react";
// import { Form, Row, Col } from "react-bootstrap";
// import { AxiosInstance } from "../../config/AxiosInstance";
// import { Link } from "react-router-dom";

// const CarSearchBar = () => {
//   const [filters, setFilters] = useState({
//     query: "",
//     year: "",
//     fuelType: "Any",
//     category: "Any",
//     transmission: "Any",
//     seats: "",
//     pickupDate: "",
//     dropoffDate: "",
//   });

//   const [cars, setCars] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searched, setSearched] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFilters({ ...filters, [name]: value });
//   };

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     setSearched(true);

//     const params = new URLSearchParams();
//     Object.keys(filters).forEach((key) => {
//       if (filters[key] && filters[key] !== "Any") {
//         params.append(key, filters[key]);
//       }
//     });

//     try {
//       setLoading(true);
//       const res = await AxiosInstance.get(`/car/search?${params.toString()}`);
//       setCars(res.data);
//     } catch (err) {
//       console.error("Failed to fetch cars", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           marginTop: "60px",
//           padding: "40px 60px",
//         }}
//       >
//         {/* LEFT TEXT CONTENT */}
//         <div style={{ flex: 1, maxWidth: "50%" }}>
//           <h2
//             style={{
//               fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
//               fontWeight: "bold",
//               marginBottom: "1rem",
//             }}
//           >
//             Rent Premium Cars <br /> easy and fast
//           </h2>
//           <p
//             style={{
//               fontSize: "1rem",
//               lineHeight: "1.6",
//               marginBottom: "1.5rem",
//             }}
//           >
//             Lorem ipsum dolor sit amet consectetur. Sed at viverra pellentesque
//             ullamcorper rhoncus volutpat lacus egestas. Amet tortor vitae scelerisque
//             sed ac non molestie nulla. Suspendisse quam penatibus odio massa tortor
//             ornare purus suspendisse.
//           </p>
//           <a
//             href="#"
//             style={{
//               fontWeight: "600",
//               textDecoration: "none",
//               color: "black",
//               display: "inline-flex",
//               alignItems: "center",
//               gap: "6px",
//             }}
//           >
//             See more →
//           </a>
//         </div>

//         {/* RIGHT IMAGE SECTION */}
//         <div
//           style={{
//             flex: 1,
//             display: "flex",
//             justifyContent: "center",
//             position: "relative",
//           }}
//         >
//           <div
//             style={{
//               backgroundColor: "#f97316", // orange background stays
//               borderRadius: "12px",
//               padding: "20px",
//               display: "inline-block",
//             }}
//           >
//             <img
//               src="/Dodge-Challenger-Transparent-File.png"
//               alt="Car Rental Banner"
//               style={{ width: "100%", maxWidth: "450px", height: "auto" }}
//             />
//           </div>
//         </div>
//       </div>


//       <div className="car-search-wrapper">
//         {/* 🔍 Filter Search Form (kept as-is) */}
//         <Form
//           onSubmit={handleSearch}
//           className="p-4 rounded shadow"
//           style={{ marginBottom: "150px" }}
//         >
//           <Row className="g-2 align-items-center">
//             <Col md={4}>
//               <Form.Control
//                 type="text"
//                 placeholder="Search by brand, model, etc."
//                 name="query"
//                 value={filters.query}
//                 onChange={handleChange}
//               />
//             </Col>
//             <Col md={2}>
//               <Form.Control
//                 type="number"
//                 placeholder="Year"
//                 name="year"
//                 value={filters.year}
//                 onChange={handleChange}
//               />
//             </Col>
//             <Col md={2}>
//               <Form.Select
//                 name="fuelType"
//                 value={filters.fuelType}
//                 onChange={handleChange}
//               >
//                 <option value="Any">Fuel Type</option>
//                 <option value="Petrol">Petrol</option>
//                 <option value="Diesel">Diesel</option>
//                 <option value="Electric">Electric</option>
//               </Form.Select>
//             </Col>
//             <Col md={2}>
//               <Form.Select
//                 name="category"
//                 value={filters.category}
//                 onChange={handleChange}
//               >
//                 <option value="Any">Category</option>
//                 <option value="SUV">SUV</option>
//                 <option value="Sedan">Sedan</option>
//                 <option value="Hatchback">Hatchback</option>
//               </Form.Select>
//             </Col>
//             <Col md={2}>
//               <button
//                 type="submit"
//                 style={{
//                   fontWeight: "600",
//                   letterSpacing: "0.5px",
//                   width: "100%",
//                   height: "5vh",
//                   border: "0px",
//                   borderRadius: "20px",
//                   backgroundColor: "black",
//                   border: "1px solid white",
//                   color: "white",
//                 }}
//               >
//                 Search Cars
//               </button>
//             </Col>
//           </Row>
//         </Form>

//         {/* 🔽 Search Results (only after search) */}
//         {searched && (
//           <div className="container mt-4">
//             <h2 style={{ color: "white", textAlign: "center" }}>Search Results</h2>
//             {loading ? (
//               <p style={{ color: "white", textAlign: "center" }}>Loading cars...</p>
//             ) : cars.length === 0 ? (
//               <p style={{ color: "white", textAlign: "center" }}>Oops! No cars found</p>
//             ) : (
//               <div className="row">
//                 {cars.map((car) => (
//                   <div key={car._id} className="col-md-4 mb-3">
//                     <div className="card shadow-sm">
//                       <img
//                         src={car.images?.[0]}
//                         alt={car.model}
//                         className="card-img-top"
//                         style={{ objectFit: "cover", height: "200px" }}
//                       />
//                       <div className="card-body">
//                         <h5>
//                           {car.brand} {car.model}
//                         </h5>
//                         <p>
//                           {car.year} • {car.fuelType} • {car.transmission}
//                         </p>
//                         <Link
//                           to={`/car-details/${car._id}`}
//                           className="btn btn-sm btn-outline-dark mt-2"
//                           style={{ borderRadius: "20px", fontWeight: "500" }}
//                         >
//                           View Details
//                         </Link>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default CarSearchBar;


import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { AxiosInstance } from "../../config/AxiosInstance";
import { Link } from "react-router-dom";

const CarSearchBar = () => {
  const [filters, setFilters] = useState({
    query: "",
    year: "",
    fuelType: "Any",
    category: "Any",
    transmission: "Any",
    seats: "",
    pickupDate: "",
    dropoffDate: "",
  });

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearched(true);

    const params = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key] && filters[key] !== "Any") {
        params.append(key, filters[key]);
      }
    });

    try {
      setLoading(true);
      const res = await AxiosInstance.get(`/car/search?${params.toString()}`);
      setCars(res.data);
    } catch (err) {
      console.error("Failed to fetch cars", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section with Background */}
      <div
        style={{
          backgroundImage:
            "url('https://content-hub.imgix.net/mNmLOXtzTsZMl4xYdNhWY/72985f596adf578a51e6ad30ccb26535/taycan_wallpapers_hero_desktop.jpg?w=2064')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
          paddingTop: "60px",
          paddingBottom: "100px",
        }}
      >
        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1,
          }}
        ></div>

        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "40px 60px",
            flexWrap: "wrap",
          }}
        >
          {/* LEFT TEXT CONTENT */}
          <div
            style={{
              flex: 1,
              maxWidth: "50%",
              color: "white",
              marginBottom: "20px",
            }}
          >
            <h2
              className="text-font"
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                // fontWeight: "bold",
                marginBottom: "1rem",
                letterSpacing: "4px"
              }}
            >
              Rent Premium Cars <br /> Easy and Fast
            </h2>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: "1.6",
                marginBottom: "1.5rem",
              }}
            >
              "Drive your dream car effortlessly. Our platform lets you browse, compare, and rent premium cars instantly, with real-time availability, flexible booking, and seamless online payments. Experience convenience, speed, and style—whether it’s a weekend getaway, business trip, or city ride."
            </p>
            <a
              href="porsche-des"
              style={{
                fontWeight: "600",
                textDecoration: "none",
                color: "white",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              See more →
            </a>
          </div>

          {/* RIGHT IMAGE SECTION */}
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                backgroundColor: "#f97316",
                borderRadius: "12px",
                padding: "20px",
                display: "inline-block",
              }}
            >
              <img
                src="/Dodge-Challenger-Transparent-File.png"
                alt="Car Banner"
                style={{ width: "100%", maxWidth: "450px", height: "auto" }}
              />
            </div>
          </div>
        </div>

        {/* 🔍 Search Form Section */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            marginTop: "40px",
            padding: "0 60px",
          }}
        >
          <Form
            onSubmit={handleSearch}
            className="p-4 shadow"
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(8px)",
              borderRadius: "12px",
            }}
          >
            <Row className="g-2 align-items-center">
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Search by brand, model, etc."
                  name="query"
                  value={filters.query}
                  onChange={handleChange}
                  style={{ borderRadius: "0px" }}
                />
              </Col>
              <Col md={2}>
                <Form.Control
                  type="number"
                  placeholder="Year"
                  name="year"
                  value={filters.year}
                  onChange={handleChange}
                  style={{ borderRadius: "0px" }}
                />
              </Col>
              <Col md={2}>
                <Form.Select
                  name="fuelType"
                  value={filters.fuelType}
                  onChange={handleChange}
                  style={{ borderRadius: "0px" }}
                >
                  <option value="Any">Fuel Type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Select
                  name="category"
                  value={filters.category}
                  onChange={handleChange}
                  style={{ borderRadius: "0px" }}
                >
                  <option value="Any">Category</option>
                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Sports">Sports</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <button
                  type="submit"
                  style={{
                    fontWeight: "600",
                    letterSpacing: "0.5px",
                    width: "100%",
                    height: "5vh",
                    borderRadius: "20px",
                    backgroundColor: "black",
                    color: "white",
                    border: "0px",
                  }}
                >
                  Search Cars
                </button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>

      {/* 🔽 Search Results */}
      {searched && (
        <div className="container mt-4">
          <h2 style={{ color: "black", textAlign: "center" }}>Search Results</h2>
          {loading ? (
            <p style={{ color: "black", textAlign: "center" }}>Loading cars...</p>
          ) : cars.length === 0 ? (
            <p style={{ color: "black", textAlign: "center" }}>Oops! No cars found</p>
          ) : (
            <div className="row">
              {cars.map((car) => (
                <div key={car._id} className="col-md-4 mb-3">
                  <div
                    className="card shadow-sm"
                    style={{
                      borderRadius: "12px",
                      overflow: "hidden",
                      backdropFilter: "blur(5px)",
                    }}
                  >
                    <img
                      src={car.images?.[0]}
                      alt={car.model}
                      className="card-img-top"
                      style={{ objectFit: "cover", height: "200px" }}
                    />
                    <div
                      className="card-body"
                      style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                    >
                      <h5>{car.brand} {car.model}</h5>
                      <p>
                        {car.year} • {car.fuelType} • {car.transmission}
                      </p>
                      <Link
                        to={`/car-details/${car._id}`}
                        className="btn btn-sm btn-outline-dark mt-2"
                        style={{ borderRadius: "20px", fontWeight: "500" }}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CarSearchBar;
