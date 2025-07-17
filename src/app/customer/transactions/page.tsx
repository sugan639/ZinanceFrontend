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
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
} from '@mui/material';

interface Transaction {
  transactionId: string | null;
  transactionReferenceNumber: string;
  type: string;
  amount: string;
  closingBalance: string;
  doneBy: string;
  userId: string;
  timestamp: string;
  status: string;
}

interface GroupedTransactions {
  [accountNumber: string]: Transaction[];
}

export default function FindTransactionsPage() {
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[] | GroupedTransactions | null>(null);
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
      .catch(() => (window.location.href = '/login'))
      .finally(() => setLoading(false));
  }, []);

  const fetchTransactions = async (params: {
    transaction_id?: string;
    transaction_reference_number?: string;
    customer_id?: number;
    account_number?: number;
    from_date?: number;
    to_date?: number;
    limit?: number;
    offset?: number;
  }) => {
    setLoading(true);
    setMessage('');
    setTransactions(null);
    setError('');

    try {
      const response = await axios.post(CUSTOMER_TRANSACTIONS_URL, params, { withCredentials: true });

      if (response.data.transactions) {
        // Coerce transactionId and transactionReferenceNumber to strings
        const coerceToStrings = (tx: any): Transaction => ({
          ...tx,
          transactionId: tx.transactionId != null ? String(tx.transactionId) : null,
          transactionReferenceNumber: String(tx.transactionReferenceNumber),
          amount: String(tx.amount),
          closingBalance: String(tx.closingBalance),
          timestamp: String(tx.timestamp),
          userId: String(tx.userId),
          type: String(tx.type),
          doneBy: String(tx.doneBy),
          status: String(tx.status),
        });

        let processedTransactions: Transaction[] | GroupedTransactions;
        if (Array.isArray(response.data.transactions)) {
          processedTransactions = response.data.transactions.map(coerceToStrings);
        } else {
          processedTransactions = {};
          Object.entries(response.data.transactions).forEach(([account, txList]) => {
            processedTransactions[account] = (txList as any[]).map(coerceToStrings);
          });
        }
        
      

        setTransactions(processedTransactions);
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

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <Loading message="Loading transactions..." />
    </div>
  );
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <Sidebar />
      <TopBar user={user} />
      <ProfileDrawer user={user} />
      <main className="pl-64 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">Transaction History</h1>
            <p className="mt-2 text-lg text-gray-600">View and search your past transactions with ease.</p>
          </header>
          <section className="bg-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl animate-slide-up">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Transactions</h2>
            <TransactionSearchForm onSubmit={handleSearch} message={message} />
            {message && (
              <div
                className="mt-4 p-4 rounded-lg text-sm font-medium animate-fade-in bg-blue-100 text-blue-700"
                role="alert"
              >
                {message}
              </div>
            )}
            {error && <ErrorMessage message={error} onClose={() => setError('')} />}
          </section>
          {transactions && (
            <section className="mt-8 bg-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl animate-slide-up">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Transaction Results</h2>
              {Array.isArray(transactions) ? (
                <TransactionTable transactions={transactions} />
              ) : (
                Object.entries(transactions).map(([acct, txList]: [string, Transaction[]]) => (
                  <div key={acct} className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Account: {acct}</h3>
                    <TransactionTable transactions={txList} />
                  </div>
                ))
              )}
              <div className="flex justify-between mt-6">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handlePageChange(Math.max(0, currentOffset - LIMIT))}
                  disabled={currentOffset === 0}
                  sx={{ px: 4, py: 1.5 }}
                  aria-label="Previous page"
                >
                  Previous
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handlePageChange(currentOffset + LIMIT)}
                  disabled={!transactions || (Array.isArray(transactions) && transactions.length < LIMIT)}
                  sx={{ px: 4, py: 1.5 }}
                  aria-label="Next page"
                >
                  Next
                </Button>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <Table stickyHeader aria-label="Transaction history table">
        <TableHead>
          <TableRow>
            {['Txn ID', 'Ref No', 'Type', 'Amount', 'Balance', 'By', 'UID', 'Timestamp', 'Status'].map((header) => (
              <TableCell
                key={header}
                sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white', py: 2 }}
                align="left"
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((tx, idx) => (
            <TableRow
              key={tx.transactionReferenceNumber}
              sx={{ backgroundColor: idx % 2 === 0 ? 'white' : '#e3f2fd' }}
            >
              <TableCell sx={{ py: 1.5 }}>{tx.transactionId || 'N/A'}</TableCell>
              <TableCell sx={{ py: 1.5, fontFamily: 'monospace' }}>{tx.transactionReferenceNumber}</TableCell>
              <TableCell sx={{ py: 1.5 }}>{tx.type.replace(/_/g, ' ')}</TableCell>
              <TableCell sx={{ py: 1.5 }}>₹{parseFloat(tx.amount).toFixed(2)}</TableCell>
              <TableCell sx={{ py: 1.5 }}>₹{parseFloat(tx.closingBalance).toFixed(2)}</TableCell>
              <TableCell sx={{ py: 1.5 }}>{tx.doneBy}</TableCell>
              <TableCell sx={{ py: 1.5 }}>{tx.userId}</TableCell>
              <TableCell sx={{ py: 1.5 }}>{new Date(Number(tx.timestamp)).toLocaleString()}</TableCell>
              <TableCell sx={{ py: 1.5 }}>
                <Chip
                  label={tx.status}
                  color={tx.status === 'SUCCESS' ? 'success' : 'error'}
                  size="small"
                  sx={{ fontWeight: 'medium' }}
                  aria-label={`Transaction status: ${tx.status}`}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}