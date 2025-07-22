'use client';

import React from 'react';

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

const transactionTypes = [
  'INTRA_BANK',
  'INTER_BANK',
];

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
  return (
    <div className="flex justify-center items-center h-auto">
      <div className="p-6 bg-white rounded shadow-md w-full max-w-md ">
        <h2 className="text-lg font-semibold mb-4 text-blue-800">
          {type === 'DEPOSIT' && 'Deposit Money'}
          {type === 'WITHDRAW' && 'Withdraw Money'}
          {type === 'TRANSFER' && 'Transfer Money'}
        </h2>

        {type === 'TRANSFER' ? (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">From Account</label>
              <input
                type="text"
                value={fromAccount}
                onChange={(e) => onFromAccountChange?.(e.target.value)}
                className="mt-1 block w-full border rounded px-3 py-2 shadow-sm text-gray-900"
                placeholder="Sender account number"
              />
            </div>


            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">To Account</label>
              <input
                type="text"
                value={toAccount}
                onChange={(e) => onToAccountChange?.(e.target.value)}
                className="mt-1 block w-full border rounded px-3 py-2 shadow-sm text-gray-900"
                placeholder="Recipient account number"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => onAmountChange(e.target.value)}
                className="mt-1 block w-full border rounded px-3 py-2 shadow-sm text-gray-900"
                placeholder="Enter amount"
              />
            </div>





            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Transaction Type</label>
              <select
                value={txType}
                onChange={(e) => onTxTypeChange?.(e.target.value)}
                className="mt-1 block w-full border rounded px-3 py-2 shadow-sm text-gray-900"
              >
                <option value="">Select type</option>
                {transactionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {(txType === 'INTER_BANK' ) && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={(e) => onIFSCChange?.(e.target.value)}
                  className="mt-1 block w-full border rounded px-3 py-2 shadow-sm text-gray-900"
                  placeholder="Enter IFSC code"
                />
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => onAccountChange(e.target.value)}
                className="mt-1 block w-full border rounded px-3 py-2 shadow-sm text-gray-900"
                placeholder="Enter account number"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => onAmountChange(e.target.value)}
                className="mt-1 block w-full border rounded px-3 py-2 shadow-sm text-gray-900"
                placeholder="Enter amount"
              />
            </div>
          </>
        )}

        <button
          onClick={onSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {type === 'DEPOSIT' && 'Make Deposit'}
          {type === 'WITHDRAW' && 'Make Withdrawal'}
          {type === 'TRANSFER' && 'Make Transfer'}
        </button>

        {message && <p className="mt-4 text-sm text-center text-green-700">{message}</p>}
      </div>
    </div>
  );
}
