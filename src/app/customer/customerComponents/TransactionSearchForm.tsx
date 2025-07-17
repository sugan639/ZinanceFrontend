'use client';

import React, { useState } from 'react';
import { TextField, Button, Tabs, Tab, Box, Divider } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';


import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


type Props = {
  onSubmit: (params: {
    transaction_id?: string;
    transaction_reference_number?: string;
    customer_id?: number;
    account_number?: number;
    from_date?: number;
    to_date?: number;
  }) => void;
  message?: string;
};

export default function TransactionSearchForm({ onSubmit, message }: Props) {
  const [mode, setMode] = useState<'BY_ID' | 'BY_FILTER'>('BY_ID');
  const [txnId, setTxnId] = useState('');
  const [refNo, setRefNo] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [formError, setFormError] = useState('');

  const handleSubmit = () => {
    setFormError('');

    if (mode === 'BY_ID') {
      if (txnId && refNo) {
        setFormError('Please provide only one: either Transaction ID or Reference Number.');
        return;
      }
      if (!txnId && !refNo) {
        setFormError('Please provide either Transaction ID or Reference Number.');
        return;
      }

      return onSubmit({
        ...(txnId && { transaction_id: txnId }),
        ...(refNo && { transaction_reference_number: refNo }),
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
      from_date: fromDate.getTime(),
      to_date: toDate.getTime(),
    };

    if (hasCustomerId) {
      payload.customer_id = Number(customerId);
    }
    if (hasAccountNumber) {
      payload.account_number = Number(accountNumber);
    }

    onSubmit(payload);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
    <div className="p-6 bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl animate-slide-up max-w-lg mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Transactions</h2>
      <Tabs
        value={mode}
        onChange={(_, newValue) => {
          setMode(newValue);
          setFormError('');
          setTxnId('');
          setRefNo('');
          setCustomerId('');
          setAccountNumber('');
          setFromDate(null);
          setToDate(null);
        }}
        centered
        sx={{
          mb: 3,
          '& .MuiTab-root': { fontWeight: 'medium', textTransform: 'none', fontSize: '1rem' },
          '& .Mui-selected': { color: '#1976d2', fontWeight: 'bold' },
          '& .MuiTabs-indicator': { backgroundColor: '#1976d2' },
        }}
        aria-label="Transaction search mode tabs"
      >
        <Tab label="By Transaction / Ref No" value="BY_ID" />
        <Tab label="By Customer / Date" value="BY_FILTER" />
      </Tabs>

      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {mode === 'BY_ID' ? (
          <>
            <TextField
              label="Transaction ID"
              value={txnId}
              onChange={(e) => setTxnId(e.target.value)}
              placeholder="Enter Transaction ID"
              variant="outlined"
              fullWidth
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              aria-label="Transaction ID input"
            />
            <Divider sx={{ my: 1 }}>
              <span className="text-sm text-gray-500">or</span>
            </Divider>
            <TextField
              label="Reference Number"
              value={refNo}
              onChange={(e) => setRefNo(e.target.value)}
              placeholder="Enter Reference Number"
              variant="outlined"
              fullWidth
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              aria-label="Reference Number input"
            />
          </>
        ) : (
          <>
            <TextField
              label="Customer ID"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="Enter Customer ID"
              variant="outlined"
              fullWidth
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              aria-label="Customer ID input"
            />
            <Divider sx={{ my: 1 }}>
              <span className="text-sm text-gray-500">or</span>
            </Divider>
            <TextField
              label="Account Number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter Account Number"
              variant="outlined"
              fullWidth
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              aria-label="Account Number input"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <DatePicker
                  label="From Date"
                  value={fromDate}
                  onChange={(newValue) => setFromDate(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small',
                      sx: { '& .MuiOutlinedInput-root': { borderRadius: '8px' } },
                      'aria-label': 'From Date picker',
                    },
                  }}
                />
                <DatePicker
                  label="To Date"
                  value={toDate}
                  onChange={(newValue) => setToDate(newValue)}
                  slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    sx: { '& .MuiOutlinedInput-root': { borderRadius: '8px' } },
                    'aria-label': 'To Date picker', // ✅ Correct usage
                  },
                }}

                
              />
            </div>
          </>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          sx={{ py: 1.5, borderRadius: '8px', textTransform: 'none', fontSize: '1rem' }}
          aria-label="Search transactions"
        >
          Search
        </Button>
        {formError && (
          <div
            className="mt-2 p-3 rounded-lg text-sm font-medium bg-red-100 text-red-700 animate-fade-in"
            role="alert"
          >
            {formError}
          </div>
        )}
        {message && (
          <div
            className="mt-2 p-3 rounded-lg text-sm font-medium bg-blue-100 text-blue-700 animate-fade-in"
            role="alert"
          >
            {message}
          </div>
        )}
      </Box>
    </div>
    </LocalizationProvider>
  );
}


