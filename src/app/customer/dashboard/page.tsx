'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '@/app/Loading';
import { CUSTOMER_DASHBOARD_SUMMARY, CUSTOMER_PROFILE_URL } from '@/lib/constants';

import TopBar from '../customerComponents/TopBar';
import Sidebar from '../customerComponents/SideBar';

export default function CustomerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile + analytics
 useEffect(() => {
  const fetchProfileAndSummary = async () => {
    try {
      const [profileRes, summaryRes] = await Promise.all([
        axios.get(CUSTOMER_PROFILE_URL, { withCredentials: true }),
        fetchSummary(), // call the separate function
      ]);

      setUser(profileRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      console.error('Dashboard fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchProfileAndSummary();
}, []);

const fetchSummary = async () => {
  const response = await axios.get(CUSTOMER_DASHBOARD_SUMMARY, {
    withCredentials: true,
  });
  return response;
};



  if (loading) return <Loading message="Loading dashboard..." />;
  if (!user || !summary) return null;

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
           
            
            <InfoCard
              label="Total Available Balance"
              value={`₹ ${summary.totalBalance.toLocaleString('en-IN')}`}
            />
          </div>

          {/* Transactions Section */}
          <div className="mt-10 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Recent Transactions</h2>
            <div className="overflow-x-auto">
              <table className="w-full mt-4 border-collapse">


                <thead className="bg-gray-50 text-sm text-gray-600">
                  <tr className="bg-gray-200">
                    <th className="border px-2 py-1">Date</th>
                    <th className="border px-2 py-1">Account</th>
                    <th className="border px-2 py-1">Type</th>
                    <th className="border px-2 py-1">Amount</th>
                    <th className="border px-2 py-1">Status</th>
                  </tr>

                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {summary.recentTransactions.map((txn: any) => (
                   <tr key={`${txn.transactionReferenceNumber}-${txn.accountNumber}-${txn.timestamp}`} className= "text-center">

                      <td className=" border px-4 py-2 text-black">
                        {new Date(txn.timestamp).toLocaleString()}
                      </td>
                      <td className="border px-4 py-2 text-black">{txn.accountNumber}</td>
                      <td className="border px-4 py-2 text-black">{txn.type}</td>
                      <td className="border px-4 py-2 text-black">₹ {txn.amount}</td>
                      <td className="border px-4 py-2 text-black">
                        <span
                          className={`text-sm px-2 py-1 rounded ${
                            txn.status === 'SUCCESS'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >

                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {summary.recentTransactions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-gray-500">
                        No recent transactions
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">{label}</h2>
      <p className="text-gray-900">{value}</p>
    </div>
  );
}
