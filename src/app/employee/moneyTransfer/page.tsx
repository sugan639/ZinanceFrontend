'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  EMPLOYEE_PROFILE_URL,
  EMPLOYEE_DEPOSIT_URL,
  EMPLOYEE_WITHDRAW_URL,
  EMPLOYEE_TRANSFER_URL,
} from '@/lib/constants';
import TopBar from '../employeeComponents/TopBar';
import Sidebar from '../employeeComponents/SideBar';
import Loading from '../../Loading';

import {
  Box,
  Tabs,
  Tab,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  AlertTitle,
  Divider,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MoneyOffCsredIcon from '@mui/icons-material/MoneyOffCsred';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TransactionForm from '../employeeComponents/TransactionForm';

export default function MoneyTransferPage() {
  const [activeTab, setActiveTab] = useState<'DEPOSIT' | 'WITHDRAW' | 'TRANSFER'>('DEPOSIT');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [txType, setTxType] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(EMPLOYEE_PROFILE_URL, { withCredentials: true });
        setUser(res.data);
      } catch {
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <Loading message="Loading money transfer..." />;
  }

  const handleSubmit = async () => {
    setMessage('');
    try {
      if (activeTab === 'DEPOSIT') {
        const res = await axios.post(
          EMPLOYEE_DEPOSIT_URL,
          {
            account_number: Number(accountNumber),
            amount: Number(amount),
          },
          { withCredentials: true }
        );
        setMessage(res.data.message || 'Deposit successful!');
        setAccountNumber('');
        setAmount('');
      } else if (activeTab === 'WITHDRAW') {
        const res = await axios.post(
          EMPLOYEE_WITHDRAW_URL,
          {
            account_number: Number(accountNumber),
            amount: Number(amount),
          },
          { withCredentials: true }
        );
        setMessage(res.data.message || 'Withdrawal successful!');
        setAccountNumber('');
        setAmount('');
      } else if (activeTab === 'TRANSFER') {
        const payload: any = {
          from_account: Number(fromAccount),
          to_account: Number(toAccount),
          amount: Number(amount),
          type: txType,
        };
        if (txType === 'INTER_BANK') {
          payload.ifsc_code = ifscCode;
        }
        const res = await axios.post(EMPLOYEE_TRANSFER_URL, payload, {
          withCredentials: true,
        });
        setMessage(res.data.message || 'Transfer successful!');
        setFromAccount('');
        setToAccount('');
        setAmount('');
        setTxType('');
        setIfscCode('');
      }
    } catch (error: any) {
      setMessage(`An error occurred during ${activeTab.toLowerCase()}.`);
    }
  };

  if (!user) return null;

  return (
    <>
      <Sidebar />
      <TopBar user={user} />

      <main className="pl-64 pt-20 min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto px-4 py-8">
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" component="h1" className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
              <ReceiptIcon fontSize="large" /> Money Transfer
            </Typography>
            <Typography variant="subtitle1" className="text-gray-600 mt-2">
              Perform deposits, withdrawals, and transfers
            </Typography>
          </Box>

          {/* Tabs */}
          <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => {
                setActiveTab(newValue);
                setMessage('');
              }}
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
              <Tab
                value="DEPOSIT"
                label="Deposit"
                icon={<AccountBalanceWalletIcon />}
                iconPosition="start"
              />
              <Tab
                value="WITHDRAW"
                label="Withdraw"
                icon={<MoneyOffCsredIcon />}
                iconPosition="start"
              />
              <Tab
                value="TRANSFER"
                label="Transfer"
                icon={<SwapHorizIcon />}
                iconPosition="start"
              />
            </Tabs>

            <Divider />

            <CardContent>
              {/* Success & Error Messages */}
              {message && (
                <Alert
                  severity={message.includes('successful') ? 'success' : 'error'}
                  icon={message.includes('successful') ? <CheckCircleOutlineIcon /> : <ErrorOutlineIcon />}
                  sx={{ mb: 3 }}
                >
                  <AlertTitle>{message.includes('successful') ? 'Success' : 'Error'}</AlertTitle>
                  {message}
                </Alert>
              )}

              {/* Form */}
              <TransactionForm
                type={activeTab}
                accountNumber={accountNumber}
                amount={amount}
                fromAccount={fromAccount}
                toAccount={toAccount}
                txType={txType}
                ifscCode={ifscCode}
                onAccountChange={setAccountNumber}
                onAmountChange={setAmount}
                onFromAccountChange={setFromAccount}
                onToAccountChange={setToAccount}
                onTxTypeChange={setTxType}
                onIFSCChange={setIfscCode}
                onSubmit={handleSubmit}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}