import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

function ProtectedRouteOwner() {
    const { isOwnerAuth } = useSelector((state) => state.owner);
    const navigate = useNavigate();

    if (!isOwnerAuth) {
        navigate("/owner/login");
        return
    }
    return (
        <Outlet />
  )
}

export default ProtectedRouteOwner;
