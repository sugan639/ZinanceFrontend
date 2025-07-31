'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/app/admin/components/SideBar';
import TopBar from '@/app/admin/components/TopBar';
import axios from 'axios';
import {
  ADMIN_PROFILE_URL,
  DEPOSIT_URL,
  WITHDRAW_URL,
  TRANSFER_URL,
} from '@/lib/constants';
import TransactionForm from '@/app/admin/components/TransactionForm';
import Loading from '@/app/admin/components/Loading';

export default function MoneyTransferPage() {
  const [transactionType, setTransactionType] = useState<'DEPOSIT' | 'WITHDRAW' | 'TRANSFER'>('DEPOSIT');
  const [accountNumber, setAccountData] = useState('');
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
        const res = await axios.get(ADMIN_PROFILE_URL, { withCredentials: true });
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
      if (transactionType === 'DEPOSIT') {
        const res = await axios.post(
          DEPOSIT_URL,
          {
            account_number: Number(accountNumber),
            amount: Number(amount),
          },
          { withCredentials: true }
        );
        setMessage(res.data.message || 'Deposit successful!');
        setAccountData('');
        setAmount('');
      } else if (transactionType === 'WITHDRAW') {
        const res = await axios.post(
          WITHDRAW_URL,
          {
            account_number: Number(accountNumber),
            amount: Number(amount),
          },
          { withCredentials: true }
        );
        setMessage(res.data.message || 'Withdrawal successful!');
        setAccountData('');
        setAmount('');
      } else if (transactionType === 'TRANSFER') {
        const payload: any = {
          from_account: Number(fromAccount),
          to_account: Number(toAccount),
          amount: Number(amount),
          type: txType,
        };
        if (txType === 'INTER_BANK') {
          payload.ifsc_code = ifscCode;
        }

        const res = await axios.post(TRANSFER_URL, payload, {
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
      setMessage(`An error occurred during ${transactionType.toLowerCase()}.`);
    }
  };

  if (!user) return null;

  return (
    <>
      
        <div className="max-w-lg mx-auto px-6 py-8 space-y-8">
          {/* Header */}
          <header className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Money Transfer</h1>
            <p className="mt-2 text-gray-600">Perform deposits, withdrawals, and fund transfers securely</p>
          </header>

          {/* Transaction Type Selector */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Transaction Type</label>
            <select
              value={transactionType}
              onChange={(e) => {
                setTransactionType(e.target.value as 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER');
                setMessage('');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            >
              <option value="DEPOSIT">Deposit</option>
              <option value="WITHDRAW">Withdraw</option>
              <option value="TRANSFER">Transfer</option>
            </select>
          </div>

          {/* Transaction Form */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-5">
              {transactionType === 'DEPOSIT' && 'Deposit Funds'}
              {transactionType === 'WITHDRAW' && 'Withdraw Funds'}
              {transactionType === 'TRANSFER' && 'Transfer Funds'}
            </h2>

            <TransactionForm
              type={transactionType}
              accountNumber={accountNumber}
              amount={amount}
              fromAccount={fromAccount}
              toAccount={toAccount}
              txType={txType}
              ifscCode={ifscCode}
              onAccountChange={setAccountData}
              onAmountChange={setAmount}
              onFromAccountChange={setFromAccount}
              onToAccountChange={setToAccount}
              onTxTypeChange={setTxType}
              onIFSCChange={setIfscCode}
              onSubmit={handleSubmit}
              message={message}
            />
          </div>

          {/* Success/Error Message */}
          {message && (
            <div
              className={`p-4 rounded text-sm font-medium ${
                message.includes('successful') || message.includes('success')
                  ? 'bg-green-50 text-green-700 border border-green-100'
                  : 'bg-red-50 text-red-700 border border-red-100'
              }`}
              role="alert"
            >
              {message}
            </div>
          )}
        </div>
    </>
  );
}