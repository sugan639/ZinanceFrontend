'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { LOGIN_URL } from '@/lib/constants';

export default function LoginPage() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(
        LOGIN_URL,
        {
          user_id: userId,
          password: password,
        },
        { withCredentials: true }
      );
// Lets spin up the authentication service .

      const user = response.data;

      if (user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (user.role === 'EMPLOYEE') {
        router.push('/employee/dashboard');
      } else if (user.role === 'CUSTOMER') {
        router.push('/customer/dashboard');
      } else {
        throw new Error('Unknown user role');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-200 to-purple-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10 space-y-6 animate-fade-in">
        <h2 className="text-3xl font-extrabold text-center text-indigo-700">Welcome to Zinance</h2>
        <p className="text-center text-gray-500 text-sm">Login to your account</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">User ID</label>
            <input
              type="text"
              placeholder="e.g., 100000031"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 text-black bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 text-black bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200"
          >
            Sign In
          </button>
        </form>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
