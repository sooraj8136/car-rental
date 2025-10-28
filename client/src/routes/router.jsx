import { createBrowserRouter } from "react-router-dom";
import UserLayout from "../layout/UserLayout";
import Home from "../components/user/Home";
import About from "../components/user/About";
import UserLogin from "../pages/user/UserLogin";
import UserSignup from "../pages/user/UserSignup";
import UserProfile from "../pages/user/UserProfile";
import UpdateProfile from "../pages/user/UpdateProfile";
import ErrorPage from "../pages/shared/ErrorPage";
import GetAllCars from "../pages/user/GetAllCars";
import CarDetailsPage from "../pages/user/CarDetailsPage";
import BookingPayment from "../pages/user/BookingPayment";
import BookingSuccess from "../pages/user/BookingSuccess";
import BookingCancelled from "../pages/user/BookingCancelled";
import UserAllBooking from "../pages/user/UserAllBooking";
import OwnerLayout from "../layout/OwnerLayout";
import ProtectedRoute from "./ProtectedRoute";
import OwnerLogin from "../pages/owner/OwnerLogin";
import ProtectedRouteOwner from "./ProtectedRouteOwner";
import OwnerProfile from "../pages/owner/OwnerProfile";
import UpdateOwnerProfile from "../pages/owner/UpdateOwnerProfile";
import OwnerChangePassword from "../pages/owner/OwnerChangePassword";
import OwnerDashboard from "../pages/owner/OwnerDashboard";
import OwnerSignup from "../pages/owner/OwnerSignup";
import OwnerCars from "../pages/owner/OwnerCars";
import OwnerCarDetails from "../pages/owner/OwnerCarDetails";
import UpdateCarForm from "../pages/owner/UpdateCarForm";
import PendingRequests from "../pages/owner/PendingRequests";
import Porsche from "../pages/user/porshe";
import CreateCar from "../pages/owner/Createcar";
export const router = createBrowserRouter([
    {
        path: '/',
        element: <UserLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '',
                element: <Home />,
            },
            {
                path: 'about',
                element: <About />,
            },
            {
                path: 'login',
                element: <UserLogin />,
            },
            {
                path: 'signup',
                element: <UserSignup />,
            },
            {
                path: 'all-cars',
                element: <GetAllCars />,
            },
            {
                path: 'car-details/:id',
                element: <CarDetailsPage />,
            },
            {
                path: 'porsche-des',
                element: <Porsche />,
            },
            {
                element: <ProtectedRoute />,
                path: 'user',
                children: [
                    {
                        path: 'profile',
                        element: <UserProfile />,
                    },
                    {
                        path: 'update-profile',
                        element: <UpdateProfile />,
                    },
                    {
                        path: 'booking-payment/:bookingId',
                        element: <BookingPayment />,
                    },
                    {
                        path: 'payment-success',
                        element: <BookingSuccess />,
                    },
                    {
                        path: 'payment-cancelled',
                        element: <BookingCancelled />,
                    },
                    {
                        path: 'user-bookings',
                        element: <UserAllBooking />,
                    },
                ]
            },
        ]
    },
    {
        path: 'owner',
        element: <OwnerLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: 'login',
                element: <OwnerLogin />,
            },
            {
                path: 'signup',
                element: <OwnerSignup />,
            },
            {
                element: <ProtectedRouteOwner />,
                path: '',
                children:[
                    {
                        path: "profile",
                        element: <OwnerProfile/>
                    },
                    {
                        path: "update-profile",
                        element: <UpdateOwnerProfile/>
                    },
                    {
                        path: "change-password",
                        element: <OwnerChangePassword/>
                    },
                    {
                        path: "owner-dashboard",
                        element: <OwnerDashboard/>
                    },
                    {
                        path: "owner-cars",
                        element: <OwnerCars/>
                    },
                    {
                        path: "car-details/:id",
                        element: <OwnerCarDetails/>
                    },
                    {
                        path: "update-car/:id",
                        element: <UpdateCarForm/>
                    },
                    {
                        path: "pending-req",
                        element: <PendingRequests/>
                    },
                    {
                        path: "create-car",
                        element: <CreateCar/>
                    },
                ]
            }
        ]
    }
]);

