'use client';

import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Typography,
} from '@mui/material';

type Props = {
  type: 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER';
  accountNumber: string;
  amount: string;
  fromAccount?: string;
  toAccount?: string;
  txType?: string;
  ifscCode?: string;
  onAccountChange: (val: string) => void;
  onAmountChange: (val: string) => void;
  onFromAccountChange?: (val: string) => void;
  onToAccountChange?: (val: string) => void;
  onTxTypeChange?: (val: string) => void;
  onIFSCChange?: (val: string) => void;
  onSubmit: () => void;
  message: string;
};

const transactionTypes = ['INTRA_BANK', 'INTER_BANK'] as const;

// Global cache (persists across re-renders)
const accountCache: { accounts: any[]; loading: boolean } = {
  accounts: [],
  loading: false,
};

export default function TransactionForm({
  type,
  accountNumber,
  amount,
  fromAccount = '',
  toAccount = '',
  txType = '',
  ifscCode = '',
  onAccountChange,
  onAmountChange,
  onFromAccountChange,
  onToAccountChange,
  onTxTypeChange,
  onIFSCChange,
  onSubmit,
  message,
}: Props) {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);

  useEffect(() => {
    if (type !== 'TRANSFER') return;

    // Use cached data
    if (accountCache.accounts.length > 0) {
      setAccounts(accountCache.accounts);
      if (fromAccount === '' && onFromAccountChange) {
        onFromAccountChange(accountCache.accounts[0].accountNumber);
      }
      return;
    }

    // Avoid duplicate fetches
    if (accountCache.loading) {
      setLoadingAccounts(true);
      const unsubscribe = setInterval(() => {
        if (accountCache.accounts.length > 0) {
          setAccounts(accountCache.accounts);
          if (fromAccount === '' && onFromAccountChange) {
            onFromAccountChange(accountCache.accounts[0].accountNumber);
          }
          setLoadingAccounts(false);
          clearInterval(unsubscribe);
        }
      }, 100);
      return () => clearInterval(unsubscribe);
    }

    // Fetch accounts
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
        const fetchedAccounts = Array.isArray(data.accounts) ? data.accounts : [];

        accountCache.accounts = fetchedAccounts;
        setAccounts(fetchedAccounts);

        if (fetchedAccounts.length > 0 && fromAccount === '' && onFromAccountChange) {
          onFromAccountChange(fetchedAccounts[0].accountNumber);
        }
      } catch (err) {
        console.error('Error fetching accounts:', err);
        setAccounts([]);
      } finally {
        accountCache.loading = false;
        setLoadingAccounts(false);
      }
    };

    fetchAccounts();
  }, [type, fromAccount, onFromAccountChange]);

  return (
    <div className="flex justify-center items-start h-auto">
      {/* Removed animation like slide-up or hover scale */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 w-full max-w-md">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <Typography variant="h6" className="text-xl font-semibold text-gray-800">
            {type === 'DEPOSIT' && 'Deposit Money'}
            {type === 'WITHDRAW' && 'Withdraw Money'}
            {type === 'TRANSFER' && 'Transfer Money'}
          </Typography>
        </div>

        {/* Form Body */}
        <Box component="form" sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {type === 'TRANSFER' ? (
            <>
              {/* From Account (Dropdown) */}
              <FormControl fullWidth size="small">
                <InputLabel id="from-account-label">From Account</InputLabel>
                <Select
                  labelId="from-account-label"
                  value={fromAccount}
                  label="From Account"
                  onChange={(e) => onFromAccountChange?.(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-notchedOutline': { borderRadius: '8px' } }}
                  disabled={loadingAccounts}
                >
                  {loadingAccounts ? (
                    <MenuItem disabled>Loading accounts...</MenuItem>
                  ) : accounts.length === 0 ? (
                    <MenuItem disabled>No accounts found</MenuItem>
                  ) : (
                    accounts.map((acc) => (
                      <MenuItem key={acc.accountNumber} value={acc.accountNumber}>
                        {acc.accountNumber} (₹{parseFloat(acc.balance).toFixed(2)})
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>

              {/* To Account */}
              <TextField
                fullWidth
                label="To Account"
                placeholder="Enter recipient account number"
                value={toAccount}
                onChange={(e) => onToAccountChange?.(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />

              {/* Amount */}
              <TextField
                fullWidth
                label="Amount"
                placeholder="Enter amount"
                type="number"
                value={amount}
                onChange={(e) => onAmountChange(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />

              {/* Transaction Type */}
              <FormControl fullWidth size="small">
                <InputLabel id="tx-type-label">Transaction Type</InputLabel>
                <Select
                  labelId="tx-type-label"
                  value={txType}
                  label="Transaction Type"
                  onChange={(e) => onTxTypeChange?.(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                >
                  <MenuItem value="">Select Type</MenuItem>
                  {transactionTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.replace('_', ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* IFSC Code (Inter-Bank Only) */}
              {txType === 'INTER_BANK' && (
                <TextField
                  fullWidth
                  label="IFSC Code"
                  placeholder="Enter IFSC code"
                  value={ifscCode}
                  onChange={(e) => onIFSCChange?.(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              )}
            </>
          ) : (
            <>
              {/* Account Number */}
              <TextField
                fullWidth
                label="Account Number"
                placeholder="Enter account number"
                value={accountNumber}
                onChange={(e) => onAccountChange(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />

              {/* Amount */}
              <TextField
                fullWidth
                label="Amount"
                placeholder="Enter amount"
                type="number"
                value={amount || ''}
                onChange={(e) => onAmountChange(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </>
          )}

          {/* Submit Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={onSubmit}
            fullWidth
            sx={{
              mt: 2,
              py: 1.5,
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 'medium',
            }}
          >
            {type === 'DEPOSIT' && 'Make Deposit'}
            {type === 'WITHDRAW' && 'Make Withdrawal'}
            {type === 'TRANSFER' && 'Make Transfer'}
          </Button>

          {/* Success/Info Message */}
          {message && (
            <Typography
              variant="body2"
              color={message.includes('successful') || message.includes('Transfer') ? 'success.main' : 'error'}
              align="center"
              sx={{ mt: 1, fontSize: '0.875rem' }}
            >
              {message}
            </Typography>
          )}
        </Box>
      </div>
    </div>
  );
}