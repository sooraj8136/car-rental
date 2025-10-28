import React from 'react';

function Porsche() {
  const cars = [
    {
      name: "Porsche 911 Carrera S",
      image:
        "https://content-hub.imgix.net/mNmLOXtzTsZMl4xYdNhWY/72985f596adf578a51e6ad30ccb26535/taycan_wallpapers_hero_desktop.jpg?w=2064",
      description:
        "The iconic 911 Carrera S offers unmatched performance and precision handling. Perfect for those seeking an exhilarating drive.",
      rentalInfo: "Rent starting at $250/day. Available for city trips, weekend getaways, or long drives.",
    },
    {
      name: "Porsche Taycan",
      image:
        "https://wallpapers.com/images/hd/porsche-911-gt3-black-sports-cars-xupnur0z4wd2u8nj.jpg",
      description:
        "The all-electric Taycan combines eco-friendly innovation with the classic Porsche performance. Smooth, fast, and luxurious.",
      rentalInfo: "Rent starting at $300/day. Ideal for a stylish and sustainable drive.",
    },
    {
      name: "Porsche Panamera",
      image:
        "https://w0.peakpx.com/wallpaper/542/149/HD-wallpaper-porsche-porsche-taycan-4s-black-car-car-electric-car-luxury-car-sedan.jpg",
      description:
        "Luxury meets power in the Panamera. Spacious, elegant, and equipped with advanced tech for a superior driving experience.",
      rentalInfo: "Rent starting at $280/day. Great for business trips or family drives.",
    },
    {
      name: "Porsche Cayman",
      image:
        "https://images.euronews.com/articles/stories/09/47/73/38/1536x864_cmsv2_98bdd3ae-b24c-5dc8-854b-d35dbfb9b903-9477338.jpg",
      description:
        "The Cayman offers sporty dynamics with precision handling and a sleek design. Perfect for weekend fun or road trips.",
      rentalInfo: "Rent starting at $230/day. Perfect for a thrilling short-term rental.",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#111",
        color: "#fff",
        padding: "50px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", fontSize: "3rem", marginBottom: "50px", letterSpacing: "2px" }}>
        Porsche Rental Showcase
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "60px",
          alignItems: "center",
        }}
      >
        {cars.map((car, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: index % 2 === 0 ? "row" : "row-reverse",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "40px",
              maxWidth: "1200px",
              width: "100%",
            }}
          >
            {/* Car Image */}
            <div style={{ flex: "1 1 400px", textAlign: "center" }}>
              <img
                src={car.image}
                alt={car.name}
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.7)",
                }}
              />
            </div>

            {/* Car Description */}
            <div style={{ flex: "1 1 400px", maxWidth: "600px" }}>
              <h2 style={{ fontSize: "2rem", marginBottom: "15px" }}>{car.name}</h2>
              <p style={{ lineHeight: "1.6", fontSize: "1.1rem", marginBottom: "10px" }}>
                {car.description}
              </p>
              <p style={{ lineHeight: "1.6", fontSize: "1rem", fontWeight: "600" }}>
                {car.rentalInfo}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Porsche;
