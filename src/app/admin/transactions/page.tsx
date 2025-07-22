'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/app/admin/components/SideBar';
import TopBar from '@/app/admin/components/TopBar';
import ProfileDrawer from '@/app/admin/components/ProfileDrawer';
import axios from 'axios';
import { ADMIN_PROFILE_URL, FIND_TRANSACTIONS_URL } from '@/lib/constants';
import TransactionSearchForm from '@/app/admin/components/TransactionSearchForm';
import ErrorMessage from '@/app/admin/components/ErrorMessage';
import Loading from '../components/Loading';

import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';

// Define types
interface ApiTransaction {
  transactionId: string | null;
  type: string;
  amount: string;
  closingBalance: string;
  doneBy: string;
  userId: string;
  timestamp: string;
  status: string;
  accountNumber: string;
}

// Union type for response shape
type TransactionsResponse =
  | { [accountNumber: string]: ApiTransaction[] } // grouped
  | ApiTransaction[]; // flat array

export default function FindTransactionsPage() {
  const [user, setUser] = useState<any>(null);
  const [allTransactions, setAllTransactions] = useState<{ [key: string]: ApiTransaction[] } | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [availableAccounts, setAvailableAccounts] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [lastParams, setLastParams] = useState<any>(null);

  const LIMIT = 10;

  useEffect(() => {
    axios
      .get(ADMIN_PROFILE_URL, { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => (window.location.href = '/login'))
      .finally(() => setLoading(false));
  }, []);

  const fetchTransactions = async (params: any) => {
    setLoading(true);
    setMessage('');
    setAllTransactions(null);
    setSelectedAccount('');
    setAvailableAccounts([]);
    setError('');

    try {
      const response = await axios.post(FIND_TRANSACTIONS_URL, params, { withCredentials: true });

      if (!response.data.transactions || response.data.transactions.length === 0) {
        setMessage('No transactions found.');
        return;
      }

      const rawData: TransactionsResponse = response.data.transactions;

      let normalizedData: { [key: string]: ApiTransaction[] };

      if (Array.isArray(rawData)) {
        // Case 1: Flat array → group by accountNumber
        normalizedData = {};
        rawData.forEach((tx) => {
          if (!normalizedData[tx.accountNumber]) {
            normalizedData[tx.accountNumber] = [];
          }
          normalizedData[tx.accountNumber].push(tx);
        });
      } else {
        // Case 2: Already grouped
        normalizedData = rawData;
      }

      setAllTransactions(normalizedData);

      const accounts = Object.keys(normalizedData);
      setAvailableAccounts(accounts);

      if (accounts.length > 0) {
        setSelectedAccount(accounts[0]);
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

  const handleAccountChange = (event: any) => {
    setSelectedAccount(event.target.value as string);
  };

  const handleResetForm = () => {
  setAllTransactions(null);
  setSelectedAccount('');
  setAvailableAccounts([]);
  setMessage('');
  setError('');
  setLastParams(null);
  setCurrentOffset(0);
};


  if (loading) return <Loading message="Loading transactions..." />;
  if (!user) return null;

  const currentTxns = selectedAccount && allTransactions ? allTransactions[selectedAccount] : [];

  return (
    <>
      <Sidebar />
      <TopBar />
      <ProfileDrawer user={user} />

      <main className="pl-64 pt-20 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <header className="mb-8 text-center">
            <Typography variant="h4" component="h1" className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
              <ReceiptIcon /> Transaction History
            </Typography>
            <Typography variant="subtitle1" className="text-gray-600 mt-2">
              Search and manage customer transactions
            </Typography>
          </header>

          {/* Search Form */}
          <section className="bg-white shadow-lg rounded-xl p-6 mb-8 transition-all duration-300 hover:shadow-xl">
            <Typography variant="h6" className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <SearchIcon /> Search Transactions
            </Typography>
            <TransactionSearchForm onSubmit={handleSearch} onReset={handleResetForm} message={message} />
            {error && <ErrorMessage message={error} onClose={() => setError('')} />}
          </section>

          {/* Results Section */}
          {allTransactions && (
            <section className="bg-white shadow-lg rounded-xl p-6 transition-all duration-300 hover:shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                <Typography variant="h6" className="font-semibold text-gray-700">
                  Select Account
                </Typography>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Account Number</InputLabel>
                  <Select
                    value={selectedAccount}
                    label="Account Number"
                    onChange={handleAccountChange}
                    slotProps={{
                      input: { sx: { borderRadius: '8px' } },
                    }}
                  >
                    {availableAccounts.map((acc) => (
                      <MenuItem key={acc} value={acc}>
                        {acc}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {currentTxns.length > 0 ? (
                <TransactionTable transactions={currentTxns} />
              ) : (
                <p className="text-center text-gray-500 py-4">No transactions for this account.</p>
              )}

              {/* Pagination */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={currentOffset === 0}
                  onClick={() => handlePageChange(Math.max(0, currentOffset - LIMIT))}
                  sx={{ borderRadius: '8px' }}
                >
                  Previous
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handlePageChange(currentOffset + LIMIT)}
                  sx={{ borderRadius: '8px' }}
                >
                  Next
                </Button>
              </Box>
            </section>
          )}
        </div>
      </main>
    </>
  );
}

// Transaction Table Component
function TransactionTable({ transactions }: { transactions: ApiTransaction[] }) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        overflow: 'hidden',
      }}
    >
      <Table stickyHeader aria-label="transaction table">
        <TableHead>
          <TableRow>
            {['Txn ID', 'Type', 'Amount', 'Balance', 'Done By', 'User ID', 'Timestamp', 'Status'].map((header) => (
              <TableCell
                key={header}
                sx={{
                  fontWeight: 'bold',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  py: 1.5,
                  fontSize: '0.875rem',
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((tx, idx) => (
            <TableRow
              key={tx.transactionId || `${idx}`}
              hover
              sx={{
                '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                '&:hover': { backgroundColor: '#f0f8ff !important' },
              }}
            >
              <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                {tx.transactionId || 'N/A'}
              </TableCell>
              <TableCell>{tx.type.replace(/_/g, ' ')}</TableCell>
              <TableCell
                sx={{
                  fontWeight: 'medium',
                  color:
                    tx.type.includes('DEBIT') || tx.type === 'WITHDRAWAL'
                      ? '#d32f2f'
                      : '#2e7d32',
                }}
              >
                ₹{parseFloat(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </TableCell>
              <TableCell>₹{parseFloat(tx.closingBalance).toFixed(2)}</TableCell>
              <TableCell>{tx.doneBy}</TableCell>
              <TableCell>{tx.userId}</TableCell>
              <TableCell sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                {new Date(Number(tx.timestamp)).toLocaleString()}
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    tx.status === 'SUCCESS'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {tx.status === 'SUCCESS' ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
                  {tx.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}