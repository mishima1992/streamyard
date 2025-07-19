import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login: authLogin, currentUser, api } = useAuth();
    const [isAttemptingLogin, setIsAttemptingLogin] = useState(false);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const redirectPath = searchParams.get('redirect');
        if (redirectPath) {
            toast('Please log in to continue.', { icon: '🔒' });
        }

        if (currentUser) {
            const mainDomain = import.meta.env.VITE_MAIN_DOMAIN;
            const targetUrl = `https://${mainDomain}${redirectPath || '/dashboard'}`;
            window.location.replace(targetUrl);
        }
    }, [currentUser, searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setIsAttemptingLogin(true);
        try {
            await authLogin(login, password);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to login. Please try again.';
            toast.error(errorMessage);
            setLoading(false);
            setIsAttemptingLogin(false);
        }
    };

    useEffect(() => {
        if (isAttemptingLogin && currentUser) {
            const generateAndRedirect = async () => {
                try {
                    toast.success('Login successful! Generating secure session...');
                    const { data } = await api.get('/auth/sso/generate');
                    const ssoToken = data.ssoToken;
                    const mainDomain = import.meta.env.VITE_MAIN_DOMAIN;
                    const redirectPath = searchParams.get('redirect') || '/dashboard';
                    
                    const targetUrl = `https://${mainDomain}/sso-login?token=${ssoToken}&redirect=${encodeURIComponent(redirectPath)}`;
                    window.location.replace(targetUrl);
                } catch (error) {
                    toast.error('Failed to create a secure session. Please try again.');
                    setLoading(false);
                    setIsAttemptingLogin(false);
                }
            };
            generateAndRedirect();
        }
    }, [currentUser, isAttemptingLogin, api, searchParams]);

    if (currentUser) {
        return <div className="flex justify-center items-center h-screen"><p className="text-white">Redirecting...</p></div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-white text-center mb-6">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2" htmlFor="login">
                            Username or Email
                        </label>
                        <input
                            type="text"
                            id="login"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-300 mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300 disabled:bg-blue-400"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="text-center text-gray-400 mt-6">
                    Don't have an account? <Link to="/register" className="text-blue-400 hover:underline">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
