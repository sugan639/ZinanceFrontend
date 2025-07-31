'use client';

import React, { useState } from 'react';
import {
  TextField,
  Button,
  Tabs,
  Tab,
  Box,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import RefreshIcon from '@mui/icons-material/Refresh';

type Props = {
  onSubmit: (params: any) => void;
  onReset?: () => void;
  message?: string;
  user?: any; // ✅ Add this line
};

export default function TransactionSearchForm({ onSubmit, onReset, message, user }: Props) {
  const [mode, setMode] = useState<'BY_ID' | 'BY_FILTER'>('BY_ID');
  const [txnId, setTxnId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = () => {
    setFormError('');

    if (mode === 'BY_ID') {
      if (!txnId) {
        setFormError('Please provide the Transaction ID to find the transaction.');
        return;
      }
      return onSubmit({
        transaction_id: Number(txnId),
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
    setFormError('');

    if (onReset) onReset(); // notify parent to clear data
  };

  return (
    <Box className="p-6 bg-white rounded-xl shadow-lg max-w-lg mx-auto transition-all duration-300 hover:shadow-xl">
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
        <Tab label="By Transaction ID" value="BY_ID" />
        <Tab label="Statement Filter" value="BY_FILTER" />
      </Tabs>

      {mode === 'BY_ID' ? (
        <TextField
          fullWidth
          label="Transaction ID"
          value={txnId}
          onChange={(e) => setTxnId(e.target.value)}
          placeholder="Enter transaction ID"
          variant="outlined"
          size="small"
          type="number"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
        />
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />

          <div className="relative my-2 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <span className="relative bg-white px-2 text-sm text-gray-500">or</span>
          </div>

          <TextField
            fullWidth
            label="Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="Enter account number"
            variant="outlined"
            size="small"
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CreditCardIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="From Date"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
            <TextField
              fullWidth
              label="To Date"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
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
        <p className="mt-3 text-sm text-center text-red-600">{formError}</p>
      )}
      {message && (
        <p className="mt-2 text-sm text-center text-green-700">{message}</p>
      )}
    </Box>
  );
}