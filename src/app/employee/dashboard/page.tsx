'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '@/app/Loading';
import {
  EMP_BRANCH_SUMMARY_URL,
  EMP_TOP_CUSTOMERS_URL,
  EMPLOYEE_PROFILE_URL,
} from '@/lib/constants';

import TopBar from '../employeeComponents/TopBar';
import ProfileDrawer from '../employeeComponents/ProfileDrawer';
import Sidebar from '../employeeComponents/SideBar';

type Summary = { [key: string]: number };

interface CustomerRow {
  name: string;
  accountNumber: number;
  balance: number;
}

export default function EmployeeDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<Summary>({});
  const [topCustomers, setTopCustomers] = useState<CustomerRow[]>([]);

  // Fetch employee profile
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(EMPLOYEE_PROFILE_URL, { withCredentials: true });
        setUser(res.data);
      } catch (err) {
        console.error('Profile fetch failed:', err);
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Fetch summary & top customers
  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        const [summaryRes, topCustRes] = await Promise.all([
          axios.get(`${EMP_BRANCH_SUMMARY_URL}?scope=month`, { withCredentials: true }),
          axios.get(`${EMP_TOP_CUSTOMERS_URL}?limit=5`, { withCredentials: true }),
        ]);
        setSummary(summaryRes.data);
        setTopCustomers(topCustRes.data.topCustomers);
      } catch (err) {
        console.error('Dashboard data fetch failed:', err);
      }
    })();
  }, [user]);

  if (loading) return <Loading message="Loading dashboard..." />;
  if (!user) return null;

  return (
    <>
      <Sidebar />
      <TopBar user={user} />
      <ProfileDrawer user={user} />

      <main className="pl-64 pt-20 min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header - Prevents Line Break */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 space-y-2 sm:space-y-0">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome back,{' '}  {user.name}
              </h1>
              <p className="text-gray-600 mt-1">Here’s your branch performance at a glance</p>
            </div>
            <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
              Role: <span className="font-medium">{user.role || 'Employee'}</span>
            </div>
          </header>

          {/* Summary Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Deposit Card */}
            <div className="bg-white p-7 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Total Deposits</h3>
                  <p className="text-sm text-gray-500">This month</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-green-700">
                ₹ {(summary['DEPOSIT'] || 0).toLocaleString()}
              </p>
            </div>



            {/* Withdrawal Card */}
            <div className="bg-white p-7 rounded-2xl shadow-lg border border-red-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Total Withdrawals</h3>
                  <p className="text-sm text-gray-500">This month</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-red-700">
                ₹ {(summary['WITHDRAWAL'] || 0).toLocaleString()}
              </p>
            </div>
          </section>

          {/* Top Customers Table */}
          <section className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.88-1.44M15 16a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Top Customers by Balance
              </h2>
              <p className="text-gray-600 text-sm mt-1">Top 5 highest-balance customers in your branch</p>
            </div>

            {topCustomers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg">No customer data available</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 uppercase text-sm">
                    <tr>
                      <th className="px-8 py-4 text-left font-semibold tracking-wider">Rank</th>
                      <th className="px-8 py-4 text-left font-semibold tracking-wider">Customer Name</th>
                      <th className="px-8 py-4 text-left font-semibold tracking-wider">Account No.</th>
                      <th className="px-8 py-4 text-left font-semibold tracking-wider">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {topCustomers.map((c, idx) => (
                      <tr
                        key={c.accountNumber}
                        className="hover:bg-blue-50 transition-colors duration-150"
                      >
                        <td className="px-8 py-5 text-sm font-medium text-gray-800">
                          #{idx + 1}
                        </td>
                        <td className="px-8 py-5 text-sm text-gray-700 font-medium">
                          {c.name}
                        </td>
                        <td className="px-8 py-5 text-sm text-gray-600 font-mono">
                          {c.accountNumber}
                        </td>
                        <td className="px-8 py-5 text-sm font-semibold text-green-700">
                          ₹ {c.balance.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}