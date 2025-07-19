import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LogoutPage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const effectRan = useRef(false);

    useEffect(() => {
        if (effectRan.current === true) return;

        logout();
        navigate('/login', { replace: true });

        return () => {
            effectRan.current = true;
        };
    }, [logout, navigate]);

    return (
        <div className="flex justify-center items-center h-screen">
            <p className="text-white text-xl">Logging you out, please wait...</p>
        </div>
    );
};

export default LogoutPage;
