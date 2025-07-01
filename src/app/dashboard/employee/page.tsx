'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { EMPLOYEE_PROFILE_URL, LOGOUT_URL } from '@/lib/constants';

export default function EmployeeDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [logoutError, setLogoutError] = useState('');

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await axios.get(EMPLOYEE_PROFILE_URL, {
        withCredentials: true,
      });
      setUser(res.data);
    } catch (err: any) {
      // If unauthorized, redirect to login
      if (err.response && err.response.status === 401) {
        router.push('/login');
      } else {
        setError('Failed to load user data');
      }
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, [router]);
  const handleLogout = async () => {
    try {
      await axios.post(
        LOGOUT_URL,
        {},
        {
          withCredentials: true,
        }
      );
      // Clear state and redirect to login
      router.push('/login');
    } catch (err: any) {
      setLogoutError('Logout failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 md:p-12">
      {/* Top Navigation */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Zinance</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* Greeting */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Hello, {user.name} 👋</h2>
        <p className="text-gray-500 mt-1">Welcome back to your Zinance employee dashboard</p>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200 transition transform hover:shadow-xl">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">User ID</p>
            <p className="font-medium text-gray-800">{user.employeeId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-800">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Mobile Number</p>
            <p className="font-medium text-gray-800">{user.mobileNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-medium text-gray-800 capitalize">{user.role.toLowerCase()}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-100 p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-indigo-800">View Transactions</h3>
          <p className="text-sm text-indigo-600 mt-2">Review customer transactions</p>
        </div>
        <div className="bg-blue-100 p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-blue-800">Customer Support</h3>
          <p className="text-sm text-blue-600 mt-2">Assist customers with queries</p>
        </div>
        <div className="bg-purple-100 p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-purple-800">Reports & Analytics</h3>
          <p className="text-sm text-purple-600 mt-2">Generate business reports</p>
        </div>
      </div>

      {/* Logout Error */}
      {logoutError && (
        <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm text-center">
          {logoutError}
        </div>
      )}
    </div>
  );
}