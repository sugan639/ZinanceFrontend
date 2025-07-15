'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';


import {
  EMPLOYEE_PROFILE_URL,
    GET_ACCOUNTS_BY_EMPLOYEE,
    UPDATE_ACCOUNT_STATUS_BY_EMPLOYEE,
    CREATE_NEW_ACCOUNT_BY_EMPLOYEE,
} from '@/lib/constants';
import Sidebar from '../employeeComponents/SideBar';
import TopBar from '../employeeComponents/TopBar';
import ProfileDrawer from '../employeeComponents/ProfileDrawer';
import Loading from '@/app/Loading';

export default function AccountManagement() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [customerId, setCustomerId] = useState('');
  const [accounts, setAccounts] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [newAccountForm, setNewAccountForm] = useState({
    user_id: '',
    branch_id: '',
    balance: '',
  });

  useEffect(() => {
    axios
      .get(EMPLOYEE_PROFILE_URL, { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => (window.location.href = '/login'))
      .finally(() => setLoading(false));
  }, []);

  const fetchAccounts = async () => {
    setError('');
    setMessage('');
    try {
      const res = await axios.get(GET_ACCOUNTS_BY_EMPLOYEE + customerId, { withCredentials: true });
      const normalized = (res.data.accounts || []).map((acc: any) => ({
        account_number: acc.account_number || acc.accountNumber,
        balance: acc.balance,
        status: acc.status,
        created_at: acc.created_at || acc.createdAt,
      }));
      setAccounts(normalized);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to fetch accounts');
      setAccounts([]);
    }
  };

  const handleStatusChange = async (account_number: number, operation: "ACTIVATE" | "INACTIVATE") => {
    setError('');
    setMessage('');
    try {
      const payload = {
        account_number,
        operation,
      };
      const res = await axios.post(UPDATE_ACCOUNT_STATUS_BY_EMPLOYEE, payload, { withCredentials: true });
      setMessage(res.data.message || 'Status updated');
      fetchAccounts(); // refresh
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Status update failed');
    }
  };

  const handleCreateAccount = async () => {
    setError('');
    setMessage('');
    try {
      const payload = {
        ...newAccountForm,
        user_id: Number(newAccountForm.user_id),
        branch_id: Number(newAccountForm.branch_id),
        balance: Number(newAccountForm.balance),
      };
      const res = await axios.post(CREATE_NEW_ACCOUNT_BY_EMPLOYEE, payload, { withCredentials: true });
      setMessage(res.data.message || 'New account created');
      setNewAccountForm({ user_id: '', branch_id: '', balance: '' });
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to create account');
    }
  };

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
            <h2 className="text-xl font-semibold text-blue-700">Get Accounts by Customer ID</h2>
            <input
              type="text"
              placeholder="Customer ID"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full border px-3 py-2 rounded border-gray-500"
            />
            <button
              onClick={fetchAccounts}
              className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
            >
              Fetch Accounts
            </button>

            {accounts.length > 0 && (
              <table className="w-full mt-4 border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-2 py-1">Account Number</th>
                    <th className="border px-2 py-1">Balance</th>
                    <th className="border px-2 py-1">Status</th>
                    <th className="border px-2 py-1">Created At</th>
                    <th className="border px-2 py-1">Actions</th>
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
                      <td className="border px-2 py-1 space-x-2">
                        <button
                          onClick={() => handleStatusChange(acc.account_number, 'ACTIVATE')}
                          className="bg-green-600 text-white px-2 py-1 rounded text-sm"
                        >
                          Activate
                        </button>
                        <button
                          onClick={() => handleStatusChange(acc.account_number, 'INACTIVATE')}
                          className="bg-red-600 text-white px-2 py-1 rounded text-sm"
                        >
                          Deactivate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Create New Account */}
          
          <div className="bg-white p-6 rounded shadow space-y-4">
              <h2 className="text-xl font-semibold text-blue-700">Create New Account</h2>
              <input
                type="number"
                placeholder="Customer User ID"
                value={newAccountForm.user_id}
                onChange={(e) =>
                  setNewAccountForm({ ...newAccountForm, user_id: (e.target.value) })
                }
                className="w-full border px-3 py-2 rounded border-gray-500"
              />
              <input
                type="number"
                placeholder="Branch ID"
                value={newAccountForm.branch_id}
                onChange={(e) =>
                  setNewAccountForm({ ...newAccountForm, branch_id: (e.target.value) })
                }
                className="w-full border px-3 py-2 rounded border-gray-500"
              />
              <input
                type="number"
                placeholder="Initial Balance"
                value={newAccountForm.balance}
                onChange={(e) =>
                  setNewAccountForm({ ...newAccountForm, balance: (e.target.value) })
                }
                className="w-full border px-3 py-2 rounded border-gray-500"
              />
              <button
                onClick={handleCreateAccount}
                className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
              >
                Create Account
              </button>
            </div>

          {/* Messages */}
          {message && <p className="text-green-600 font-semibold">{message}</p>}
          {error && <p className="text-red-600 font-semibold">{error}</p>}
        </div>
      </main>
    </>
  );
}
