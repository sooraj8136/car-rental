// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { AxiosInstance } from "../../config/AxiosInstance";

// const PendingRequests = () => {
//     const [bookings, setBookings] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const fetchPendingRequests = async () => {
//         try {
//             const res = await AxiosInstance.get("/owner/pending-requests");
//             setBookings(res.data.bookings);
//         } catch (err) {
//             console.error("❌ Error fetching pending requests:", err);
//             toast.error("Failed to load pending requests");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchPendingRequests();
//     }, []);

//     return (
//         <div className="p-4">
//             <h2 className="text-xl font-semibold mb-4">Pending Booking Requests</h2>

//             {loading ? (
//                 <p>Loading...</p>
//             ) : bookings.length === 0 ? (
//                 <p>No pending requests.</p>
//             ) : (
//                 <ul className="space-y-4">
//                     {bookings.map((booking, index) => (
//                         <li key={booking._id || index} className="border p-4 rounded shadow-sm bg-white">
//                             <p><strong>Booking ID:</strong> {booking._id}</p>
//                             <p><strong>User ID:</strong> {booking.userId}</p>

//                             {/* Car Image and Model */}
//                             <div className="flex items-center gap-4 mb-2">
//                                 <img
//                                     src={booking.carId?.images}
//                                     alt={booking.carId?.model || "Car Image"}
//                                     className="w-28 h-20 object-cover rounded"
//                                     onError={(e) => e.target.src = "/placeholder.png"}
//                                 />
//                                 <div>
//                                     <p><strong>Car Model:</strong> {booking.carId?.model || "N/A"}</p>
//                                 </div>
//                             </div>

//                             <p><strong>From:</strong> {booking.pickupDate ? new Date(booking.pickupDate).toLocaleDateString() : "N/A"}</p>
//                             <p><strong>To:</strong> {booking.dropoffDate ? new Date(booking.dropoffDate).toLocaleDateString() : "N/A"}</p>
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// };

// export default PendingRequests;

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AxiosInstance } from "../../config/AxiosInstance";
import { useNavigate } from "react-router-dom";

const PendingRequests = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPendingRequests = async () => {
    try {
      const res = await AxiosInstance.get("/owner/pending-requests");
      const validBookings = (res.data.bookings || []).filter(b => b.bookingId);
      setBookings(validBookings);
    } catch (err) {
      console.error("❌ Error fetching pending requests:", err);
      toast.error("Failed to load pending requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (requestId, isApproved) => {
    try {
      const res = await AxiosInstance.post(`/owner/confirm/${requestId}`, { isApproved });
      toast.success(res.data.message);
      fetchPendingRequests();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to confirm booking");
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  return (
    <div className="p-4">

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : bookings.length === 0 ? (
        <div className="text-center mt-5">
          <p className="text-muted" style={{ fontWeight: "bold", fontSize: "18px", marginTop:"100px" }}>
            We're sorry! No pending requests.
          </p>
          <button
            className="btn btn-dark mt-3"
            style={{borderRadius:"0px",  width: "200px" }}
            onClick={() => navigate("/owner/owner-dashboard")}
          >
            Back
          </button>
        </div>
      ) : (
        <ul className="space-y-4">
          {bookings.map((request, index) => {
            const booking = request.bookingId;
            return (
              <li
                key={request._id || index}
                className="border p-4 rounded shadow-sm bg-white text-center"
              >
                <p><strong>Booking ID:</strong> {booking._id}</p>
                <p><strong>User:</strong> {booking.userId?.name || "N/A"}</p>

                {/* Car Image and Model */}
                <div className="flex flex-col items-center gap-2 mb-2 mt-2">
                  <img
                    src={booking.carId?.images?.[0] || "/placeholder.png"}
                    alt={booking.carId?.model || "Car Image"}
                    className="w-28 h-20 object-cover rounded"
                  />
                  <p><strong>Car Model:</strong> {booking.carId?.model || "N/A"}</p>
                </div>

                <p><strong>From:</strong> {booking.pickupDate ? new Date(booking.pickupDate).toLocaleDateString() : "N/A"}</p>
                <p><strong>To:</strong> {booking.dropoffDate ? new Date(booking.dropoffDate).toLocaleDateString() : "N/A"}</p>

                <div className="mt-3 flex justify-center gap-2">
                  <button
                    onClick={() => handleApproval(request._id, true)}
                    className="btn btn-success btn-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(request._id, false)}
                    className="btn btn-danger btn-sm"
                  >
                    Decline
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default PendingRequests;
