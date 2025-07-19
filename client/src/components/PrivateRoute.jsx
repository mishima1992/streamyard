import React from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
    const { currentUser, loading } = useAuth();
    const location = useLocation();
    const authLoginUrl = import.meta.env.VITE_AUTH_LOGIN_URL;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-white">Loading session...</p>
            </div>
        );
    }

    if (!currentUser) {
        const redirectUrl = `${authLoginUrl}?redirect=${location.pathname}`;
        window.location.replace(redirectUrl);
        return null;
    }

    return <Outlet />;
};

export default PrivateRoute;
