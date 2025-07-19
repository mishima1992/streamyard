import React, { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const SSOLoginPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setCurrentUser } = useAuth();
    const effectRan = useRef(false);

    useEffect(() => {
        if (effectRan.current === true) return;

        const verifyToken = async () => {
            const token = searchParams.get('token');
            if (!token) {
                navigate('/login', { replace: true });
                return;
            }

            try {
                const { data } = await axios.post('/api/auth/sso/verify', { ssoToken: token });
                localStorage.setItem('userInfo', JSON.stringify(data));
                setCurrentUser(data);
                navigate('/dashboard', { replace: true });
            } catch (error) {
                navigate('/login', { replace: true });
            }
        };

        verifyToken();

        return () => {
            effectRan.current = true;
        };
    }, [searchParams, navigate, setCurrentUser]);

    return (
        <div className="flex justify-center items-center h-screen">
            <p className="text-white text-xl">Finalizing secure session, please wait...</p>
        </div>
    );
};

export default SSOLoginPage;
