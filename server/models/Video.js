import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    originalFilename: {
      type: String,
      required: true,
    },
    serverFilename: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    bitrateKbps: {
      type: Number,
      default: 0,
    },
    source: {
      type: String,
      required: true,
      enum: ['upload', 'google-drive'],
    },
    status: {
      type: String,
      required: true,
      enum: ['processing', 'ready', 'error'],
      default: 'ready',
    },
  },
  {
    timestamps: true,
  }
);

const Video = mongoose.model('Video', videoSchema);

export default Video;
