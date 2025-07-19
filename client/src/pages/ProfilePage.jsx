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
        fetchChannels();
    }, [fetchChannels]);

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
            
            window.open(data.url, '_blank', 'noopener,noreferrer,width=600,height=700');
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

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-4xl font-bold text-white mb-8">Your Profile</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-center">
                        <img src={currentUser.avatar} alt={currentUser.username} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500" />
                        <h2 className="text-2xl font-bold text-white">{currentUser.username}</h2>
                        <p className="text-gray-400">{currentUser.email}</p>
                        <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                            Change Avatar
                        </button>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-semibold text-white">Linked YouTube Channels</h3>
                            <button 
                                onClick={handleLinkChannel}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                            >
                                Link New Channel
                            </button>
                        </div>
                        
                        {loading ? (
                            <p className="text-gray-400">Loading channels...</p>
                        ) : (
                            <div className="space-y-4">
                                {channels.length > 0 ? (
                                    channels.map(channel => (
                                        <div key={channel.channelId} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                                            <span className="font-medium text-white">{channel.channelName}</span>
                                            <button 
                                                onClick={() => handleUnlinkChannel(channel.channelId)}
                                                className="text-red-400 hover:text-red-300 font-semibold"
                                            >
                                                Unlink
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-center py-4">You haven't linked any YouTube channels yet.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
