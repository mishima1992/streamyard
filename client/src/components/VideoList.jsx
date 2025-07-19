import React, { useState } from 'react';

const VideoList = ({ videos, onDelete, onRename }) => {
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [newTitle, setNewTitle] = useState('');

  const handleRenameClick = (video) => {
    setEditingVideoId(video._id);
    setNewTitle(video.title);
  };

  const handleCancelClick = () => {
    setEditingVideoId(null);
    setNewTitle('');
  };

  const handleSaveClick = async (videoId) => {
    const success = await onRename(videoId, newTitle);
    if (success) {
      setEditingVideoId(null);
      setNewTitle('');
    }
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold text-white mb-4">Your Video Library</h2>
      <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-700 text-xs text-gray-200 uppercase">
              <tr>
                <th scope="col" className="px-6 py-3">Title</th>
                <th scope="col" className="px-6 py-3">Source</th>
                <th scope="col" className="px-6 py-3">Size</th>
                <th scope="col" className="px-6 py-3">Uploaded On</th>
                <th scope="col" className="px-6 py-3 w-48">Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.length > 0 ? (
                videos.map((video) => (
                  <tr key={video._id} className="border-b border-gray-700 hover:bg-gray-600/50">
                    <td className="px-6 py-4 font-medium text-white">
                      {editingVideoId === video._id ? (
                        <input
                          type="text"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          className="bg-gray-700 p-2 rounded w-full"
                          autoFocus
                        />
                      ) : (
                        video.title
                      )}
                    </td>
                    <td className="px-6 py-4 capitalize">{video.source.replace('-', ' ')}</td>
                    <td className="px-6 py-4">{formatBytes(video.size)}</td>
                    <td className="px-6 py-4">{new Date(video.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      {editingVideoId === video._id ? (
                        <div className="flex space-x-4">
                          <button onClick={() => handleSaveClick(video._id)} className="font-medium text-green-400 hover:underline">Save</button>
                          <button onClick={handleCancelClick} className="font-medium text-gray-400 hover:underline">Cancel</button>
                        </div>
                      ) : (
                        <div className="flex space-x-4">
                          <button onClick={() => handleRenameClick(video)} className="font-medium text-blue-400 hover:underline">Rename</button>
                          <button onClick={() => onDelete(video._id)} className="font-medium text-red-400 hover:underline">Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-400">
                    You haven't uploaded any videos yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VideoList;
