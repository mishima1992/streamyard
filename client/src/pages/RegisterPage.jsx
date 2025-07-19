import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register, currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            const mainDomain = import.meta.env.VITE_MAIN_DOMAIN;
            const targetUrl = `https://${mainDomain}/dashboard`;
            window.location.replace(targetUrl);
        }
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error('Passwords do not match!');
        }
        if (!agreed) {
            return toast.error('You must agree to the Terms of Service and Privacy Policy.');
        }
        setLoading(true);
        try {
            const { data } = await register(username, email, password);
            toast.success(data.message, { duration: 6000 });
            navigate('/login');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to register. Please try again.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (currentUser) {
        return <div className="flex justify-center items-center h-screen"><p className="text-white">Redirecting...</p></div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-white text-center mb-6">Create a New Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2" htmlFor="username">Username</label>
                        <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2" htmlFor="email">Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2" htmlFor="password">Password</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2" htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500" required />
                    </div>
                    <div className="mb-6">
                        <label className="flex items-center text-gray-400">
                            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="form-checkbox h-5 w-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500" />
                            <span className="ml-2">
                                I agree to the <Link to="/terms" className="text-blue-400 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link>.
                            </span>
                        </label>
                    </div>
                    <button type="submit" disabled={loading || !agreed} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed">
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p className="text-center text-gray-400 mt-6">
                    Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
