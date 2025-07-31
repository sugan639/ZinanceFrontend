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
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Skeleton,
  IconButton,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DataTable from '@/app/common/components/DataTable';

// Define types
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

type TransactionsType = DisplayTransaction[] | { [accountNumber: string]: DisplayTransaction[] };

// Define columns for DataTable
const transactionColumns = [
  {
    key: 'fromAccount' as const,
    label: 'From Account',
    render: (row: DisplayTransaction) => (
      <span className="font-mono text-gray-800">{row.fromAccount}</span>
    ),
  },
  {
    key: 'toAccount' as const,
    label: 'To Account',
    render: (row: DisplayTransaction) => (
      <span className="font-mono text-gray-800">{row.toAccount}</span>
    ),
  },
  {
    key: 'amount' as const,
    label: 'Amount',
    align: 'right' as const,
    format: (value: string) => `₹${parseFloat(value).toFixed(2)}`,
  },
  {
    key: 'type' as const,
    label: 'Type',
    render: (row: DisplayTransaction) => {
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            row.type === 'Credit'
              ? 'text-green-700'
              : ' text-red-700'
          }`}
        >
          {row.type}
        </span>
      );
    },
  },
  {
    key: 'timestamp' as const,
    label: 'Time',
    format: (value: string) => new Date(Number(value)).toLocaleString(),
  },
];

export default function FindTransactionsPage() {
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<TransactionsType | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [lastParams, setLastParams] = useState<any>(null);
  const LIMIT = 10;

  // Fetch user profile
  useEffect(() => {
    axios
      .get(CUSTOMER_PROFILE_URL, { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => (window.location.href = '/login'))
      .finally(() => setLoading(false));
  }, []);

  // Fetch transactions
  const fetchTransactions = async (params: any) => {
    // Always show skeleton during fetch
    setTransactions(null);
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post(CUSTOMER_TRANSACTIONS_URL, params, { withCredentials: true });

      if (response.data.transactions) {
        let processed: TransactionsType;

        const txData = response.data.transactions;

        if (params.transaction_id) {
          const debitTx = txData.debit_transaction;
          const creditTx = txData.credit_transaction;

          if (debitTx) {
            processed = [
              {
                fromAccount: debitTx.accountNumber,
                toAccount: creditTx?.beneficiaryAccountNumber || 'Unknown',
                amount: debitTx.amount,
                type: 'Debit',
                timestamp: debitTx.timestamp,
              },
            ];
          } else if (creditTx) {
            processed = [
              {
                fromAccount: creditTx.beneficiaryAccountNumber || 'Unknown',
                toAccount: creditTx.accountNumber,
                amount: creditTx.amount,
                type: 'Credit',
                timestamp: creditTx.timestamp,
              },
            ];
          } else {
            processed = [];
          }
        } else if (Array.isArray(txData)) {
          const accountNum = params.account_number || 'Unknown Account';
          processed = {};
          processed[accountNum] = txData.map((tx: ApiTransaction) => ({
            fromAccount: tx.type === 'INTRA_BANK_DEBIT' ? tx.accountNumber : tx.beneficiaryAccountNumber,
            toAccount: tx.type === 'INTRA_BANK_CREDIT' ? tx.accountNumber : tx.beneficiaryAccountNumber,
            amount: tx.amount,
            type: tx.type === 'INTRA_BANK_DEBIT' ? 'Debit' : 'Credit',
            timestamp: tx.timestamp,
          }));
        } else {
          processed = {};
          Object.entries(txData).forEach(([account, txList]: [string, ApiTransaction[]]) => {
            if (Array.isArray(txList)) {
              processed[account] = txList.map((tx: ApiTransaction) => ({
                fromAccount: tx.type === 'INTRA_BANK_DEBIT' ? tx.accountNumber : tx.beneficiaryAccountNumber,
                toAccount: tx.type === 'INTRA_BANK_CREDIT' ? tx.accountNumber : tx.beneficiaryAccountNumber,
                amount: tx.amount,
                type: tx.type === 'INTRA_BANK_DEBIT' ? 'Debit' : 'Credit',
                timestamp: tx.timestamp,
              }));
            }
          });
        }

        setTransactions(processed);
        setMessage('');
      } else {
        setMessage('No transactions found.');
        setTransactions([]); // ✅ Not null — indicates search was made
      }
    } catch (e: any) {
      const backendMsg = e?.response?.data?.error || e?.message || 'Unknown error';
      setError(backendMsg);
      setTransactions([]); // ✅ Not null — error after search
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

  // Clear results
  const handleClear = () => {
    setTransactions(null);
    setMessage('');
    setError('');
    setLastParams(null);
    setCurrentOffset(0);
  };



  return (
    <>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
              Transaction History
            </Typography>
            <Typography variant="subtitle1" className="text-gray-600 mt-2">
              View and search your past transactions with ease.
            </Typography>
          </Box>

          {/* Search Form */}
          <section className="bg-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
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

          {/* Results */}
          {transactions === null ? (
            // ✅ Empty state: No search performed yet
            <section>
            
            </section>
          ) : Array.isArray(transactions) ? (
            <section className="mt-8 bg-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Tooltip title="Clear Results">
                  <IconButton
                    onClick={handleClear}
                    size="small"
                    sx={{
                      bgcolor: 'error.light',
                      color: 'white',
                      '&:hover': { bgcolor: 'error.dark' },
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Transaction Results</h2>
              <DataTable
                columns={transactionColumns}
                data={transactions}
                noDataMessage="No transactions found."
              />
          
            </section>
          ) : (
            Object.keys(transactions).length > 0 && (
              <section className="mt-8 bg-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                  <Tooltip title="Clear Results">
                    <IconButton
                      onClick={handleClear}
                      size="small"
                      sx={{
                        bgcolor: 'error.light',
                        color: 'white',
                        '&:hover': { bgcolor: 'error.dark' },
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Transaction Results</h2>
                {Object.entries(transactions).map(([acct, txList]) => (
                  <div key={acct} className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Account: {acct}</h3>
                    <DataTable
                      columns={transactionColumns}
                      data={txList}
                      noDataMessage="No transactions for this account."
                    />
                  </div>
                ))}
             
              </section>
            )
          )}
        </div>
    </>
  );
}

