import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Header = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success('You have been logged out.');
        navigate('/login');
    };

    return (
        <header className="bg-gray-800 text-white shadow-md">
            <div className="container mx-auto flex items-center justify-between p-4">
                <Link to="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300">
                    StreamYard
                </Link>
                <nav className="flex items-center space-x-6">
                    {currentUser ? (
                        <>
                            <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
                            <Link to="/videos" className="hover:text-gray-300">Videos</Link>
                            <span className="text-gray-400">|</span>
                            <div className="flex items-center space-x-4">
                                <img src={currentUser.avatar} alt={currentUser.username} className="w-8 h-8 rounded-full" />
                                <span className="font-medium">{currentUser.username}</span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-gray-300">Login</Link>
                            <Link to="/register" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
                                Register
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
