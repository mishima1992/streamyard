import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ImportForm = ({ onImportSuccess }) => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('idle'); // idle, importing, retrying, success, failed
  const [retryCount, setRetryCount] = useState(0);
  const { api } = useAuth();
  const MAX_RETRIES = 3;

  const handleImport = async () => {
    setStatus('importing');
    setRetryCount(0);
    tryImport(url, 0);
  };

  const tryImport = async (importUrl, currentRetry) => {
    try {
      await api.post('/videos/import/google-drive', { url: importUrl });
      setStatus('success');
      toast.success('Video imported successfully!');
      setUrl('');
      onImportSuccess();
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      if (currentRetry < MAX_RETRIES) {
        setRetryCount(currentRetry + 1);
        setStatus('retrying');
        setTimeout(() => tryImport(importUrl, currentRetry + 1), 5000);
      } else {
        setStatus('failed');
        const errorMessage = error.response?.data?.message || 'Failed to import after multiple retries.';
        toast.error(errorMessage);
        setTimeout(() => setStatus('idle'), 5000);
      }
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'importing':
        return 'Importing... This may take a while.';
      case 'retrying':
        return `Connection unstable. Retrying... (${retryCount}/${MAX_RETRIES})`;
      case 'success':
        return 'Import successful!';
      case 'failed':
        return 'Import failed.';
      default:
        return '';
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
      <h3 className="text-lg font-semibold text-white mb-2">Import from Google Drive</h3>
      <p className="text-sm text-gray-400 mb-4">Paste a public Google Drive video link to import it.</p>
      <div className="flex items-start space-x-4">
        <input
          type="url"
          placeholder="https://drive.google.com/file/d/..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 flex-grow"
          disabled={status === 'importing' || status === 'retrying'}
        />
        <button
          onClick={handleImport}
          disabled={!url || status === 'importing' || status === 'retrying'}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          Import
        </button>
      </div>
      {status !== 'idle' && (
        <p className="text-sm text-yellow-400 mt-3">{getStatusMessage()}</p>
      )}
    </div>
  );
};

export default ImportForm;
