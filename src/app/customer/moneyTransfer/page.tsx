'use client';

import React, { useEffect, useState } from 'react';

import axios from 'axios';
import {
  CUSTOMER_PROFILE_URL,
  CUSTOMER_TRANSFER_URL,
} from '@/lib/constants';

import Loading from '@/app/Loading';
import Sidebar from '../customerComponents/SideBar';
import TopBar from '../customerComponents/TopBar';
import TransactionForm from '../customerComponents/TransactionForm';


export default function MoneyTransferPage() {
  const [activeTab, setActiveTab] = useState<'TRANSFER'>('TRANSFER');
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
        const res = await axios.get(CUSTOMER_PROFILE_URL, { withCredentials: true });
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
       if (activeTab === 'TRANSFER') {
        const payload: any = {
          from_account: Number(fromAccount),
          to_account: Number(toAccount),
          amount: Number(amount),
          type: txType,
        };
        if (txType === 'INTER_BANK' ) {
          payload.ifsc_code = ifscCode;
        }

        const res = await axios.post(CUSTOMER_TRANSFER_URL, payload, {
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
      <TopBar user={user}/>
      
      

      <main className="pl-64 pt-20 min-h-screen bg-gray-100">
        <div className="flex flex-col items-center min-h-[calc(100vh-4rem)] px-4">

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

