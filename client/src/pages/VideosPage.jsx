import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import UploadForm from '../components/UploadForm';
import ImportForm from '../components/ImportForm';
import VideoList from '../components/VideoList';

const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { api } = useAuth();

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/videos');
      setVideos(data);
    } catch (error) {
      toast.error('Could not fetch videos.');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Video Management</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <UploadForm onUploadSuccess={fetchVideos} />
        <ImportForm onImportSuccess={fetchVideos} />
      </div>
      {loading ? (
        <p className="text-center text-gray-400">Loading video library...</p>
      ) : (
        <VideoList videos={videos} />
      )}
    </div>
  );
};

export default VideosPage;
