'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '@/app/Loading';
import { CUSTOMER_DASHBOARD_SUMMARY, CUSTOMER_PROFILE_URL } from '@/lib/constants';
import TopBar from '../customerComponents/TopBar';
import Sidebar from '../customerComponents/SideBar';
import ProfileDrawer from '../customerComponents/ProfileDrawer';

import {
  Grid as Grid,
  Card as MuiCard,
  CardContent,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
} from '@mui/material';

export default function CustomerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndSummary = async () => {
      try {
        const [profileRes, summaryRes] = await Promise.all([
          axios.get(CUSTOMER_PROFILE_URL, { withCredentials: true }),
          axios.get(CUSTOMER_DASHBOARD_SUMMARY, { withCredentials: true }),
        ]);

        setUser(profileRes.data);
        setSummary(summaryRes.data);
      } catch (err) {
        console.error('Dashboard fetch failed:', err);
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndSummary();
  }, []);

  if (loading) return <Loading message="Loading dashboard..." />;
  if (!user || !summary) return null;

  return (
    <>
      <Sidebar />
      <TopBar user={user} />
      <ProfileDrawer user={user} />

      <main className="pl-64 pt-20 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Welcome Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" className="text-3xl font-bold text-gray-800">
              Welcome, {user.name}
            </Typography>
            <Typography variant="subtitle1" className="text-gray-600 mt-2">
              Here is your financial summary and recent activity
            </Typography>
          </Box>

          {/* Summary Card */}
          <Grid container spacing={4} columns={12} sx={{ mb: 6 }}>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <SummaryCard
                label="Total Available Balance"
                 value={
                          summary.totalBalance
                            ? parseFloat(summary.totalBalance)
                                .toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            : '0.00'
                        }
                color="#7393B3" 
              />
            </Grid>
          </Grid>

          {/* Recent Transactions */}
          <Paper elevation={3} className="p-6 rounded-xl">
            <Typography variant="h6" className="text-xl font-semibold text-gray-800 mb-4">
              Recent Transactions
            </Typography>
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHead>
                  <TableRow className="bg-gray-100">
                    <TableCell className="font-medium text-gray-700">Date</TableCell>
                    <TableCell className="font-medium text-gray-700">Account</TableCell>
                    <TableCell className="font-medium text-gray-700">Type</TableCell>
                    <TableCell className="font-medium text-gray-700 text-right">Amount</TableCell>
                    <TableCell className="font-medium text-gray-700 text-right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className="divide-y divide-gray-200">
                  {summary.recentTransactions && summary.recentTransactions.length > 0 ? (
                    summary.recentTransactions.map((txn: any, index: number) => (
                      <TableRow
                        key={`${txn.transactionReferenceNumber}-${txn.accountNumber}-${txn.timestamp}`}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        <TableCell className="px-4 py-3 text-gray-800">
                          {new Date(txn.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-800">{txn.accountNumber}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-800">
                          {txn.type.replace(/_/g, ' ')}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right text-gray-800 font-medium">
                          ₹{parseFloat(txn.amount || 0).toFixed(2)}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right">
                          <Chip
                            label={txn.status}
                            color={txn.status === 'SUCCESS' ? 'success' : 'error'}
                            size="small"
                            sx={{ color: 'white', fontWeight: 'bold' }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                        No recent transactions found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Paper>
        </div>
      </main>
    </>
  );
}

// Summary Card Component - Fixed with real CSS color
function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string; // e.g., '#1976d2'
}) {
  return (
    <MuiCard
      sx={{
        background: `linear-gradient(to right, ${color}, ${color.replace('d2', 'e6')})`, // lighter shade
        color: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          sx={{ opacity: 0.9 }}
        >
          {label}
        </Typography>
        <Typography
          variant="h4"
          component="div"
          className="mt-2 font-bold"
        >
          {value}
        </Typography>
      </CardContent>
    </MuiCard>
  );
}