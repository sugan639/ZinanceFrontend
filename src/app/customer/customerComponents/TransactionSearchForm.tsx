'use client';

import React, { useState } from 'react';
import {
  TextField,
  Button,
  Tabs,
  Tab,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type Props = {
  onSubmit: (params: {
    transaction_id?: string;
    customer_id?: string;
    account_number?: number;
    from_date?: number;
    to_date?: number;
    transaction_type?: 'DEBIT' | 'CREDIT';
  }) => void;
  message?: string;
  user: any;
};

export default function TransactionSearchForm({ onSubmit, message, user }: Props) {
  const [mode, setMode] = useState<'BY_ID' | 'BY_FILTER'>('BY_ID');
  const [txnId, setTxnId] = useState('');
  const [accountOption, setAccountOption] = useState<'ALL' | 'SPECIFIC'>('ALL');
  const [accountNumber, setAccountNumber] = useState('');
  const [transactionType, setTransactionType] = useState<'ALL' | 'DEBIT' | 'CREDIT'>('ALL');
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [formError, setFormError] = useState('');

  const handleSubmit = () => {
    setFormError('');

    if (mode === 'BY_ID') {
      if (!txnId) {
        setFormError('Please provide a Transaction ID.');
        return;
      }

      return onSubmit({
        transaction_id: txnId,
      });
    }

    if (!fromDate || !toDate) {
      setFormError('Please select both From and To dates.');
      return;
    }

    if (accountOption === 'SPECIFIC' && !accountNumber.trim()) {
      setFormError('Please provide an Account Number.');
      return;
    }

    const payload: any = {
      from_date: fromDate.getTime(),
      to_date: toDate.getTime(),
    };

    if (accountOption === 'ALL') {
      if (!user?.customerId) {
        setFormError('User ID not available. Please try again or log in.');
        return;
      }
      payload.customer_id = String(user.customerId);
    } else {
      payload.account_number = accountNumber;
    }

    if (transactionType !== 'ALL') {
      payload.transaction_type = transactionType;
    }

    onSubmit(payload);
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl animate-slide-up max-w-lg mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Transactions</h2>
      <Tabs
        value={mode}
        onChange={(_, newValue) => {
          setMode(newValue);
          setFormError('');
          setTxnId('');
          setAccountOption('ALL');
          setAccountNumber('');
          setTransactionType('ALL');
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
        <Tab label="By Transaction ID" value="BY_ID" />
        <Tab label="By Account / Date" value="BY_FILTER" />
      </Tabs>

      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {mode === 'BY_ID' ? (
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
        ) : (
          
          
          
          
          <>
            <FormControl fullWidth size="small">
              <InputLabel id="account-option-label">Account Option</InputLabel>
              <Select
                labelId="account-option-label"
                value={accountOption}
                label="Account Option"
                onChange={(e) => setAccountOption(e.target.value as 'ALL' | 'SPECIFIC')}
                sx={{ borderRadius: '8px' }}
                aria-label="Account option select"
              >
                <MenuItem value="ALL">All Accounts</MenuItem>
                <MenuItem value="SPECIFIC">Specific Account</MenuItem>
              </Select>
            </FormControl>
            {accountOption === 'SPECIFIC' && (
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
            )}
        
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full">
                <label className="text-sm text-gray-800 mb-1 block" htmlFor="from-date">
                  From Date
                </label>
                <DatePicker
                  id="from-date"
                  selected={fromDate}
                  onChange={(date: Date | null) => setFromDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholderText="Select start date"
                  aria-label="From Date picker"
                />
              </div>
              <div className="w-full">
                <label className="text-sm text-gray-800 mb-1 block" htmlFor="to-date">
                  To Date
                </label>
                <DatePicker
                  id="to-date"
                  selected={toDate}
                  onChange={(date: Date | null) => setToDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholderText="Select end date"
                  aria-label="To Date picker"
                />
              </div>
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
  );
}


































    // <FormControl fullWidth size="small">
    //           <InputLabel id="transaction-type-label">Transaction Type</InputLabel>
    //           <Select
    //             labelId="transaction-type-label"
    //             value={transactionType}
    //             label="Transaction Type"
    //             onChange={(e) => setTransactionType(e.target.value as 'ALL' | 'DEBIT' | 'CREDIT')}
    //             sx={{ borderRadius: '8px' }}
    //             aria-label="Transaction type select"
    //           >
    //             <MenuItem value="ALL">All</MenuItem>
    //             <MenuItem value="DEBIT">Debit</MenuItem>
    //             <MenuItem value="CREDIT">Credit</MenuItem>
    //           </Select>
    //         </FormControl>