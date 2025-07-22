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
} from '@mui/material';
import { format } from 'date-fns';

interface ApiTransaction {
  transactionId: string | null;
  transactionReferenceNumber: string;
  type: 'INTRA_BANK_DEBIT' | 'INTRA_BANK_CREDIT';
  amount: string;
  closingBalance: string;
  doneBy: string;
  userId: string;
  timestamp: string;
  status: string;
  accountNumber: string;
  beneficiaryAccountNumber: string;
}

interface DisplayTransaction {
  fromAccount: string;
  toAccount: string;
  amount: string;
  type: 'Debit' | 'Credit';
  timestamp: string;
}

interface GroupedTransactions {
  [accountNumber: string]: ApiTransaction[];
}

export default function FindTransactionsPage() {
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<DisplayTransaction[] | { [accountNumber: string]: DisplayTransaction[] } | null>(null);
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
    customer_id?: string;
    account_number?: string;
    from_date?: number;
    to_date?: number;
    transaction_type?: 'DEBIT' | 'CREDIT';
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
        let processedTransactions: DisplayTransaction[] | { [accountNumber: string]: DisplayTransaction[] };

        if (params.transaction_id) {
          // For BY_ID, merge debit and credit rows into one customer-centric row
          const txs = response.data.transactions as ApiTransaction[];
          if (txs.length !== 2) {
            setMessage('Unexpected transaction data format.');
            return;
          }

          const debitTx = txs.find((tx) => tx.type === 'INTRA_BANK_DEBIT');
          const creditTx = txs.find((tx) => tx.type === 'INTRA_BANK_CREDIT');

          if (!debitTx || !creditTx || debitTx.transactionId !== creditTx.transactionId) {
            setMessage('Invalid debit/credit transaction pair.');
            return;
          }

          const isDebit = debitTx.userId === user?.customerId; // Check if user initiated debit
          const displayTx: DisplayTransaction = {
            fromAccount: debitTx.accountNumber,
            toAccount: creditTx.beneficiaryAccountNumber,
            amount: debitTx.amount,
            type: isDebit ? 'Debit' : 'Credit',
            timestamp: debitTx.timestamp,
          };
          processedTransactions = [displayTx];

        } else {
          // For BY_FILTER, handle grouped (customer_id) or flat (account_number) response
          const txData = response.data.transactions;
          processedTransactions = {};

          if (Array.isArray(txData)) {
            // Specific account: Flat array of ApiTransaction[]
            const account = params.account_number || 'Unknown Account';
            processedTransactions[account] = txData.map((tx: ApiTransaction) => ({
              fromAccount: tx.type === 'INTRA_BANK_DEBIT' ? tx.accountNumber : tx.beneficiaryAccountNumber,
              toAccount: tx.type === 'INTRA_BANK_CREDIT' ? tx.accountNumber : tx.beneficiaryAccountNumber,
              amount: tx.amount,
              type: tx.type === 'INTRA_BANK_DEBIT' ? 'Debit' : 'Credit',
              timestamp: tx.timestamp,
            }));
          } else {
            // All accounts: Grouped object { [accountNumber: string]: ApiTransaction[] }
            const grouped: GroupedTransactions = txData;
            Object.entries(grouped).forEach(([account, txList]) => {
              if (Array.isArray(txList)) {
                processedTransactions[account] = txList.map((tx: ApiTransaction) => ({
                  fromAccount: tx.type === 'INTRA_BANK_DEBIT' ? tx.accountNumber : tx.beneficiaryAccountNumber,
                  toAccount: tx.type === 'INTRA_BANK_CREDIT' ? tx.accountNumber : tx.beneficiaryAccountNumber,
                  amount: tx.amount,
                  type: tx.type === 'INTRA_BANK_DEBIT' ? 'Debit' : 'Credit',
                  timestamp: tx.timestamp,
                }));
              } else {
                setMessage(`Invalid transaction list for account ${account}.`);
              }
            });
          }
        }

        setTransactions(Object.keys(processedTransactions).length > 0 ? processedTransactions : null);
        if (Object.keys(processedTransactions).length === 0) {
          setMessage('No transactions found.');
        }
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
            <TransactionSearchForm onSubmit={handleSearch} message={message} user={user} />
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
                Object.entries(transactions as { [accountNumber: string]: DisplayTransaction[] }).map(
                  ([acct, txList]: [string, DisplayTransaction[]]) => (
                    <div key={acct} className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Account: {acct}</h3>
                      <TransactionTable transactions={txList} />
                    </div>
                  )
                )
              )}
              <div className="flex justify-between mt-6">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handlePageChange(Math.max(0, currentOffset - LIMIT))}
                  disabled={currentOffset === 0}
                  sx={{ px: 4, py: 1.5, borderRadius: '8px', textTransform: 'none' }}
                  aria-label="Previous page"
                >
                  Previous
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handlePageChange(currentOffset + LIMIT)}
                  disabled={!transactions || (Array.isArray(transactions) && transactions.length < LIMIT)}
                  sx={{ px: 4, py: 1.5, borderRadius: '8px', textTransform: 'none' }}
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

function TransactionTable({ transactions }: { transactions: DisplayTransaction[] }) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        overflowX: 'auto',
      }}
    >
      <Table stickyHeader aria-label="Transaction history table">
        <TableHead>
          <TableRow>
            {[
              { label: 'From Account', width: '25%' },
              { label: 'To Account', width: '25%' },
              { label: 'Amount', width: '15%' },
              { label: 'Type', width: '15%' },
              { label: 'Timestamp', width: '20%' },
            ].map((header) => (
              <TableCell
                key={header.label}
                sx={{
                  fontWeight: 'bold',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  py: 2.5,
                  px: 3,
                  width: header.width,
                  fontSize: '0.95rem',
                  borderRight: '1px solid rgba(255,255,255,0.1)',
                }}
                align={header.label === 'Amount' ? 'right' : 'left'}
              >
                {header.label}
              </TableCell>

            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {transactions.map((tx, idx) => (
            <TableRow
              key={`${tx.fromAccount}-${tx.timestamp}`}
              sx={{
                backgroundColor: idx % 2 === 0 ? 'white' : '#e3f2fd',
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                  transition: 'background-color 0.2s ease-in-out',
                },
              }}
            >
              <TableCell
                sx={{
                  py: 2,
                  px: 3,
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  borderRight: '1px solid rgba(0,0,0,0.05)',
                }}
              >
                {tx.fromAccount}
              </TableCell>
              <TableCell
                sx={{
                  py: 2,
                  px: 3,
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  borderRight: '1px solid rgba(0,0,0,0.05)',
                }}
              >
                {tx.toAccount}
              </TableCell>
              <TableCell
                sx={{
                  py: 2,
                  px: 3,
                  color: tx.type === 'Debit' ? '#ef4444' : '#22c55e',
                  fontWeight: 'medium',
                  fontSize: '0.9rem',
                  borderRight: '1px solid rgba(0,0,0,0.05)',
                }}
                align="right"
              >
                ₹{parseFloat(tx.amount).toFixed(2)}
              </TableCell>
              <TableCell
                sx={{
                  py: 2,
                  px: 3,
                  fontSize: '0.9rem',
                  borderRight: '1px solid rgba(0,0,0,0.05)',
                }}
              >
                {tx.type}
              </TableCell>
              <TableCell
                sx={{
                  py: 2,
                  px: 3,
                  fontSize: '0.9rem',
                }}
              >
                {format(Number(tx.timestamp), 'dd/MM/yyyy, HH:mm')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}