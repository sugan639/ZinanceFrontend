'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '@/app/Loading';
import {
  CUSTOMER_DASHBOARD_SUMMARY,
  CUSTOMER_PROFILE_URL,
  CUSTOMER_ACCOUNTS_URL,
  CUSTOMER_TRANSACTIONS_URL,
} from '@/lib/constants';

import { Grid as MuiGrid, Card as MuiCard, CardContent, Typography, Paper, Box } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import DataTable from '@/app/common/components/DataTable';

// Alias Grid for clarity
const Grid = MuiGrid;

// Reusable Summary Card
function SummaryCard({
  label,
  value,
  subText,
  icon,
  color, // e.g., "from-blue-500 to-blue-700"
  textColor = 'white', // default to white
}: {
  label: string;
  value: string | number;
  subText?: string;
  icon: React.ReactNode;
  color: string;
  textColor?: string;
}) {
  const gradientMap: Record<string, string> = {
    'from-blue-500 to-blue-700': 'linear-gradient(to right, #3b82f6, #1d4ed8)',
    'from-green-500 to-emerald-600': 'linear-gradient(to right, #22c55e, #059669)',
    'from-emerald-400 to-green-600': 'linear-gradient(to right, #10b981, #059669)',
    'from-amber-400 to-orange-600': 'linear-gradient(to right, #f59e0b, #ea580c)',
  };

  const background = gradientMap[color] || color || 'linear-gradient(to right, #3b82f6, #1d4ed8)';

  const colorMap: Record<string, string> = {
    'text-black': '#000000',
    'text-white': '#ffffff',
    black: '#000000',
    white: '#ffffff',
  };
  const finalTextColor = colorMap[textColor] || textColor || '#ffffff';

  return (
    <MuiCard
      sx={{
        background,
        color: finalTextColor,
        borderRadius: '16px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.3s ease',
        minHeight: 140,
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2.5,
          p: 3,
          color: finalTextColor,
          height: '100%',
        }}
      >
        <Box
          sx={{
            bgcolor: 'rgba(255,255,255,0.2)',
            borderRadius: '12px',
            p: 1.25,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <div>
          <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
            {label}
          </Typography>
          <Typography variant="h5" component="div" fontWeight="bold" mt="4px">
            {value}
          </Typography>
          {subText && (
            <Typography variant="caption" sx={{ opacity: 0.85, display: 'block', mt: 0.5 }}>
              {subText}
            </Typography>
          )}
        </div>
      </CardContent>
    </MuiCard>
  );
}

export default function CustomerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [profileRes, summaryRes, accountsRes] = await Promise.all([
          axios.get(CUSTOMER_PROFILE_URL, { withCredentials: true }),
          axios.get(CUSTOMER_DASHBOARD_SUMMARY, { withCredentials: true }),
          axios.get(CUSTOMER_ACCOUNTS_URL, { withCredentials: true }),
        ]);

        setUser(profileRes.data);
        setSummary(summaryRes.data);

        const fetchedAccounts = Array.isArray(accountsRes.data.accounts)
          ? accountsRes.data.accounts
          : [];
        setAccounts(fetchedAccounts);

        // Load initial transactions (All Accounts)
        if (summaryRes.data.recentTransactions?.length > 0) {
          setTransactions(
            summaryRes.data.recentTransactions.map((tx: any) => ({
              timestamp: tx.timestamp,
              accountNumber: tx.accountNumber,
              type: tx.type,
              amount: tx.amount,
              status: tx.status,
            }))
          );
        } else {
          setTransactions([]);
        }
      } catch (err) {
        console.error('Dashboard fetch failed:', err);
        window.location.href = '/login'; // Redirect to login on error
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Fetch transactions for selected account
 const fetchTransactions = async (accountNumber: string | null) => {
  setLoading(true);
  try {
    const payload: any = {
      customer_id: user.customerId,
      from_date: 1,
      to_date: Date.now(),
      limit: 5,
    };

    if (accountNumber) {
      payload.account_number = accountNumber;
    }

    const response = await axios.post(CUSTOMER_TRANSACTIONS_URL, payload, {
      withCredentials: true,
    });

    let txList = [];

    if (response.data.transactions) {
      const txs = Array.isArray(response.data.transactions)
        ? response.data.transactions
        : Object.values(response.data.transactions).flat();

      txList = txs.map((tx: any) => ({
        timestamp: tx.timestamp,
        accountNumber: tx.accountNumber,
        type: tx.type,
        amount: tx.amount,
        status: tx.status,
      }));
    }

    // ✅ Always set a new array reference
    setTransactions([...txList]);
  } catch (err) {
    console.error('Failed to fetch transactions:', err);
    setTransactions([]); // ✅ New reference
  } finally {
    setLoading(false);
  }
};

  // Load initial transactions
  useEffect(() => {
    if (user && !selectedAccount) {
      fetchTransactions(null);
    }
  }, [user, selectedAccount]);

  if (!user || !summary) return null;

  return (
<>

        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {/* Welcome Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" className="text-3xl font-bold text-gray-800">
              Welcome, {user.name}
            </Typography>
            <Typography variant="subtitle1" className="text-gray-600 mt-2">
              Here is your financial summary and recent activity
            </Typography>
          </Box>

          {/* Summary Cards */}
          <Grid container spacing={4}>
            {/* Total Balance */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <SummaryCard
                label="Total Balance"
                value={`₹${parseFloat(summary.totalBalance || 0).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
                icon={<AccountBalanceIcon />}
                color="from-green-500 to-emerald-600"
                textColor="text-white"
              />
            </Grid>

            {/* Total Accounts */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <SummaryCard
                label="Total Accounts"
                value= {"0"+accounts.length}
                icon={<CreditScoreIcon />}
                color="from-blue-500 to-blue-700"
                textColor="text-white"
              />
            </Grid>

            {/* Highest Balance Account */}
            {accounts.length > 0 ? (
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard
                  label="Account 1"
                  value={`₹${parseFloat(
                    accounts.reduce((a, b) => (parseFloat(a.balance) > parseFloat(b.balance) ? a : b))
                      .balance
                  ).toFixed(2)}`}
                  subText={`Acc: ${
                    accounts.reduce((a, b) => (parseFloat(a.balance) > parseFloat(b.balance) ? a : b))
                      .accountNumber
                  }`}
                  icon={<TrendingUpIcon />}
                  color="from-emerald-400 to-green-600"
                  textColor="text-white"
                />
              </Grid>
            ) : null}

            {/* Lowest Balance Account */}
            {accounts.length > 0 ? (
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard
                  label="Account 2"
                  value={`₹${parseFloat(
                    accounts.reduce((a, b) => (parseFloat(a.balance) < parseFloat(b.balance) ? a : b))
                      .balance
                  ).toFixed(2)}`}
                  subText={`Acc: ${
                    accounts.reduce((a, b) => (parseFloat(a.balance) < parseFloat(b.balance) ? a : b))
                      .accountNumber
                  }`}
                  icon={<TrendingDownIcon />}
                  color="from-amber-400 to-orange-600"
                  textColor="text-white"
                />
              </Grid>
            ) : null}
          </Grid>

          {/* Recent Transactions */}
          <Paper className="p-6 rounded-2xl shadow-lg bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5">
              <Typography variant="h6" className="text-xl font-semibold text-gray-800">
                Recent Transactions
              </Typography>

              {/* Account Selector */}
              <select
                value={selectedAccount || ''}
                onChange={(e) => {
                  const val = e.target.value || null;
                  setSelectedAccount(val);
                  fetchTransactions(val);
                }}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {accounts.map((acc) => (
                  <option key={acc.accountNumber} value={acc.accountNumber}>
                    {acc.accountNumber} (₹{parseFloat(acc.balance).toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <DataTable

              key={selectedAccount || 'all'} // ✅ Re-renders when account changes

              columns={[
                {
                  key: 'timestamp',
                  label: 'Date',
                  format: (value) => new Date(Number(value)).toLocaleString('en-IN'),
                },
                {
                  key: 'accountNumber',
                  label: 'Account',
                  render: (row) => (
                    <span className="font-mono text-gray-800">{row.accountNumber}</span>
                  ),
                },
                {
                  key: 'type',
                  label: 'Type',
                  render: (row) => {
                    const isDebit = ['WITHDRAWAL', 'INTRA_BANK_DEBIT'].includes(row.type);
                    const isCredit = ['DEPOSIT', 'INTRA_BANK_CREDIT'].includes(row.type);
                    return (
                      <div className="flex items-center gap-1.5">
                        {isDebit ? (
                          <TrendingDownIcon fontSize="small" className="text-red-600" />
                        ) : (
                          <TrendingUpIcon fontSize="small" className="text-green-600" />
                        )}
                        <span
                          className={`font-medium ${
                            isDebit ? 'text-red-700' : isCredit ? 'text-green-700' : 'text-gray-600'
                          }`}
                        >
                          {row.type.replace(/_/g, ' ')}
                        </span>
                      </div>
                    );
                  },
                },
                {
                  key: 'amount',
                  label: 'Amount',
                  align: 'right',
                  format: (value) => `₹${parseFloat(value || 0).toFixed(2)}`,
                },
                {
                  key: 'status',
                  label: 'Status',
                  align: 'right',
                  render: (row) => (
                    <Typography
                      variant="body2"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        color: row.status === 'SUCCESS' ? '#2e7d32' : '#d32f2f',
                        fontWeight: 'bold',
                      }}
                    >
                      {row.status === 'SUCCESS' ? (
                        <CheckIcon fontSize="small" sx={{ mr: 0.5 }} />
                      ) : (
                        <CancelIcon fontSize="small" sx={{ mr: 0.5 }} />
                      )}
                      {row.status}
                    </Typography>
                  ),
                },
              ]}
              data={transactions}
              noDataMessage="No transactions found."
            />
          </Paper>
        </div>
    </>
  );
}