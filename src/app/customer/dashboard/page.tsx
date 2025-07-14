'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '@/app/Loading';

import {
  EMP_BRANCH_SUMMARY_URL,
  EMP_TOP_CUSTOMERS_URL,
  EMPLOYEE_PROFILE_URL,
} from '@/lib/constants';

import TopBar from '../customerComponents/TopBar';
import ProfileDrawer from '../customerComponents/ProfileDrawer';
import Sidebar from '../customerComponents/SideBar';

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

  // 👤 Fetch profile
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(EMPLOYEE_PROFILE_URL, {
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

  // 📊 Fetch summary and top customers (only if profile loaded)
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [summaryRes, topCustRes] = await Promise.all([
          axios.get(`${EMP_BRANCH_SUMMARY_URL}?scope=today`, {
            withCredentials: true,
          }),
          axios.get(`${EMP_TOP_CUSTOMERS_URL}?limit=5`, {
            withCredentials: true,
          }),
        ]);
        setSummary(summaryRes.data);
        setTopCustomers(topCustRes.data.topCustomers);
      } catch (err) {
        console.error('Dashboard data fetch failed:', err);
        
      }
    };


    fetchData();
  }, [user]);

  if (loading) return <Loading message="Loading dashboard..." />;
  if (!user) return null;

  return (
    <>
      <Sidebar />
      <TopBar user={user}/>
      <ProfileDrawer user={user} />

      <main className="pl-64 pt-20 min-h-screen bg-gray-100 p-6">
        <h1 className="text-2xl font-semibold text-blue-800 mb-6">
          Welcome, {user.name}
        </h1>

        {/* Branch summary cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {['DEPOSIT', 'WITHDRAWAL', 'TRANSFER'].map((key) => (
            <div key={key} className="bg-white p-6 rounded shadow">
              <p className="text-sm text-gray-500 mb-1">
                {key.replace('_', ' ').toLowerCase()}
              </p>
              <p className="text-xl font-bold text-blue-700">
                ₹ {(summary[key] || 0).toLocaleString()}
              </p>
            </div>
          ))}
        </section>

        {/* Top customers table */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Top Customers by Balance
          </h2>
          {topCustomers.length === 0 ? (
            <p className="text-gray-500">No data</p>
          ) : (
            <table className="min-w-full text-left">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">#</th>
                  <th className="px-4 py-2 border-b">Name</th>
                  <th className="px-4 py-2 border-b">Account</th>
                  <th className="px-4 py-2 border-b">Balance (₹)</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((c, idx) => (
                  <tr key={c.accountNumber}>
                    <td className="px-4 py-2 border-b">{idx + 1}</td>
                    <td className="px-4 py-2 border-b">{c.name}</td>
                    <td className="px-4 py-2 border-b">{c.accountNumber}</td>
                    <td className="px-4 py-2 border-b">
                      {c.balance.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </>
  );
}
