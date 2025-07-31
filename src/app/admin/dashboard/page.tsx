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
import DataTable from '@/app/common/components/DataTable';

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
        console.error('Admin dashboard fetch failed:', err);
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
  
      <main className=" bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <header className="mb-10">
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome, {user.name}
            </h1>
            <p className="text-gray-600 mt-1">Admin overview & system analytics</p>
          </header>

          {/* Monthly Summary Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Deposits Card */}
            <div className="bg-white p-7 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">Monthly Deposits</h2>
                  <p className="text-sm text-gray-500">Total inflow this month</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-green-700">
                ₹ {monthlyTotals?.DEPOSIT?.toLocaleString() ?? '0'}
              </p>
            </div>

            {/* Withdrawals Card */}
            <div className="bg-white p-7 rounded-2xl shadow-lg border border-red-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">Monthly Withdrawals</h2>
                  <p className="text-sm text-gray-500">Total outflow this month</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-red-700">
                ₹ {monthlyTotals?.WITHDRAWAL?.toLocaleString() ?? '0'}
              </p>
            </div>
          </section>

          {/* Top Active Accounts Table */}
          <section className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-8 8" />
                </svg>
                Top 10 Active Accounts (Last 30 Days)
              </h2>
              <p className="text-gray-600 text-sm mt-1">Accounts with the highest transaction volume</p>
            </div>

            {/* Top Active Accounts Table */}
<DataTable
  columns={[
    {
      key: 'rank',
      label: 'Rank',
      render: (row) => (
        <span className="px-8 py-5 text-sm font-medium text-gray-800">#{row.rank}</span>
      ),
    },
    {
      key: 'accountNumber',
      label: 'Account Number',
      render: (row) => (
        <span className="px-8 py-5 text-sm text-gray-700 font-mono">{row.accountNumber}</span>
      ),
    },
    {
      key: 'txnCount',
      label: 'Transaction Count',
      render: (row) => (
        <span className="px-8 py-5 text-sm font-semibold text-green-700">{row.txnCount}</span>
      ),
    },
  ]}
  data={topAccounts.map((acc, index) => ({ ...acc, rank: index + 1 }))} // Add rank here
  noDataMessage="No active accounts found."
/>
          </section>
        </div>
      </main>
    </>
  );
}