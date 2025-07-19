import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser, api, updateAuthInfo } = useAuth();

    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');

    const fetchChannels = useCallback(async () => {
        try {
            const { data } = await api.get('/youtube/channels');
            setChannels(data);
        } catch (error) {
            toast.error('Could not fetch linked channels.');
        } finally {
            setLoading(false);
        }
    }, [api]);

    useEffect(() => {
        if (currentUser) {
            fetchChannels();
        }
    }, [fetchChannels, currentUser]);

    const handleLinkChannel = async () => {
        try {
            const authDomain = import.meta.env.VITE_AUTH_DOMAIN;
            const fullAuthUrl = `https://${authDomain}/api/youtube/auth-url`;
            const { data } = await api.get(fullAuthUrl);
            window.open(data.url, '_blank', 'noopener,noreferrer,width=600,height=700');
        } catch (error) {
            toast.error('Could not start the linking process.');
        }
    };

    const handleUnlinkChannel = async (channelId) => {
        if (window.confirm('Are you sure you want to unlink this channel?')) {
            try {
                await api.delete(`/youtube/channels/${channelId}`);
                toast.success('Channel unlinked successfully.');
                fetchChannels();
            } catch (error) {
                toast.error('Failed to unlink channel.');
            }
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error("New passwords don't match.");
        }
        try {
            await api.put('/users/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            toast.success('Password updated successfully!');
            setIsPasswordModalOpen(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update password.');
        }
    };

    const handleAvatarFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleAvatarUpload = async () => {
        if (!avatarFile) return;
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        try {
            const { data } = await api.put('/users/avatar', formData);
            updateAuthInfo({ avatar: data.avatar });
            toast.success('Avatar updated successfully!');
            setIsAvatarModalOpen(false);
            setAvatarPreview('');
            setAvatarFile(null);
        } catch (error) {
            toast.error('Failed to upload avatar.');
        }
    };

    const formatBytes = (bytes, decimals = 2) => {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
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
                            <button onClick={() => setIsAvatarModalOpen(true)} className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 rounded-full p-2 text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                        <h2 className="text-2xl font-bold text-white mt-4">{currentUser.username}</h2>
                        <p className="text-gray-400">{currentUser.email}</p>
                        <button onClick={() => setIsPasswordModalOpen(true)} className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                            Change Password
                        </button>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                        <h3 className="text-xl font-semibold text-white mb-4">Subscription Details</h3>
                        <div className="space-y-3 text-gray-300">
                            <p><strong>Plan:</strong> <span className="capitalize font-medium text-green-400">{currentUser.subscription?.plan || 'N/A'}</span></p>
                            <p><strong>Storage:</strong> {formatBytes(currentUser.subscription?.storageUsedBytes)} / {formatBytes(currentUser.subscription?.storageQuotaBytes)}</p>
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

            {isPasswordModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-2xl font-bold text-white mb-6">Change Your Password</h2>
                        <form onSubmit={handlePasswordChange}>
                            <input type="password" placeholder="Current Password" value={passwordData.currentPassword} onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})} className="w-full p-3 mb-4 bg-gray-700 text-white rounded-lg border border-gray-600" required />
                            <input type="password" placeholder="New Password" value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} className="w-full p-3 mb-4 bg-gray-700 text-white rounded-lg border border-gray-600" required />
                            <input type="password" placeholder="Confirm New Password" value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} className="w-full p-3 mb-6 bg-gray-700 text-white rounded-lg border border-gray-600" required />
                            <div className="flex justify-end space-x-4">
                                <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Update Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isAvatarModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md text-center">
                        <h2 className="text-2xl font-bold text-white mb-6">Change Your Avatar</h2>
                        {avatarPreview && <img src={avatarPreview} alt="Avatar Preview" className="w-40 h-40 rounded-full mx-auto mb-4" />}
                        <input type="file" accept="image/*" onChange={handleAvatarFileChange} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 mb-6" />
                        <div className="flex justify-center space-x-4">
                            <button type="button" onClick={() => setIsAvatarModalOpen(false)} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
                            <button type="button" onClick={handleAvatarUpload} disabled={!avatarFile} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-500">Upload & Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
