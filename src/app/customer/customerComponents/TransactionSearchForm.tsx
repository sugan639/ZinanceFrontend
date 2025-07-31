'use client';

import React, { useState, useEffect } from 'react';
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
    account_number?: number;
    from_date?: number;
    to_date?: number;
  }) => void;
  message?: string;
  user: any;
};

// Global cache to avoid refetching accounts
const accountCache: { accounts: string[]; loading: boolean } = {
  accounts: [],
  loading: false,
};

export default function TransactionSearchForm({ onSubmit, message, user }: Props) {
  const [mode, setMode] = useState<'BY_ID' | 'BY_FILTER'>(() => {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('txn-search-mode') as 'BY_ID' | 'BY_FILTER') || 'BY_ID';
  }
  return 'BY_ID';
});

  const [txnId, setTxnId] = useState('');
  const [accountNumber, setAccountNumber] = useState<string>(''); // Selected account number
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [formError, setFormError] = useState('');
  const [accounts, setAccounts] = useState<string[]>([]); // Local state for accounts
  const [loadingAccounts, setLoadingAccounts] = useState(false);

  // Fetch accounts only when switching to BY_FILTER
  useEffect(() => {
    if (mode !== 'BY_FILTER') return;

    // Use cached accounts if available
    if (accountCache.accounts.length > 0) {
      setAccounts(accountCache.accounts);
      if (!accountNumber) {
        setAccountNumber(accountCache.accounts[0]);
      }
      return;
    }

    // Prevent duplicate fetches
    if (accountCache.loading) {
      setLoadingAccounts(true);
      const unsubscribe = setInterval(() => {
        if (accountCache.accounts.length > 0) {
          setAccounts(accountCache.accounts);
          if (!accountNumber) {
            setAccountNumber(accountCache.accounts[0]);
          }
          setLoadingAccounts(false);
          clearInterval(unsubscribe);
        }
      }, 100);
      return () => clearInterval(unsubscribe);
    }

    const fetchAccounts = async () => {
      accountCache.loading = true;
      setLoadingAccounts(true);
      try {
        const res = await fetch('http://localhost:8080/Banking_App/customer/accounts', {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Failed to fetch accounts');

        const data = await res.json();
        const fetchedAccounts = Array.isArray(data.accounts)
          ? data.accounts.map((acc: any) => acc.accountNumber)
          : [];

        accountCache.accounts = fetchedAccounts;
        setAccounts(fetchedAccounts);

        // Set default account
        if (fetchedAccounts.length > 0 && !accountNumber) {
          setAccountNumber(fetchedAccounts[0]);
        }
      } catch (err) {
        console.error('Error fetching accounts:', err);
        setFormError('Could not load your accounts. Please try again.');
      } finally {
        accountCache.loading = false;
        setLoadingAccounts(false);
      }
    };

    fetchAccounts();
  }, [mode, accountNumber]);

  const handleSubmit = () => {
    setFormError('');

    if (mode === 'BY_ID') {
      if (!txnId.trim()) {
        setFormError('Please provide a Transaction ID.');
        return;
      }

      return onSubmit({
        transaction_id: txnId,
      });
    }

    // Validation for BY_FILTER mode
    if (!fromDate || !toDate) {
      setFormError('Please select both From and To dates.');
      return;
    }

    if (!accountNumber) {
      setFormError('Please select an account.');
      return;
    }

    // Submit account-based search
    onSubmit({
      account_number: Number(accountNumber),
      from_date: fromDate.getTime(),
      to_date: toDate.getTime(),
    });
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow border border-gray-200 max-w-lg mx-auto">
      {/* Tabs */}
      <Tabs
        value={mode}
        onChange={(_, newValue) => {
  setMode(newValue);
  localStorage.setItem('txn-search-mode', newValue);
  setFormError('');
  setTxnId('');
  setFromDate(null);
  setToDate(null);
}}

        centered
        sx={{
          mb: 3,
          '& .MuiTab-root': {
            fontWeight: 'medium',
            textTransform: 'none',
            fontSize: '1rem',
          },
          '& .Mui-selected': {
            color: '#1976d2',
            fontWeight: 'bold',
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#1976d2',
            height: 3,
            borderRadius: '2px 2px 0 0',
          },
        }}
        aria-label="Transaction search mode tabs"
      >
        <Tab label="By Transaction ID" value="BY_ID" />
        <Tab label="By Account / Date" value="BY_FILTER" />
      </Tabs>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {mode === 'BY_ID' ? (
          /* Search by Transaction ID */
          <TextField
            label="Transaction ID"
            value={txnId}
            onChange={(e) => setTxnId(e.target.value)}
            placeholder="Enter Transaction ID"
            variant="outlined"
            fullWidth
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
            aria-label="Transaction ID input"
          />
        ) : (
          /* Search by Account & Date */
          <>
            {/* Account Dropdown */}
            <FormControl fullWidth size="small">
              <InputLabel id="account-select-label">Select Account</InputLabel>
              <Select
                labelId="account-select-label"
                value={accountNumber}
                label="Select Account"
                onChange={(e) => setAccountNumber(e.target.value)}
                sx={{ borderRadius: '8px' }}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected || loadingAccounts) return 'Select Account';
                  return selected;
                }}
              >
                {loadingAccounts ? (
                  <MenuItem disabled>Loading accounts...</MenuItem>
                ) : accounts.length === 0 ? (
                  <MenuItem disabled>No accounts found</MenuItem>
                ) : (
                  accounts.map((acc) => (
                    <MenuItem key={acc} value={acc}>
                      {acc}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            {/* Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-800 mb-1 block">From Date</label>
                <DatePicker
                  selected={fromDate}
                  onChange={(date: Date | null) => setFromDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholderText="Select start date"
                  aria-label="From Date picker"
                />
              </div>
              <div>
                <label className="text-sm text-gray-800 mb-1 block">To Date</label>
                <DatePicker
                  selected={toDate}
                  onChange={(date: Date | null) => setToDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholderText="Select end date"
                  aria-label="To Date picker"
                />
              </div>
            </div>
          </>
        )}

        {/* Search Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          sx={{
            py: 1.5,
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '1rem',
          }}
        >
          Search
        </Button>

        {/* Messages */}
        {formError && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {formError}
          </div>
        )}
        {message && (
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
            {message}
          </div>
        )}
      </Box>
    </div>
  );
}