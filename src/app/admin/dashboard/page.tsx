'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import {
  ADMIN_PROFILE_URL,
  ANALYTICS_MONTHLY_URL,
  ANALYTICS_TOP_ACCOUNTS_URL,
} from '@/lib/constants';

import TopBar from '@/app/admin/components/TopBar';
import Sidebar from '@/app/admin/components/SideBar';
import ProfileDrawer from '@/app/admin/components/ProfileDrawer';
import Loading from '@/app/admin/components/Loading';

import '@/app/admin/css/sidebar.css';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [monthlyTotals, setMonthlyTotals] = useState<{ DEPOSIT: number; WITHDRAWAL: number } | null>(null);
  const [topAccounts, setTopAccounts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await axios.get(ADMIN_PROFILE_URL, { withCredentials: true });
        if (profileRes.data) {
          setUser(profileRes.data);
        } else {
          router.replace('/login');
          return;
        }

        const [monthlyRes, topRes] = await Promise.all([
          axios.get(ANALYTICS_MONTHLY_URL, { withCredentials: true }),
          axios.get(`${ANALYTICS_TOP_ACCOUNTS_URL}?days=30&limit=10`, { withCredentials: true }),
        ]);

        setMonthlyTotals(monthlyRes.data || {});
        setTopAccounts(topRes.data.topActiveAccounts || []);
      } catch (err) {
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) return <Loading message="Loading dashboard..." />;
  if (!user) return null;

  return (
    <>
      <Sidebar />
      <TopBar />
      <ProfileDrawer user={user} />

      <main className="pl-64 pt-20 min-h-screen bg-gray-100 p-6">
        <h1 className="text-2xl font-semibold text-blue-800 mb-6">Welcome, {user.name}</h1>

        {/* Monthly Summary */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Monthly Deposits</h2>
            <p className="text-3xl font-bold text-green-600">
              ₹ {monthlyTotals?.DEPOSIT?.toLocaleString() ?? '0'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Monthly Withdrawals</h2>
            <p className="text-3xl font-bold text-red-600">
              ₹ {monthlyTotals?.WITHDRAWAL?.toLocaleString() ?? '0'}
            </p>
          </div>
        </section>

        {/* Top Active Accounts */}
                <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Top 5 Active Accounts (Last 30 Days)</h2>
          {topAccounts.length === 0 ? (
            <p className="text-gray-500">No active accounts found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-400">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border border-gray-400 text-sm font-semibold text-gray-800 text-left">
                      #
                    </th>
                    <th className="px-4 py-2 border border-gray-400 text-sm font-semibold text-gray-800 text-left">
                      Account Number
                    </th>
                    <th className="px-4 py-2 border border-gray-400 text-sm font-semibold text-gray-800 text-left">
                      Transactions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topAccounts.map((acc, index) => (
                    <tr key={acc.accountNumber} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-4 py-2 border border-gray-400 text-gray-800">{index + 1}</td>
                      <td className="px-4 py-2 border border-gray-400 text-gray-800">{acc.accountNumber}</td>
                      <td className="px-4 py-2 border border-gray-400 text-gray-800">{acc.txnCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </main>
    </>
  );
}
