'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';


import {
  CUSTOMER_PROFILE_URL,
  CUSTOMER_ACCOUNTS_URL,

} from '@/lib/constants';
import Loading from '@/app/Loading';
import TopBar from '../customerComponents/TopBar';
import ProfileDrawer from '../customerComponents/ProfileDrawer';
import Sidebar from '../customerComponents/SideBar';


export default function AccountManagement() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [accounts, setAccounts] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');


 useEffect(() => {
  const fetchData = async () => {
    try {
      // 1️⃣ Get the customer profile
      const profileRes = await axios.get(CUSTOMER_PROFILE_URL, {
        withCredentials: true,
      });
      setUser(profileRes.data);

      // 2️⃣ Get the customer accounts
      const accountsRes = await axios.get(CUSTOMER_ACCOUNTS_URL, {
        withCredentials: true,
      });

      // 3️⃣ Normalize and store accounts
      const normalized = (accountsRes.data.accounts || []).map((acc: any) => ({
        account_number: acc.account_number ?? acc.accountNumber,
        balance: acc.balance,
        status: acc.status,
        created_at: acc.created_at ?? acc.createdAt,
      }));
      setAccounts(normalized);
    } catch (err) {
      // Redirect to login if *either* request fails with auth error
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  };

  fetchData(); // invoke the async function
}, []);



  if (loading) {
    return <Loading message="Loading account management..." />;
  }

  return (
    <>
      <Sidebar />
      <TopBar user={user} />
      {user && <ProfileDrawer user={user} />}

      <main className="pl-64 pt-20 bg-gray-100 min-h-screen p-6 text-gray-900">
        <div className="max-w-5xl mx-auto space-y-8">
          <h1 className="text-2xl font-bold text-blue-800">Account Management</h1>

          {/* Fetch Accounts */}
          <div className="bg-white p-6 rounded shadow space-y-4">
            <h2 className="text-xl font-semibold text-blue-700">Your Accounts</h2>
         
           

            {accounts.length > 0 && (
              <table className="w-full mt-4 border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-2 py-1">Account Number</th>
                    <th className="border px-2 py-1">Balance</th>
                    <th className="border px-2 py-1">Status</th>
                    <th className="border px-2 py-1">Created At</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((acc) => (
                    <tr key={acc.account_number} className="text-center">
                      <td className="border px-2 py-1">{acc.account_number}</td>
                      <td className="border px-2 py-1">₹{acc.balance}</td>
                      <td className="border px-2 py-1">{acc.status}</td>
                      <td className="border px-2 py-1">
                        {acc.created_at
                            ? new Date(Number(acc.created_at)).toLocaleString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                })
                            : 'N/A'}

                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>


          {/* Messages */}
          {message && <p className="text-green-600 font-semibold">{message}</p>}
          {error && <p className="text-red-600 font-semibold">{error}</p>}
        </div>
      </main>
    </>
  );
}
