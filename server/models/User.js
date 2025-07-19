import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: 'https://placehold.co/200x200/EFEFEF/333333?text=User',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationTokenExpires: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    ssoToken: String,
    ssoTokenExpires: Date,
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    googleId: {
      type: String,
    },
    youtubeChannels: [
      {
        channelId: String,
        channelName: String,
        accessToken: String,
        refreshToken: String,
      },
    ],
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'basic', 'pro'],
        default: 'free',
      },
      paddleSubscriptionId: String,
      storageQuotaBytes: {
        type: Number,
        default: 1073741824,
      },
      storageUsedBytes: {
        type: Number,
        default: 0,
      },
      maxBitrateKbps: {
        type: Number,
        default: 4000,
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
