// --- Updated FindTransactionsPage.tsx ---
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { EMPLOYEE_PROFILE_URL, EMPLOYEE_FIND_TRANSACTIONS_URL } from '@/lib/constants';
import Loading from '@/app/Loading';
import ErrorMessage from '@/app/ErrorMessage';
import TransactionSearchForm from '../employeeComponents/TransactionSearchForm';
import ProfileDrawer from '../employeeComponents/ProfileDrawer';
import Sidebar from '../employeeComponents/SideBar';
import TopBar from '../employeeComponents/TopBar';

import {
  Box,
  Typography,
  Card,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';

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
      .get(EMPLOYEE_PROFILE_URL, { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => (window.location.href = '/login'))
      .finally(() => setLoading(false));
  }, []);

  const fetchTransactions = async (params: any) => {
    setLoading(true);
    setMessage('');
    setTransactions(null);
    setError('');

    try {
      const response = await axios.post(EMPLOYEE_FIND_TRANSACTIONS_URL, params, { withCredentials: true });
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
      <TopBar user={user} />
      <ProfileDrawer user={user} />

      <main className="pl-64 pt-20 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
              <ReceiptIcon fontSize="large" /> Transaction History
            </Typography>
            <Typography variant="subtitle1" className="text-gray-600 mt-2">
              Search and view transaction records
            </Typography>
          </Box>

          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', mb: 3 }}>
                <SearchIcon fontSize="small" /> Search Transactions
              </Typography>
              <TransactionSearchForm onSubmit={handleSearch} message={message} />
              {error && <ErrorMessage message={error} onClose={() => setError('')} />}
            </CardContent>
          </Card>

          {transactions && (
            <Card elevation={3} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', mb: 3 }}>
                  Transaction Results
                </Typography>

                {Array.isArray(transactions) ? (
                  <TransactionTable transactions={transactions} />
                ) : (
                  Object.entries(transactions).map(([acct, txList]) => {
                    if (!Array.isArray(txList)) return null;
                    return (
                      <div key={acct} className="mb-8">
                        <Typography variant="h6" className="font-semibold mb-3 text-blue-800">
                          Account: {acct}
                        </Typography>
                        <TransactionTable transactions={txList} />
                      </div>
                    );
                  })
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    variant="outlined"
                    disabled={currentOffset === 0}
                    onClick={() => handlePageChange(Math.max(0, currentOffset - LIMIT))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handlePageChange(currentOffset + LIMIT)}
                  >
                    Next
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  );
}

function TransactionTable({ transactions }: { transactions: any[] }) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {['Txn ID', 'Type', 'Amount', 'Balance', 'By', 'UID', 'Timestamp', 'Status'].map((header) => (
              <TableCell key={header} sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                No transactions found.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((tx, idx) => (
              <TableRow key={tx.transactionId || idx} hover>
                <TableCell>{tx.transactionId || 'N/A'}</TableCell>
                <TableCell>{tx.type.replace(/_/g, ' ')}</TableCell>
                <TableCell sx={{ color: tx.type.includes('DEBIT') ? '#d32f2f' : '#2e7d32' }}>
                  ₹{parseFloat(tx.amount).toFixed(2)}
                </TableCell>
                <TableCell>₹{parseFloat(tx.closingBalance).toFixed(2)}</TableCell>
                <TableCell>{tx.doneBy}</TableCell>
                <TableCell>{tx.userId}</TableCell>
                <TableCell>{new Date(Number(tx.timestamp)).toLocaleString()}</TableCell>
                <TableCell>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    tx.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {tx.status}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
