'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CUSTOMER_PROFILE_URL, CUSTOMER_TRANSACTIONS_URL } from '@/lib/constants';
import Loading from '@/app/Loading';
import ErrorMessage from '@/app/ErrorMessage';
import Sidebar from '../customerComponents/SideBar';
import TopBar from '../customerComponents/TopBar';
import ProfileDrawer from '../customerComponents/ProfileDrawer';
import TransactionSearchForm from '../customerComponents/TransactionSearchForm';


export default function FindTransactionsPage() {
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [lastParams, setLastParams] = useState<any>(null);

  const LIMIT = 10;

  useEffect(() => {
    axios
      .get(CUSTOMER_PROFILE_URL, { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => window.location.href = '/login')
      .finally(() => setLoading(false));
  }, []);

  const fetchTransactions = async (params: any) => {
    setLoading(true);
    setMessage('');
    setTransactions(null);
    setError('');

    try {
      const response = await axios.post(CUSTOMER_TRANSACTIONS_URL, params, { withCredentials: true });

      if (response.data.transactions) {
        setTransactions(response.data.transactions);
      } else {
        setMessage('No transactions found.');
      }
    } catch (e: any) {
      const backendMsg = e?.response?.data?.error || e?.message || 'Unknown error';
      setError(backendMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (params: any) => {
    const updated = { ...params, limit: LIMIT, offset: 0 };
    setLastParams(params);
    setCurrentOffset(0);
    fetchTransactions(updated);
  };

  const handlePageChange = (newOffset: number) => {
    if (!lastParams) return;
    const newParams = { ...lastParams, limit: LIMIT, offset: newOffset };
    setCurrentOffset(newOffset);
    fetchTransactions(newParams);
  };

  

  if (loading) return <Loading message="Loading transactions..." />;
  if (!user) return null;

  return (
    <>
      <Sidebar />
        <TopBar user={user}/>
      <ProfileDrawer user={user} />
      <main className="pl-64 pt-20 min-h-screen bg-gray-100 flex flex-col items-center">
        <div className="w-full max-w-lg mt-6">
          <TransactionSearchForm onSubmit={handleSearch} message={message} />
        </div>

        {error && <ErrorMessage message={error} onClose={() => setError('')} />}

        {transactions && (
          <div className="mt-8 w-full max-w-6xl overflow-auto bg-white rounded shadow p-4">
            {Array.isArray(transactions) ? (
              <TransactionTable transactions={transactions} />
            ) : (
              Object.entries(transactions).map(([acct, txList]: any) => (
                <div key={acct} className="mb-6">
                  <h3 className="font-semibold mb-2 text-gray-800">Account: {acct}</h3>
                  <TransactionTable transactions={txList} />
                </div>
              ))
            )}

            <div className="flex justify-between mt-4">
              <button
                onClick={() => handlePageChange(Math.max(0, currentOffset - LIMIT))}
                disabled={currentOffset === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentOffset + LIMIT)}
                disabled={!transactions || (Array.isArray(transactions) && transactions.length < LIMIT)}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

function TransactionTable({ transactions }: { transactions: any[] }) {
  return (
    <table className="w-full text-sm border border-gray-500 rounded overflow-hidden">
      <thead className="bg-blue-700 text-white">
        <tr>
          {['Txn ID', 'Ref No', 'Type', 'Amount', 'Balance', 'By', 'UID', 'Timestamp', 'Status'].map(h => (
            <th key={h} className="px-3 py-2 border border-gray-500 font-semibold">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {transactions.map((tx, idx) => (
          <tr key={tx.transactionReferenceNumber} className={idx % 2 === 0 ? "bg-white" : "bg-blue-50"}>
            <td className="px-3 py-2 border border-gray-300 text-gray-900">{tx.transactionId}</td>
            <td className="px-3 py-2 border border-gray-300 text-gray-900">{tx.transactionReferenceNumber}</td>
            <td className="px-3 py-2 border border-gray-300 text-gray-900">{tx.type}</td>
            <td className="px-3 py-2 border border-gray-300 text-gray-900">{tx.amount}</td>
            <td className="px-3 py-2 border border-gray-300 text-gray-900">{tx.closingBalance}</td>
            <td className="px-3 py-2 border border-gray-300 text-gray-900">{tx.doneBy}</td>
            <td className="px-3 py-2 border border-gray-300 text-gray-900">{tx.userId}</td>
            <td className="px-3 py-2 border border-gray-300 text-gray-900">{new Date(tx.timestamp).toLocaleString()}</td>
            <td className="px-3 py-2 border border-gray-300 text-gray-900">{tx.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
