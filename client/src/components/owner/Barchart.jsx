import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, } from "chart.js";
import { useEffect, useState } from "react";
import { AxiosInstance } from "../../config/AxiosInstance";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Barchart = () => {
    const [chart, setChart] = useState(null);
    const [isDataAvailable, setIsDataAvailable] = useState(true);

    useEffect(() => {
        const fetchBookingData = async () => {
            try {
                const response = await AxiosInstance.get("/booking/get-owner-booking");
                const bookings = response?.data?.data;

                console.log("📦 Owner Bookings:", bookings);

                if (bookings && bookings.length > 0) {
                    // Group by date and sum rental price
                    const dateMap = {};

                    bookings.forEach((booking) => {
                        const date = new Date(booking.createdAt).toLocaleDateString();
                        const price = booking.carId?.rentalPricePerDay || 0;

                        if (dateMap[date]) {
                            dateMap[date] += price;
                        } else {
                            dateMap[date] = price;
                        }
                    });

                    const labels = Object.keys(dateMap);
                    const values = Object.values(dateMap);

                    setChart({
                        labels,
                        datasets: [
                            {
                                label: "Total Revenue",
                                data: values,
                                borderColor: "#1e2f49ff",
                                backgroundColor: "rgba(20, 41, 73, 0.7)",
                                borderWidth: 1,
                            },
                        ],
                    });

                    setIsDataAvailable(true);
                } else {
                    setIsDataAvailable(false);
                }
            } catch (error) {
                console.error("Error fetching owner booking data:", error);
                setIsDataAvailable(false);
            }
        };

        fetchBookingData();
    }, []);

    return (
        <div
            style={{
                backgroundColor: "#fff",
                color: "#000",
                padding: "20px",
                borderRadius: "10px",
            }}
        >
            <div className="container d-flex justify-content-start align-items-start heading-head">
                <p style={{ fontSize: "15px", fontWeight: "500" }}>
                    REVENUE ANALYSIS & BOOKING STATISTICS
                </p>
            </div>

            {isDataAvailable ? (
                chart ? (
                    <Bar
                        data={chart}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    labels: {
                                        color: "#000",
                                    },
                                },
                                title: {
                                    display: true,
                                    text: "Owner Booking Revenue",
                                    color: "#000",
                                },
                                tooltip: {
                                    backgroundColor: "#000",
                                    titleColor: "#fff",
                                    bodyColor: "#fff",
                                },
                            },
                            scales: {
                                x: {
                                    ticks: { color: "#000" },
                                    grid: { color: "rgba(0, 0, 0, 0.1)" },
                                },
                                y: {
                                    ticks: { color: "#000" },
                                    grid: { color: "rgba(0, 0, 0, 0.1)" },
                                    beginAtZero: true,
                                },
                            },
                        }}
                    />
                ) : null
            ) : (
                <p
                    style={{
                        color: "#000",
                        textAlign: "center",
                        fontSize: "18px",
                    }}
                >
                    NO BOOKINGS AVAILABLE YET!
                </p>
            )}
        </div>
    );
};

export default Barchart;
