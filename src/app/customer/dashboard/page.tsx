'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '@/app/Loading';

import { CUSTOMER_PROFILE_URL } from '@/lib/constants';

import TopBar from '../customerComponents/TopBar';
import Sidebar from '../customerComponents/SideBar';

export default function CustomerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 👤 Fetch profile
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(CUSTOMER_PROFILE_URL, {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (err) {
        console.error('Profile fetch failed:', err);
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loading message="Loading dashboard..." />;
  if (!user) return null;

  return (
    <>
      <Sidebar />
      <TopBar user={user} />

      <main className="pl-64 pt-20 min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-semibold text-blue-800 mb-6">
            Welcome, {user.name}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Your Mobile Number</h2>
              <p className="text-gray-900">{user.mobileNumber}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Email</h2>
              <p className="text-gray-900">{user.email}</p>
            </div>

            {user?.address && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Address</h2>
                <p className="text-gray-900">{user.address}</p>
              </div>
            )}

            {user?.dob && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Date of Birth</h2>
                <p className="text-gray-900">
                  {new Date(user.dob).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Add more customer-specific analytics or actions here */}
        </div>
      </main>
    </>
  );
}
