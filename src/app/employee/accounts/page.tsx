'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import Sidebar from '../employeeComponents/SideBar';
import TopBar from '../employeeComponents/TopBar';
import ProfileDrawer from '../employeeComponents/ProfileDrawer';
import Loading from '@/app/Loading';

import {
  EMPLOYEE_PROFILE_URL,
  GET_ACCOUNTS_BY_EMPLOYEE,
  UPDATE_ACCOUNT_STATUS_BY_EMPLOYEE,
  CREATE_NEW_ACCOUNT_BY_EMPLOYEE,
} from '@/lib/constants';

import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Grid,
  Card,
  CardContent,
  Alert,
  AlertTitle,
  Divider,
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import EditIcon from '@mui/icons-material/Edit';

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
    if (!customerId.trim()) return setError('Please enter a Customer ID.');

    try {
      const res = await axios.get(`${GET_ACCOUNTS_BY_EMPLOYEE}${customerId}`, { withCredentials: true });
      const normalized = (res.data.accounts || []).map((acc: any) => ({
        account_number: acc.accountNumber || acc.account_number,
        balance: acc.balance,
        status: acc.status,
        created_at: acc.createdAt || acc.created_at,
      }));
      setAccounts(normalized);
      setMessage(`Found ${normalized.length} account(s).`);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to fetch accounts');
      setAccounts([]);
    }
  };

  const handleStatusChange = async (account_number: number, operation: 'ACTIVATE' | 'INACTIVATE') => {
    setError('');
    setMessage('');
    try {
      const payload = { account_number, operation };
      const res = await axios.post(UPDATE_ACCOUNT_STATUS_BY_EMPLOYEE, payload, { withCredentials: true });
      setMessage(res.data.message || `Account ${operation.toLowerCase()}d successfully.`);
      fetchAccounts(); // Refresh list
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Status update failed');
    }
  };

  const handleCreateAccount = async () => {
    setError('');
    setMessage('');
    const { user_id, branch_id, balance } = newAccountForm;

    if (!user_id || !branch_id || !balance) {
      setError('All fields are required.');
      return;
    }

    try {
      const payload = {
        user_id: Number(user_id),
        branch_id: Number(branch_id),
        balance: Number(balance),
      };

      const res = await axios.post(CREATE_NEW_ACCOUNT_BY_EMPLOYEE, payload, { withCredentials: true });
      setMessage(res.data.message || 'New account created successfully!');
      setNewAccountForm({ user_id: '', branch_id: '', balance: '' });
      if (customerId) fetchAccounts(); // Refresh if viewing same customer
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

      <main className="pl-64 pt-20 bg-gray-50 min-h-screen p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" component="h1" className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
              <AccountBalanceIcon fontSize="large" /> Account Management
            </Typography>
            <Typography variant="subtitle1" className="text-gray-600 mt-2">
              Create new accounts and manage existing ones
            </Typography>
          </Box>

          {/* Success & Error Messages */}
          {message && (
            <Alert severity="success" icon={<CheckCircleOutlineIcon />} sx={{ mb: 3 }}>
              {message}
            </Alert>
          )}
          {error && (
            <Alert severity="error" icon={<ErrorOutlineIcon />} sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Fetch Accounts Section */}
          <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', mb: 3 }}>
                <SearchIcon fontSize="small" /> Get Accounts by Customer ID
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    label="Customer ID"
                    placeholder="Enter customer ID"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    type="text"
                    variant="outlined"
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={<SearchIcon />}
                    onClick={fetchAccounts}
                    size="large"
                    sx={{ height: '100%', borderRadius: '8px' }}
                  >
                    Fetch
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Accounts Table */}
          {accounts.length > 0 && (
            <Card elevation={3} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  📋 Account List
                </Typography>
                <TableContainer
                  component={Paper}
                  sx={{
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                  }}
                >
                  <Table stickyHeader aria-label="accounts table">
                    <TableHead>
                      <TableRow>
                        {['Account Number', 'Balance', 'Status', 'Created At', 'Actions'].map((header) => (
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
                      {accounts.map((acc) => (
                        <TableRow
                          key={acc.account_number}
                          hover
                          sx={{
                            '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                            '&:hover': { backgroundColor: '#f0f8ff !important' },
                          }}
                        >
                          <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                            {acc.account_number}
                          </TableCell>
                          <TableCell>₹{parseFloat(acc.balance).toFixed(2)}</TableCell>
                          <TableCell>
                            <Chip
                              label={acc.status}
                              color={acc.status === 'ACTIVE' ? 'success' : 'error'}
                              size="small"
                              sx={{ color: 'white', fontWeight: 'bold' }}
                            />
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                            {acc.created_at
                              ? new Date(Number(acc.created_at)).toLocaleString('en-IN')
                              : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                onClick={() => handleStatusChange(acc.account_number, 'ACTIVATE')}
                                disabled={acc.status === 'ACTIVE'}
                                sx={{ fontSize: '0.75rem', px: 1.5 }}
                              >
                                Activate
                              </Button>
                              <Button
                                size="small"
                                variant="contained"
                                color="error"
                                onClick={() => handleStatusChange(acc.account_number, 'INACTIVATE')}
                                disabled={acc.status === 'INACTIVE'}
                                sx={{ fontSize: '0.75rem', px: 1.5 }}
                              >
                                Deactivate
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}

          {/* Create New Account */}
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', mb: 3 }}>
                <AddCircleOutlineIcon fontSize="small" /> Create New Account
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Customer User ID"
                    placeholder="e.g., 100000039"
                    value={newAccountForm.user_id}
                    onChange={(e) =>
                      setNewAccountForm({ ...newAccountForm, user_id: e.target.value })
                    }
                    type="number"
                    variant="outlined"
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Branch ID"
                    placeholder="e.g., 900001"
                    value={newAccountForm.branch_id}
                    onChange={(e) =>
                      setNewAccountForm({ ...newAccountForm, branch_id: e.target.value })
                    }
                    type="number"
                    variant="outlined"
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Initial Balance"
                    placeholder="e.g., 5000"
                    value={newAccountForm.balance}
                    onChange={(e) =>
                      setNewAccountForm({ ...newAccountForm, balance: e.target.value })
                    }
                    type="number"
                    variant="outlined"
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={handleCreateAccount}
                  size="large"
                  sx={{ borderRadius: '8px' }}
                >
                  Create Account
                </Button>
              </Box>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}