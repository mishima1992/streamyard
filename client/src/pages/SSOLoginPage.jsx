import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const SSOLoginPage = () => {
    const [searchParams] = useSearchParams();
    const effectRan = useRef(false);

    useEffect(() => {
        if (effectRan.current === true) return;

        const verifyToken = async () => {
            const token = searchParams.get('token');
            const redirectPath = searchParams.get('redirect');
            const authLoginUrl = import.meta.env.VITE_AUTH_LOGIN_URL || '/';
            
            if (!token) {
                window.location.replace(authLoginUrl);
                return;
            }

            try {
                const { data } = await axios.post('/api/auth/sso/verify', { ssoToken: token });
                localStorage.setItem('userInfo', JSON.stringify(data));
                
                window.location.replace(redirectPath || '/dashboard');
            } catch (error) {
                window.location.replace(authLoginUrl);
            }
        };

        verifyToken();

        return () => {
            effectRan.current = true;
        };
    }, [searchParams]);

    return (
        <div className="flex justify-center items-center h-screen">
            <p className="text-white text-xl">Finalizing secure session, please wait...</p>
        </div>
    );
};

export default SSOLoginPage;
