import React from 'react';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
    const { currentUser } = useAuth();

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-bold mb-4">Welcome to the Dashboard, {currentUser.username}!</h1>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <p className="text-lg text-gray-300">This is your personal page. From here you can manage your videos and streams.</p>
                <div className="mt-6 border-t border-gray-700 pt-6">
                    <h3 className="text-2xl font-semibold mb-3">Account Details</h3>
                    <ul className="list-disc list-inside text-gray-400">
                        <li><strong>User ID:</strong> {currentUser._id}</li>
                        <li><strong>Email:</strong> {currentUser.email}</li>
                        <li><strong>Role:</strong> {currentUser.role}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
