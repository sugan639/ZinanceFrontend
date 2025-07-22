'use client';

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import DownloadIcon from '@mui/icons-material/Download';
import {
  CUSTOMER_ACCOUNTS_URL,
  CUSTOMER_PROFILE_URL,
  CUSTOMER_TRANSFER_URL,
} from '@/lib/constants';
import Loading from '@/app/Loading';
import Sidebar from '../customerComponents/SideBar';
import TopBar from '../customerComponents/TopBar';
import TransactionForm from '../customerComponents/TransactionForm';
import TransactionReceipt from '../customerComponents/TransactionReceipt';

export default function MoneyTransferPage() {
  const [activeTab] = useState<'TRANSFER'>('TRANSFER');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [txType, setTxType] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [receiptData, setReceiptData] = useState<{
    credit_transaction: any;
    debit_transaction: any;
  } | null>(null);



  
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(CUSTOMER_PROFILE_URL, {
          withCredentials: true,
        });
        setUser(res.data);
      } catch {
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
        if (txType === 'INTER_BANK') {
          payload.ifsc_code = ifscCode;
        }

        const res = await axios.post(CUSTOMER_TRANSFER_URL, payload, {
          withCredentials: true,
        });

        setMessage(res.data.message || 'Transfer successful!');
        setReceiptData({
          credit_transaction: res.data.credit_transaction,
          debit_transaction: res.data.debit_transaction,
        });

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

  const getAccounts = async () => {
    try {
      const accounts = await axios.get(CUSTOMER_ACCOUNTS_URL,{withCredentials: true});

      

      // Handle the accounts data as needed
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  }

  const handleDownloadReceipt = async () => {
    if (!receiptData) return;

    const { default: jsPDF } = await import('jspdf');
    const { credit_transaction, debit_transaction } = receiptData;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const margin = 10;
    let yPosition = 20;

    const addText = (text: string, x: number, y: number, fontSize: number, isBold = false) => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
      pdf.text(text, x, y);
      return y + (fontSize * 0.4);
    };

    pdf.setFont('helvetica', 'bold');
    yPosition = addText('Zinance Bank', margin, yPosition, 18, true);
    yPosition = addText('Transaction Receipt', margin, yPosition, 12);
    const formattedDate = new Date(Number(credit_transaction.timestamp)).toLocaleString();
    yPosition = addText(formattedDate, margin, yPosition, 10);
    yPosition += 5;

    pdf.setLineWidth(0.2);
    pdf.line(margin, yPosition, 210 - margin, yPosition);
    yPosition += 5;
    yPosition = addText(`Reference No: ${credit_transaction.transactionReferenceNumber}`, margin, yPosition, 10);
    yPosition = addText(`Transaction Type: ${credit_transaction.type.replace(/_/g, ' ')}`, margin, yPosition, 10);
    pdf.setTextColor(credit_transaction.status === 'SUCCESS' ? '#008000' : '#FF0000');
    yPosition = addText(`Status: ${credit_transaction.status}`, margin, yPosition, 10);
    pdf.setTextColor(0, 0, 0);
    yPosition += 5;

    pdf.line(margin, yPosition, 210 - margin, yPosition);
    yPosition += 5;
    yPosition = addText(`From Account: ${debit_transaction.accountNumber}`, margin, yPosition, 10);
    yPosition = addText(`To Account: ${credit_transaction.accountNumber}`, margin, yPosition, 10);
    yPosition = addText(`Amount: ₹${credit_transaction.amount}`, margin, yPosition, 10);
    if (credit_transaction.ifscCode) {
      yPosition = addText(`IFSC Code: ${credit_transaction.ifscCode}`, margin, yPosition, 10);
    }
    yPosition = addText(`Closing Balance: ₹${credit_transaction.closingBalance}`, margin, yPosition, 10);
    yPosition += 5;

    pdf.line(margin, yPosition, 210 - margin, yPosition);
    yPosition += 5;
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('This is a computer-generated receipt. No signature required.', margin, yPosition, { align: 'left' });

    pdf.save(`Transaction_Receipt_${Date.now()}.pdf`);
  };

  const handleCloseReceipt = () => {
    setReceiptData(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <Loading message="Loading your profile..." />
    </div>
  );
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <Sidebar />
      <TopBar user={user} />
      <main className="pl-64 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">Transfer Funds</h1>
            <p className="mt-2 text-lg text-gray-600">Securely send money to any account with ease.</p>
          </header>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="bg-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl animate-slide-up">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Transfer Details</h2>
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
              {message && (
                <div
                  className={`mt-4 p-4 rounded-lg text-sm font-medium animate fade-in ${
                    message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                  role="alert"
                >
                  {message}
                </div>
              )}
            </section>
            {receiptData && (
              <section className="bg-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl animate-slide-up">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Transaction Receipt</h2>
                <div ref={receiptRef}>
                  <TransactionReceipt
                    creditTransaction={receiptData.credit_transaction}
                    debitTransaction={receiptData.debit_transaction}
                    onClose={handleCloseReceipt}
                  />
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleDownloadReceipt}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!receiptData}
                    aria-label="Download transaction receipt as PDF"
                  >
                    <DownloadIcon fontSize="small" />
                    Download Receipt
                  </button>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}