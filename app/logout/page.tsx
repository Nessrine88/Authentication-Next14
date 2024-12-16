"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Logout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>(''); // Ensure `error` is typed as string
  const router = useRouter(); // Redirect after logout

  const handleLogout = async () => {
    setLoading(true);
    setError('');

    try {
      // Retrieve the token from localStorage (or wherever it's stored)
      const token = localStorage.getItem('token');

      // If no token exists, show an error
      if (!token) {
        setError('No token found. You are not logged in.');
        return;
      }

      // Make the logout request
      const response = await fetch('http://localhost:3000/logout', {
        method: 'DELETE', // Assuming logout is a DELETE request
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
        },
      });

      if (!response.ok) {
        throw new Error('Failed to log out');
      }

      // On success, remove the token and user data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Redirect to the login page or any other page
      router.push('/login');
    } catch (err) {
      // Type narrowing: Check if the error is an instance of `Error`
      if (err instanceof Error) {
        setError(err.message); // Use the error message
      } else {
        setError('An unknown error occurred'); // Fallback for unknown errors
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Logout</h2>
        
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <div className="text-center">
          <button
            onClick={handleLogout}
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
