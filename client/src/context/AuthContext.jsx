import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const api = axios.create({
        baseURL: '/api'
    });

    api.interceptors.request.use((config) => {
        try {
            const user = JSON.parse(localStorage.getItem('userInfo'));
            if (user && user.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        } catch (e) {
            console.error("Could not parse user info for API interceptor", e);
        }
        return config;
    });
    
    const register = (username, email, password) => {
        return api.post('/auth/register', { username, email, password });
    };

    const login = async (login, password) => {
        const { data } = await api.post('/auth/login', { login, password });
        if (data) {
            localStorage.setItem('userInfo', JSON.stringify(data));
            setCurrentUser(data);
        }
        return data;
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setCurrentUser(null);
        const authLoginUrl = import.meta.env.VITE_AUTH_LOGIN_URL;
        if (authLoginUrl) {
            window.location.replace(authLoginUrl);
        }
    };

    const updateAuthInfo = (newUserInfo) => {
        const storedInfo = JSON.parse(localStorage.getItem('userInfo'));
        const updatedInfo = { ...storedInfo, ...newUserInfo };
        localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
        setCurrentUser(updatedInfo);
    };

    useEffect(() => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (userInfo) {
                setCurrentUser(userInfo);
            }
        } catch (error) {
            console.error("Could not parse user info from localStorage", error);
            localStorage.removeItem('userInfo');
        }
        setLoading(false);
    }, []);


    const value = {
        currentUser,
        setCurrentUser,
        loading,
        register,
        login,
        logout,
        api,
        updateAuthInfo,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
