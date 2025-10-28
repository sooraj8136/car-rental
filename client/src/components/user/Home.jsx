import React, { useState } from "react";
import CarSearchBar from "./CarSearchbar";
import AllCars from "./AllCars";

const Home = () => {
  const [cars, setCars] = useState([]);
  const [hasSearched, setHasSearched] = useState(false); // 👈 track if user searched

  const handleSearchResults = (results) => {
    setCars(results);
    setHasSearched(true);
  };

  return (
    <>
    
    <div className="container " style={{ marginTop:"100px" }}>
      <h2 className="text-center anton-regular" style={{letterSpacing: "4px"}}>LUXURY  IN  MOTION</h2>
      <CarSearchBar onSearchResults={handleSearchResults} />

      <div className="mt-4">
        {!hasSearched ? (
          <p className="text-muted"></p>
        ) : cars.length === 0 ? (
          <p>No cars found.</p>
        ) : (
          <div className="row">
            {cars.map((car) => (
              <div key={car._id} className="col-md-4 mb-3">
                <div className="card h-100 shadow-sm">
                  <img
                    src={car.images?.[0] || "/no-image.jpg"}
                    className="card-img-top"
                    alt={car.model}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {car.brand} {car.model}
                    </h5>
                    <p className="card-text">
                      {car.year} • {car.fuelType} • {car.transmission} <br />
                      Seats: {car.seats} <br />
                      ₹{car.rentalPricePerDay}/day
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    <AllCars/>
    </>
  );
};

export default Home;
