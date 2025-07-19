import User from '../models/User.js';
import fs from 'fs';

export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.username = req.body.username || user.username;
            if (req.body.email && req.body.email !== user.email) {
                const existingUser = await User.findOne({ email: req.body.email });
                if (existingUser) {
                    return res.status(400).json({ message: 'Email already in use' });
                }
                user.email = req.body.email;
            }
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                avatar: updatedUser.avatar,
                role: updatedUser.role,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updateUserPassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (user && (await user.matchPassword(currentPassword))) {
            user.password = newPassword;
            await user.save();
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(401).json({ message: 'Invalid current password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updateUserAvatar = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload an image file.' });
    }
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            if (user.avatar && !user.avatar.includes('placehold.co')) {
                const oldAvatarPath = user.avatar.substring(1);
                fs.unlink(oldAvatarPath, (err) => {
                    if (err) console.error("Could not delete old avatar:", err);
                });
            }
            user.avatar = `/${req.file.path}`;
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                avatar: updatedUser.avatar,
                role: updatedUser.role,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during avatar upload.' });
    }
};
