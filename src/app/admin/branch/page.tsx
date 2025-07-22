'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/app/admin/components/SideBar';
import TopBar from '@/app/admin/components/TopBar';
import ProfileDrawer from '@/app/admin/components/ProfileDrawer';
import Loading from '@/app/admin/components/Loading';
import axios from 'axios';
import { ADMIN_PROFILE_URL } from '@/lib/constants';

// Icons
import BusinessIcon from '@mui/icons-material/Business';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// MUI Components
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Alert,
  AlertTitle,
} from '@mui/material';

/* ─────────────────────────────────── API ENDPOINTS ─────────────────────────────────── */
const CREATE_URL = 'http://localhost:8080/Banking_App/admin/branch/create';
const GET_URL = 'http://localhost:8080/Banking_App/admin/branches/ifsc-code';
const UPDATE_URL = 'http://localhost:8080/Banking_App/admin/branches';

/* ────────────────────────────────── Types & Interfaces ────────────────────────────────── */
interface Branch {
  branchId: string;
  adminId: string;
  bankName: string;
  location: string;
  ifscCode: string;
  createdAt: string;
  modifiedAt: string;
  modifiedBy: string;
}

export default function BranchPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Create Branch Form
  const [createForm, setCreateForm] = useState({
    new_admin_id: '',
    bank_name: '',
    location: '',
  });

  // Search & Update State
  const [searchId, setSearchId] = useState('');
  const [updateForm, setUpdateForm] = useState<Partial<Branch>>({});
  const [branch, setBranch] = useState<Branch | null>(null);

  // Feedback Messages
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isCreated, setIsCreated] = useState(false); // Track if branch was created

  const resetFeedback = () => {
    setMessage('');
    setError('');
  };

  /* ───────────── Auth Check ───────────── */
  useEffect(() => {
    axios
      .get(ADMIN_PROFILE_URL, { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => (window.location.href = '/login'))
      .finally(() => setLoading(false));
  }, []);

  /* ───────────── Handlers ───────────── */

  const handleCreate = async () => {
    resetFeedback();
    setIsCreated(false);
    try {
      const res = await axios.post(CREATE_URL, createForm, { withCredentials: true });
      setBranch(res.data);
      setMessage(res.data.message || 'Branch created successfully!');
      setIsCreated(true); // Mark as newly created
      setUpdateForm({}); // Reset update form
      setCreateForm({ new_admin_id: '', bank_name: '', location: '' }); // Clear form
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to create branch.');
    }
  };

  const handleSearch = async () => {
    resetFeedback();
    setIsCreated(false); // Never show "created" after search
    if (!searchId.trim()) return setError('Please enter an IFSC code.');

    try {
      const res = await axios.get(`${GET_URL}?ifsccode=${searchId}`, { withCredentials: true });
      setBranch(res.data);
      setUpdateForm({
        branchId: res.data.branchId,
        bankName: res.data.bankName,
        location: res.data.location,
        adminId: res.data.adminId,
        ifscCode: res.data.ifscCode,
      });
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Branch not found.');
      setBranch(null);
      setUpdateForm({});
    }
  };

  const handleUpdate = async () => {
    resetFeedback();
    if (!updateForm.branchId) return setError('Branch ID is required for update.');

    const payload = {
      branch_id: updateForm.branchId,
      bank_name: updateForm.bankName,
      location: updateForm.location,
      admin_id: updateForm.adminId,
      ifsc_code: updateForm.ifscCode,
    };

    try {
      const res = await axios.put(UPDATE_URL, payload, { withCredentials: true });
      setBranch(res.data);
      setMessage('Branch updated successfully!');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Update failed.');
    }
  };

  const clearCreate = () => {
    setCreateForm({ new_admin_id: '', bank_name: '', location: '' });
    resetFeedback();
  };

  const clearUpdate = () => {
    setUpdateForm({});
    setBranch(null);
    setSearchId('');
    resetFeedback();
    setIsCreated(false);
  };

  /* ───────────── Loading State ───────────── */
  if (loading) return <Loading message="Loading branch management..." />;

  return (
    <>
      <Sidebar />
      <div className="flex-1">
        <TopBar />
        <ProfileDrawer user={user} />

        <main className="pl-64 pt-20 p-6 space-y-8 bg-gray-50 min-h-screen">
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" component="h1" className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
              <BusinessIcon fontSize="large" /> Branch Management
            </Typography>
            <Typography variant="subtitle1" className="text-gray-600 mt-2">
              Create, search, and manage bank branches
            </Typography>
          </Box>

          {/* Success & Error Alerts */}
          {message && !isCreated && (
            <Alert severity="success" icon={<CheckCircleOutlineIcon />} sx={{ mb: 3 }}>
              <AlertTitle>Success</AlertTitle>
              {message}
            </Alert>
          )}
          {error && (
            <Alert severity="error" icon={<ErrorOutlineIcon />} sx={{ mb: 3 }}>
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          )}

          {/* Create Branch Section */}
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardHeader
              avatar={<AddCircleOutlineIcon color="primary" />}
              title={
                <Typography variant="h6" fontWeight="bold" color="#1976d2">
                  Create New Branch
                </Typography>
              }
              action={
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<ClearIcon />}
                  onClick={clearCreate}
                  size="small"
                  sx={{ borderRadius: '8px' }}
                >
                  Clear
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Admin ID"
                    placeholder="Enter Admin ID"
                    type="number"
                    value={createForm.new_admin_id}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, new_admin_id: e.target.value })
                    }
                    variant="outlined"
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Bank Name"
                    placeholder="e.g., Zinance Bank"
                    value={createForm.bank_name}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, bank_name: e.target.value })
                    }
                    variant="outlined"
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Location"
                    placeholder="e.g., Mumbai"
                    value={createForm.location}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, location: e.target.value })
                    }
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
                  onClick={handleCreate}
                  size="large"
                  sx={{ borderRadius: '8px' }}
                >
                  Create Branch
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Get / Update Branch Section */}
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardHeader
              avatar={<SearchIcon color="primary" />}
              title={
                <Typography variant="h6" fontWeight="bold" color="#1976d2">
                  Search & Update Branch
                </Typography>
              }
              action={
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<ClearIcon />}
                  onClick={clearUpdate}
                  size="small"
                  sx={{ borderRadius: '8px' }}
                >
                  Clear
                </Button>
              }
            />
            <Divider />
            <CardContent>
              {/* Search Input */}
              <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    label="IFSC Code"
                    placeholder="e.g., ZIN2CA4494"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
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
                    onClick={handleSearch}
                    size="large"
                    sx={{ height: '100%', borderRadius: '8px' }}
                  >
                    Fetch
                  </Button>
                </Grid>
              </Grid>

              {/* Update Form */}
              {branch && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', mt: 3 }}>
                    <EditIcon fontSize="small" /> Update Branch Details
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Branch ID"
                        value={updateForm.branchId || ''}
                        disabled
                        variant="outlined"
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            backgroundColor: '#f5f5f5',
                            cursor: 'not-allowed',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Bank Name"
                        value={updateForm.bankName || ''}
                        onChange={(e) =>
                          setUpdateForm({ ...updateForm, bankName: e.target.value })
                        }
                        variant="outlined"
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Location"
                        value={updateForm.location || ''}
                        onChange={(e) =>
                          setUpdateForm({ ...updateForm, location: e.target.value })
                        }
                        variant="outlined"
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Admin ID"
                        type="number"
                        value={updateForm.adminId || ''}
                        onChange={(e) =>
                          setUpdateForm({ ...updateForm, adminId: e.target.value })
                        }
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
                      startIcon={<EditIcon />}
                      onClick={handleUpdate}
                      size="large"
                      sx={{ borderRadius: '8px' }}
                    >
                      Update Branch
                    </Button>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>

          {/* Show "Branch Created" card ONLY after creation */}
          {isCreated && branch && (
            <Card elevation={3} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  ✅ Branch Created Successfully
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography><strong>Admin ID:</strong> {branch.adminId}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography><strong>Bank Name:</strong> {branch.bankName}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography><strong>Location:</strong> {branch.location}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography><strong>IFSC Code:</strong> {branch.ifscCode}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography><strong>Modified By:</strong> {branch.modifiedBy}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography><strong>Created At:</strong> {new Date(Number(branch.createdAt)).toLocaleString()}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </>
  );
}