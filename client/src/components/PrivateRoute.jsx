import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
    const { currentUser, loading } = useAuth();
    const authLoginUrl = import.meta.env.VITE_AUTH_LOGIN_URL;

    useEffect(() => {
        if (loading) {
            return;
        }
        if (!currentUser) {
            if (authLoginUrl) {
                window.location.replace(authLoginUrl);
            }
        }
    }, [currentUser, loading, authLoginUrl]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-white">Loading...</p>
            </div>
        );
    }

    return currentUser ? <Outlet /> : null;
};

export default PrivateRoute;
