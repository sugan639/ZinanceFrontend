'use client';

import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Paper,
  Typography,
  Divider,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import RefreshIcon from '@mui/icons-material/Refresh';

type Props = {
  onSubmit: (params: any) => void;
  message?: string;
};

export default function TransactionSearchForm({ onSubmit, message }: Props) {
  const [mode, setMode] = useState<'BY_ID' | 'BY_FILTER'>('BY_ID');
  const [txnId, setTxnId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [limit, setLimit] = useState('10');
  const [offset, setOffset] = useState('0');
  const [formError, setFormError] = useState('');

  const handleSubmit = () => {
    setFormError('');

    if (mode === 'BY_ID') {

      if (!txnId ) {
        setFormError('Please provide either Transaction ID .');
        return;
      }

      return onSubmit({
        ...(txnId && { transaction_id: Number(txnId) }),
      });
    }

    const hasCustomerId = !!customerId.trim();
    const hasAccountNumber = !!accountNumber.trim();

    if ((hasCustomerId && hasAccountNumber) || (!hasCustomerId && !hasAccountNumber)) {
      setFormError('Please provide either Customer ID or Account Number — not both.');
      return;
    }

    if (!fromDate || !toDate) {
      setFormError('Please select both From and To dates.');
      return;
    }

    const payload: any = {
      from_date: Date.parse(fromDate),
      to_date: Date.parse(toDate),
      limit: Number(limit),
      offset: Number(offset),
    };

    if (hasCustomerId) payload.customer_id = Number(customerId);
    if (hasAccountNumber) payload.account_number = Number(accountNumber);

    onSubmit(payload);
  };

  const handleReset = () => {
    setTxnId('');
    setCustomerId('');
    setAccountNumber('');
    setFromDate('');
    setToDate('');
    setLimit('10');
    setOffset('0');
    setFormError('');
  };

  return (
    <Box className="p-6 bg-white rounded-xl shadow-lg max-w-lg mx-auto transition-all duration-300 hover:shadow-xl">
      <Typography variant="h6" className="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
        <SearchIcon fontSize="small" /> Find Transactions
      </Typography>

      <Tabs
        value={mode}
        onChange={(_, newValue) => {
          setMode(newValue);
          setFormError('');
          handleReset();
        }}
        variant="fullWidth"
        sx={{
          mb: 3,
          '& .MuiTab-root': { textTransform: 'none', fontWeight: 500 },
          '& .Mui-selected': { color: '#1976d2', fontWeight: 'bold' },
        }}
      >
        <Tab label="By Transaction ID " value="BY_ID" />
        <Tab label="By Customer / Date" value="BY_FILTER" />
      </Tabs>

      {mode === 'BY_ID' ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Transaction ID"
            value={txnId}
            onChange={(e) => setTxnId(e.target.value)}
            placeholder="Enter transaction ID"
            variant="outlined"
            size="small"
            type="number"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                sx: { borderRadius: '8px' },
              },
            }}
          />

     
      
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Customer ID"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            placeholder="Enter customer ID"
            variant="outlined"
            size="small"
            type="number"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon fontSize="small" />
                  </InputAdornment>
                ),
                sx: { borderRadius: '8px' },
              },
            }}
          />

          <Divider sx={{ my: 1, '&::before, &::after': { borderColor: 'gray' } }}>
            <Typography variant="caption" color="textSecondary">or</Typography>
          </Divider>

          <TextField
            fullWidth
            label="Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="Enter account number"
            variant="outlined"
            size="small"
            type="number"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <CreditCardIcon fontSize="small" />
                  </InputAdornment>
                ),
                sx: { borderRadius: '8px' },
              },
            }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="From Date"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '8px' },
                },
              }}
              variant="outlined"
              size="small"
            />
            <TextField
              fullWidth
              label="To Date"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '8px' },
                },
              }}
              variant="outlined"
              size="small"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Limit"
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              placeholder="Limit"
              variant="outlined"
              size="small"
              slotProps={{
                input: { sx: { borderRadius: '8px' } },
              }}
            />
            <TextField
              fullWidth
              label="Offset"
              type="number"
              value={offset}
              onChange={(e) => setOffset(e.target.value)}
              placeholder="Offset"
              variant="outlined"
              size="small"
              slotProps={{
                input: { sx: { borderRadius: '8px' } },
              }}
            />
          </Box>
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          startIcon={<SearchIcon />}
          fullWidth
          sx={{ borderRadius: '8px' }}
        >
          Search
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleReset}
          startIcon={<RefreshIcon />}
          sx={{ borderRadius: '8px' }}
        >
          Reset
        </Button>
      </Box>

      {formError && (
        <Typography variant="body2" color="error" align="center" sx={{ mt: 2 }}>
          {formError}
        </Typography>
      )}
      {message && (
        <Typography variant="body2" color="success.main" align="center" sx={{ mt: 1 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
}