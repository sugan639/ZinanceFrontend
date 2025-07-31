'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/app/admin/components/SideBar';
import TopBar from '@/app/admin/components/TopBar';
import ProfileDrawer from '@/app/admin/components/ProfileDrawer';
import axios from 'axios';
import {
  ADMIN_PROFILE_URL,
  GET_USER_URL,
  NEW_CUSTOMER_URL,
  NEW_EMPLOYEE_URL,
  UPDATE_USER_URL,
} from '@/lib/constants';
import Loading from '@/app/admin/components/Loading';

import {
  Box,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  Paper,
  Card,
  CardContent,
  Alert,
  AlertTitle,
  Divider,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SearchIcon from '@mui/icons-material/Search';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function UserManagementPage() {
  const [tab, setTab] = useState<'createCustomer' | 'createEmployee' | 'getUser'>('createCustomer');
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [responseData, setResponseData] = useState<any>(null);
  const [editableData, setEditableData] = useState<Record<string, any>>({});
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(ADMIN_PROFILE_URL, { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => (window.location.href = '/login'))
      .finally(() => setLoading(false));
  }, []);

  const resetForm = () => {
    setForm({});
    setResponseData(null);
    setEditableData({});
    setError('');
    setMessage('');
  };

  const handleSubmit = async () => {
    setError('');
    setMessage('');
    try {
      const url = tab === 'createCustomer' ? NEW_CUSTOMER_URL : NEW_EMPLOYEE_URL;
      const res = await axios.post(url, form, { withCredentials: true });
      setMessage(res.data.message || 'User created successfully!');
      setResponseData(res.data);
      setForm({});
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to create user.');
    }
  };

  const handleFetch = async () => {
    setError('');
    setResponseData(null);
    if (!form.user_id) return setError('Please provide a user ID.');

    try {
      const res = await axios.get(`${GET_USER_URL}${form.user_id}`, { withCredentials: true });
      setResponseData(res.data);

      const editableFields = ['name', 'email', 'pan_number', 'mobile_number', 'dob', 'aadhar_number', 'address'];
      const initialEditState: Record<string, any> = {};

      editableFields.forEach((key) => {
        if (res.data[key] !== undefined) {
          initialEditState[key] = res.data[key];
        }
      });

      setEditableData(initialEditState);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to fetch user.');
    }
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        ...editableData,
        user_id: form.user_id,
      };
      const res = await axios.post(UPDATE_USER_URL, payload, { withCredentials: true });
      setMessage(res.data.message || 'User updated successfully!');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Update failed.');
    }
  };

  const handleChangeTab = (newTab: 'createCustomer' | 'createEmployee' | 'getUser') => {
    setTab(newTab);
    resetForm();
  };

  // Page loading
  if (loading) {
    return <Loading message="Loading user management..." />;
  }

  return (
    <>

        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" component="h1" className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
              <ManageAccountsIcon fontSize="large" /> User Management
            </Typography>
            <Typography variant="subtitle1" className="text-gray-600 mt-2">
              Create customers, employees, and manage user profiles
            </Typography>
          </Box>

          {/* Tabs */}
          <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Tabs
              value={tab}
              onChange={(_, newValue) => handleChangeTab(newValue)}
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                },
              }}
            >
              <Tab label="Create Customer" value="createCustomer" icon={<PersonAddIcon />} iconPosition="start" />
              <Tab label="Create Employee/Admin" value="createEmployee" icon={<PersonAddIcon />} iconPosition="start" />
              <Tab label="Get User" value="getUser" icon={<SearchIcon />} iconPosition="start" />
            </Tabs>

            <CardContent>
              {/* Success & Error Messages */}
              {message && (
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

              {/* Form Sections */}
              {tab === 'createCustomer' && (
                <Box component="form" noValidate autoComplete="off">
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', mb: 3 }}>
                    <EditIcon fontSize="small" />  Customer Data
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        placeholder="Enter full name"
                        value={form.name || ''}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        variant="outlined"
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        placeholder="Enter email"
                        value={form.email || ''}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        variant="outlined"
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Mobile Number"
                        type="tel"
                        placeholder="Enter mobile number"
                        value={form.mobile_number || ''}
                        onChange={(e) => setForm({ ...form, mobile_number: e.target.value })}
                        variant="outlined"
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Date of Birth"
                        type="date"
                        value={form.dob ? new Date(form.dob).toISOString().split('T')[0] : ''}
                        onChange={(e) => {
                          const dobMillis = new Date(e.target.value).getTime();
                          setForm({ ...form, dob: dobMillis });
                        }}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                    </Grid>
                    <Grid xs={12}>
                      <TextField
                        fullWidth
                        label="Address"
                        multiline
                        rows={2}
                        placeholder="Enter address"
                        value={form.address || ''}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        variant="outlined"
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Aadhar Number"
                        type="number"
                        placeholder="Enter Aadhar number"
                        value={form.aadhar_number || ''}
                        onChange={(e) => setForm({ ...form, aadhar_number: e.target.value })}
                        variant="outlined"
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="PAN Number"
                        placeholder="Enter PAN number"
                        value={form.pan_number || ''}
                        onChange={(e) => setForm({ ...form, pan_number: e.target.value })}
                        variant="outlined"
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Branch ID"
                        type="number"
                        placeholder="Enter branch ID"
                        value={form.branch_id || ''}
                        onChange={(e) => setForm({ ...form, branch_id: e.target.value })}
                        variant="outlined"
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<PersonAddIcon />}
                      onClick={handleSubmit}
                      size="large"
                      sx={{ borderRadius: '8px' }}
                    >
                      Create Customer
                    </Button>
                  </Box>

                  {/* Response Data */}
                  {responseData?.customerId && (
                    <Paper sx={{ mt: 4, p: 3, backgroundColor: '#e3f2fd', borderLeft: 5, borderColor: '#1976d2' }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                        ✅ Customer Created Successfully
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Grid container spacing={2}>
                        <Grid xs={12} sm={6}>
                          <Typography><strong>Customer ID:</strong> {responseData.customerId}</Typography>
                        </Grid>
                        <Grid xs={12} sm={6}>
                          <Typography><strong>Temporary Password:</strong> {responseData.newPassword}</Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  )}
                </Box>
              )}

              {tab === 'createEmployee' && (
                <Box component="form" noValidate autoComplete="off">
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', mb: 3 }}>
                    New Employee / Admin
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        placeholder="Enter full name"
                        value={form.name || ''}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        variant="outlined"
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        placeholder="Enter email"
                        value={form.email || ''}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        variant="outlined"
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Mobile Number"
                        type="tel"
                        placeholder="Enter mobile number"
                        value={form.mobile_number || ''}
                        onChange={(e) => setForm({ ...form, mobile_number: e.target.value })}
                        variant="outlined"
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Branch ID"
                        type="number"
                        placeholder="Enter branch ID"
                        value={form.branch_id || ''}
                        onChange={(e) => setForm({ ...form, branch_id: e.target.value })}
                        variant="outlined"
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                    </Grid>
                    <Grid xs={12}>
                   
                           <FormControl
  fullWidth
  size="small"
  sx={{ width: '220px', minHeight: '50px'}} // <-- Adjust width as needed
>
  <InputLabel>Role</InputLabel>
  <Select
    value={form.role || ''}
    onChange={(e) => setForm({ ...form, role: e.target.value })}
    label="Role"
    sx={{ 
      borderRadius: '8px',
      '& .MuiSelect-select': { 
        paddingTop: '16px',
        paddingBottom: '16px',
        paddingLeft: '14px',
        paddingRight: '32px',
        textAlign: 'left'
      },
      '& .MuiOutlinedInput-root': {
        borderRadius: '8px'
      }
    }}
  >
    <MenuItem value="">Select Role</MenuItem>
    <MenuItem value="EMPLOYEE">Employee</MenuItem>
    <MenuItem value="ADMIN">Admin</MenuItem>
  </Select>
</FormControl>

                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<PersonAddIcon />}
                      onClick={handleSubmit}
                      size="large"
                      sx={{ borderRadius: '8px' }}
                    >
                      Create Employee
                    </Button>
                  </Box>

                  {/* Response Data */}
                  {responseData?.employeeId && (
                    <Paper sx={{ mt: 4, p: 3, backgroundColor: '#e3f2fd', borderLeft: 5, borderColor: '#1976d2' }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                        ✅ Employee Created Successfully
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Grid container spacing={2}>
                        {[
                          { label: 'Employee ID', value: responseData.employeeId },
                          { label: 'Role', value: responseData.role },
                          { label: 'Name', value: responseData.name },
                          { label: 'Email', value: responseData.email },
                          { label: 'Mobile', value: responseData.mobileNumber },
                          { label: 'Branch ID', value: responseData.branchId },
                          { label: 'Temp Password', value: responseData.initial_password },
                        ].map((item, i) => (
                          <Grid xs={12} sm={6} key={i}>
                            <Typography><strong>{item.label}:</strong> {item.value}</Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>
                  )}
                </Box>
              )}

              {tab === 'getUser' && (
                <Box component="form" noValidate autoComplete="off">
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', mb: 3 }}>
                    Fetch User Details
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid xs={12} sm={8}>
                      <TextField
                        fullWidth
                        label="User ID"
                        placeholder="Enter customer or employee ID"
                        value={form.user_id || ''}
                        onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                        type="text"
                        variant="outlined"
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                    </Grid>
                    <Grid xs={12} sm={4}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="secondary"
                        startIcon={<SearchIcon />}
                        onClick={handleFetch}
                        size="large"
                        sx={{ height: '100%', borderRadius: '8px' }}
                      >
                        Fetch
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Editable User Data */}
              {responseData && tab === 'getUser' && (
                <Box sx={{ mt: 5 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    <EditIcon fontSize="small" /> Edit User Details
                  </Typography>
                  <Card variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                    <Grid container spacing={3}>
                      {Object.entries(responseData).map(([key, val]: [string, any]) => {
                        const isEditable = [
                          'name',
                          'email',
                          'pan_number',
                          'mobile_number',
                          'dob',
                          'aadhar_number',
                          'address',
                        ].includes(key);

                        const displayValue =
                          key === 'dob' && !isNaN(Number(val))
                            ? new Date(Number(val)).toLocaleDateString()
                            : String(val);

                        const label = key
                          .replace(/_/g, ' ')
                          .replace(/\b\w/g, (l) => l.toUpperCase());

                        return (
                          <Grid xs={12} sm={6} key={key}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {label}
                            </Typography>
                            {isEditable ? (
                              key === 'dob' ? (
                                <TextField
                                  type="date"
                                  fullWidth
                                  size="small"
                                  value={
                                    editableData[key]
                                      ? new Date(Number(editableData[key])).toISOString().split('T')[0]
                                      : ''
                                  }
                                  onChange={(e) =>
                                    setEditableData({
                                      ...editableData,
                                      [key]: new Date(e.target.value).getTime(),
                                    })
                                  }
                                  InputLabelProps={{ shrink: true }}
                                  variant="outlined"
                                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                />
                              ) : (
                                <TextField
                                  fullWidth
                                  type={['mobile_number', 'aadhar_number'].includes(key) ? 'number' : 'text'}
                                  value={editableData[key]?.toString() || ''}
                                  onChange={(e) =>
                                    setEditableData({
                                      ...editableData,
                                      [key]:
                                        ['mobile_number', 'aadhar_number'].includes(key)
                                          ? Number(e.target.value)
                                          : e.target.value,
                                    })
                                  }
                                  variant="outlined"
                                  size="small"
                                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                />
                              )
                            ) : (
                              <TextField
                                fullWidth
                                value={displayValue}
                                disabled
                                variant="outlined"
                                size="small"
                                sx={{ backgroundColor: '#f5f5f5', '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                              />
                            )}
                          </Grid>
                        );
                      })}
                    </Grid>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        onClick={handleUpdate}
                        size="medium"
                        sx={{ borderRadius: '8px' }}
                      >
                        Save Changes
                      </Button>
                    </Box>
                  </Card>
                </Box>
              )}
            </CardContent>
          </Card>
        </div>
    </>
  );
}