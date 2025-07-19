import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const ProfilePage = () => {
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    const fetchChannels = useCallback(async () => {
        const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
        if (!token) return;

        try {
            setLoading(true);
            const { data } = await axios.get('/api/youtube/channels', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setChannels(data);
        } catch (error) {
            toast.error('Could not fetch linked channels.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (currentUser) {
            fetchChannels();
        }
    }, [fetchChannels, currentUser]);

    const handleLinkChannel = async () => {
        const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
        if (!token) {
            toast.error('You must be logged in to link a channel.');
            return;
        }

        try {
            const authDomain = import.meta.env.VITE_AUTH_DOMAIN;
            const fullAuthUrl = `https://${authDomain}/api/youtube/auth-url`;
            
            const { data } = await axios.get(fullAuthUrl, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            window.location.href = data.url;
        } catch (error) {
            toast.error('Could not start the linking process.');
        }
    };

    const handleUnlinkChannel = async (channelId) => {
        const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
        if (!token) return;

        if (window.confirm('Are you sure you want to unlink this channel?')) {
            try {
                await axios.delete(`/api/youtube/channels/${channelId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Channel unlinked successfully.');
                fetchChannels();
            } catch (error) {
                toast.error('Failed to unlink channel.');
            }
        }
    };

    if (!currentUser) {
        return <div className="text-center p-8">Loading profile...</div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-4xl font-bold text-white mb-8">Your Profile</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-center">
                        <div className="relative w-32 h-32 mx-auto">
                            <img src={currentUser.avatar?.startsWith('/') ? currentUser.avatar : 'https://placehold.co/200x200/EFEFEF/333333?text=User'} alt={currentUser.username} className="w-32 h-32 rounded-full mx-auto border-4 border-blue-500" />
                            <button onClick={() => {}} className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 rounded-full p-2 text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                        <h2 className="text-2xl font-bold text-white mt-4">{currentUser.username}</h2>
                        <p className="text-gray-400">{currentUser.email}</p>
                        <button onClick={() => {}} className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                            Change Password
                        </button>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                        <h3 className="text-xl font-semibold text-white mb-4">Subscription Details</h3>
                        <div className="space-y-3 text-gray-300">
                            <p><strong>Plan:</strong> <span className="capitalize font-medium text-green-400">{currentUser.subscription?.plan || 'N/A'}</span></p>
                            <p><strong>Storage:</strong> N/A / N/A</p>
                            <p><strong>Max Bitrate:</strong> {(currentUser.subscription?.maxBitrateKbps || 0) / 1000} Mbps</p>
                            <p><strong>Status:</strong> <span className="text-green-400">Active</span></p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-semibold text-white">Linked YouTube Channels</h3>
                            <button onClick={handleLinkChannel} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                                Link New Channel
                            </button>
                        </div>
                        {loading ? <p className="text-gray-400">Loading channels...</p> : (
                            <div className="space-y-4">
                                {channels.length > 0 ? (
                                    channels.map(channel => (
                                        <div key={channel.channelId} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                                            <span className="font-medium text-white">{channel.channelName}</span>
                                            <button onClick={() => handleUnlinkChannel(channel.channelId)} className="text-red-400 hover:text-red-300 font-semibold">Unlink</button>
                                        </div>
                                    ))
                                ) : <p className="text-gray-400 text-center py-4">You haven't linked any YouTube channels yet.</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
