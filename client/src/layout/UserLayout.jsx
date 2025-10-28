import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser, saveUser } from '../redux/features/userSlice';
import { AxiosInstance } from '../config/AxiosInstance';
import Header from '../components/user/Header';
import Footer from '../components/user/Footer';
import UserHeader from '../components/user/UserHeader';
import UserFooter from '../components/user/UserFooter';

function UserLayout() {

    const location = useLocation();

    const { isUserAuth } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const checkUser = async () => {
        try {
            const response = await AxiosInstance({
                method: "GET",
                url: "/user/check-user"
            });
            console.log("checkUser Response", response?.data);
            dispatch(saveUser(response?.data));
        } catch (error) {
            console.error("User check failed:", error);
            dispatch(clearUser());
        }
    };

    useEffect(() => {
        const excludeRoutes = ["/signup", "/login"];
        if (!excludeRoutes.includes(location.pathname)) {
            checkUser();
        }
    }, [location.pathname]);

    console.log("isUserAuth:", isUserAuth);

    return (
        <>
            {isUserAuth ? < UserHeader/> : <Header />}
            <Outlet />
            {isUserAuth ? < UserFooter/> : <Footer/>}
        </>
    );
}

export default UserLayout;
