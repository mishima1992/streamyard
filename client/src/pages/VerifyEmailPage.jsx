import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const VerifyEmailPage = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('Verifying your email, please wait...');

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus('error');
                setMessage('No verification token found.');
                return;
            }
            try {
                const { data } = await axios.get(`/api/auth/verify-email/${token}`);
                setStatus('success');
                setMessage(data.message);
            } catch (error) {
                setStatus('error');
                const errorMessage = error.response?.data?.message || 'An error occurred during verification.';
                setMessage(errorMessage);
            }
        };
        verify();
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md text-center">
                {status === 'verifying' && <h2 className="text-2xl font-bold text-yellow-400 mb-4">Verifying...</h2>}
                {status === 'success' && <h2 className="text-2xl font-bold text-green-400 mb-4">Success!</h2>}
                {status === 'error' && <h2 className="text-2xl font-bold text-red-400 mb-4">Verification Failed</h2>}
                
                <p className="text-gray-300 mb-6">{message}</p>

                {status === 'success' && (
                    <Link to="/login" className="w-full inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300">
                        Proceed to Login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default VerifyEmailPage;
