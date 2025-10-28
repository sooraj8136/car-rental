import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AxiosInstance } from '../config/AxiosInstance';
import Header from '../components/user/Header';
import Footer from '../components/user/Footer';
import OwnerHeader from '../components/owner/OwnerHeader';
import OwnerFooter from '../components/owner/OwnerFooter';
import { clearOwner, saveOwner } from '../redux/features/ownerSlice';

const OwnerLayout = () => {

    const location = useLocation();

    const dispatch = useDispatch();
    const { isOwnerAuth } = useSelector((state) => state.owner);

    const checkOwner = async () => {
        try {
            const response = await AxiosInstance.get('/owner/check-owner');
            console.log("✅ Owner check success:", response.data);
            dispatch(saveOwner(response.data));
        } catch (error) {
            console.error("Owner check failed:", error);
            dispatch(clearOwner());
        }
    };

    useEffect(() => {
        const excludeRoutes = ["/owner/login", "/owner/signup"];
        if (!excludeRoutes.includes(location.pathname)) {
            checkOwner();
        }
    }, [location.pathname]);

    return (
        <>
            {isOwnerAuth ? <OwnerHeader /> : <Header />}
            <Outlet />
            {isOwnerAuth ? <OwnerFooter /> : <Footer />}
        </>
    );
};

export default OwnerLayout;
