import React from 'react';

const VideoList = ({ videos }) => {
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
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.length > 0 ? (
                videos.map((video) => (
                  <tr key={video._id} className="border-b border-gray-700 hover:bg-gray-600/50">
                    <td className="px-6 py-4 font-medium text-white">{video.title}</td>
                    <td className="px-6 py-4 capitalize">{video.source.replace('-', ' ')}</td>
                    <td className="px-6 py-4">{formatBytes(video.size)}</td>
                    <td className="px-6 py-4">{new Date(video.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <button className="font-medium text-blue-400 hover:underline">Rename</button>
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
