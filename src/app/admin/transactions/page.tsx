'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from '@/app/components/SideBar';
import TopBar from '@/app/components/TopBar';
import ProfileDrawer from '@/app/components/ProfileDrawer';
import axios from 'axios';
import { ADMIN_PROFILE_URL, FIND_TRANSACTIONS_URL } from '@/lib/constants';
import TransactionSearchForm from '@/app/components/TransactionSearchForm';
import ErrorMessage from '@/app/components/ErrorMessage';

export default function FindTransactionsPage() {
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [paginationParams, setPaginationParams] = useState<any>(null);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [lastParams, setLastParams] = useState<any>(null);

  const LIMIT = 10;



  // I
  
  useEffect(() => {
    axios.get(ADMIN_PROFILE_URL, { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => window.location.href = '/login')
      .finally(() => setLoading(false));
  }, []);

  const fetchTransactions = async (params: any) => {
    setLoading(true);
    setMessage('');
    setTransactions(null);
    setError('');




    try {
      const response = await axios.post(FIND_TRANSACTIONS_URL, params, { withCredentials: true });
      

    // Handle both flat and grouped responses





      if (response.data.transactions) {
        setTransactions(response.data.transactions);
        setMessage('');
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  const renderTableRows = (txList: any[]) =>
    txList.map(tx => (
      <tr key={tx.transactionId} className="even:bg-gray-50">
        <td className="px-2 py-1 border">{tx.transactionId}</td>
        <td className="px-2 py-1 border">{tx.transactionReferenceNumber}</td>
        <td className="px-2 py-1 border">{tx.type}</td>
        <td className="px-2 py-1 border">{tx.amount}</td>
        <td className="px-2 py-1 border">{tx.closingBalance}</td>
        <td className="px-2 py-1 border">{tx.doneBy}</td>
        <td className="px-2 py-1 border">{tx.userId}</td>
        <td className="px-2 py-1 border">{new Date(tx.timestamp).toLocaleString()}</td>
        <td className="px-2 py-1 border">{tx.status}</td>
      </tr>
    ));

  return (
    <>
      <Sidebar />
      <TopBar />
      <ProfileDrawer user={user} />
      <main className="pl-64 pt-20 min-h-screen bg-gray-100 flex flex-col items-center">
        <div className="w-full max-w-lg mt-6">
          <TransactionSearchForm onSubmit={handleSearch} message={message} />
        </div>

        {error && <ErrorMessage message={error} onClose={() => setError('')} />}

        {transactions && (
          <div className="mt-8 w-full max-w-6xl overflow-auto bg-white rounded shadow p-4">
            {Array.isArray(transactions) ? (
              // Flat response
              <div>
                
                <h3 className="font-semibold mb-2 text-gray-800">Transactions</h3>
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
                      <tr
                        key={tx.transactionId}
                        className={idx % 2 === 0 ? "bg-white" : "bg-blue-50"}
                      >
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
              </div>
            ) : (
              // Grouped response
              Object.entries(transactions).map(([acct, txList]: any) => (
                <div key={acct} className="mb-6">
                  <h3 className="font-semibold mb-2 text-gray-800">Account: {acct}</h3>
                  <table className="w-full text-sm border border-gray-500 rounded overflow-hidden">
                    <thead className="bg-blue-700 text-white">
                      <tr>
                        {['Txn ID', 'Ref No', 'Type', 'Amount', 'Balance', 'By', 'UID', 'Timestamp', 'Status'].map(h => (
                          <th key={h} className="px-3 py-2 border border-gray-500 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {txList.map((tx: any, idx: number) => (
                        <tr
                          key={tx.transactionId}
                          className={idx % 2 === 0 ? "bg-white" : "bg-blue-50"}
                        >
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
                </div>
              ))
            )}

            {/* Pagination */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handlePageChange(Math.max(0, currentOffset - LIMIT))}
                disabled={currentOffset === 0}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentOffset + LIMIT)}
                // Disable if fewer than LIMIT transactions are shown
                disabled={
                  !transactions ||
                  (Array.isArray(transactions) && transactions.length < LIMIT)
                }
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
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
