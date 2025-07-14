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
        const res = await axios.get(ADMIN_PROFILE_URL, { withCredentials: true });
        setUser(res.data);
      } catch {
        window.location.href = '/login';
      }
      finally{
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);


  // Page loading
  if(loading){
   return <Loading message="Loading user management..." />;
  }

  const handleSubmit = async () => {
    setMessage('');

    try {
      if (activeTab === 'DEPOSIT') {
        const res = await axios.post(
          DEPOSIT_URL,
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
          WITHDRAW_URL,
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
        if (txType === 'INTER_BANK' ) {
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
      setMessage(`An error occurred during ${activeTab.toLowerCase()}.`);
    }
  };

  if (!user) return null;

  return (
    <>
      <Sidebar />
      <TopBar />
      
      

      <main className="pl-64 pt-20 min-h-screen bg-gray-100">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
          {/* Tabs */}
          <div className="flex justify-center space-x-4 mb-6">
            {(['DEPOSIT', 'WITHDRAW', 'TRANSFER'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setMessage('');
                }}
                className={`px-4 py-2 rounded ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border text-blue-600 hover:bg-blue-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Form Box */}
          <div className="w-full max-w-md">
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
              message={message}
            />
          </div>
        </div>
      </main>
    </>
  );
}

