import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const UploadForm = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { api } = useAuth();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first.');
      return;
    }
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('video', file);

    try {
      await api.post('/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
      toast.success('File uploaded successfully!');
      onUploadSuccess();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Upload failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
      setFile(null);
      setUploadProgress(0);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
      <h3 className="text-lg font-semibold text-white mb-2">Upload a Video</h3>
      <p className="text-sm text-gray-400 mb-4">Select a video file from your device.</p>
      <div className="flex items-center space-x-4">
        <label className="w-full">
          <span className="sr-only">Choose file</span>
          <input
            type="file"
            onChange={handleFileChange}
            accept="video/mp4,video/quicktime,video/x-matroska,video/x-msvideo,video/webm,video/3gpp"
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 disabled:opacity-50"
            disabled={isUploading}
          />
        </label>
        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          Upload
        </button>
      </div>
      {isUploading && (
        <div className="w-full bg-gray-600 rounded-full h-2.5 mt-4">
          <div
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
