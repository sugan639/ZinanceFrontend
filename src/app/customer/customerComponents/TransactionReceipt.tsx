'use client';

import React from 'react';

type Transaction = {
  transactionReferenceNumber: string;
  transactionId: string | null;
  amount: string;
  accountNumber: string;
  beneficiaryAccountNumber: string;
  closingBalance: string;
  type: string;
  doneBy: string;
  userId: string;
  timestamp: string;
  ifscCode: string | null;
  status: string;
  beneficiaryId: string | null;
};

type Props = {
  creditTransaction: Transaction;
  debitTransaction: Transaction;
};

const TransactionReceipt: React.FC<Props> = ({ creditTransaction, debitTransaction }) => {
  const formatDate = (epoch: string) => {
    const date = new Date(Number(epoch));
    return date.toLocaleString();
  };

  return (
    <div className="mt-10 mx-auto max-w-md bg-white shadow-xl border border-gray-300 rounded-lg p-6 text-gray-800 font-mono">
      {/* Header */}
      <div className="text-center border-b pb-4 mb-4">
        <h2 className="text-xl font-bold text-blue-800">Zinance Bank</h2>
        <p className="text-sm text-gray-600">Transaction Receipt</p>
        <p className="text-xs text-gray-500">{formatDate(creditTransaction.timestamp)}</p>
      </div>

      {/* Reference */}
      <div className="mb-4">
        <div className="flex justify-between text-sm">
          <span className="font-semibold">Reference No:</span>
          <span>{creditTransaction.transactionReferenceNumber}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="font-semibold">Transaction Type:</span>
          <span>{creditTransaction.type.replace(/_/g, ' ')}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="font-semibold">Status:</span>
          <span className={`font-semibold ${creditTransaction.status === 'SUCCESS' ? 'text-green-600' : 'text-red-600'}`}>
            {creditTransaction.status}
          </span>
        </div>
      </div>

      {/* Amount & Accounts */}
      <div className="border-t pt-4 text-sm space-y-2">
        <div className="flex justify-between">
          <span className="font-semibold">From Account:</span>
          <span>{debitTransaction.accountNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">To Account:</span>
          <span>{creditTransaction.accountNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Amount:</span>
          <span>₹{creditTransaction.amount}</span>
        </div>
        {creditTransaction.ifscCode && (
          <div className="flex justify-between">
            <span className="font-semibold">IFSC Code:</span>
            <span>{creditTransaction.ifscCode}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="font-semibold">Closing Balance:</span>
          <span>₹{creditTransaction.closingBalance}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-xs text-gray-500 border-t pt-4 text-center">
        This is a computer-generated receipt.<br />No signature required.
      </div>
    </div>
  );
};

export default TransactionReceipt;
