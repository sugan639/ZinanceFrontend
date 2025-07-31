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
};

const transactionTypes = ['INTRA_BANK', 'INTER_BANK'] as const;

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
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all hover:shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          {type === 'DEPOSIT' && (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Make Deposit
            </>
          )}
          {type === 'WITHDRAW' && (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
              Withdraw Funds
            </>
          )}
          {type === 'TRANSFER' && (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Transfer Money
            </>
          )}
        </h2>
      </div>

      <div className="p-6 space-y-5">
        {/* Deposit/Withdraw Form */}
        {type !== 'TRANSFER' ? (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Account Number</label>
              <div className="relative">
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => onAccountChange(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter account number"
                />
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => onAmountChange(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter amount"
                />
          
              </div>
            </div>
          </>
        ) : (
          /* Transfer Form */
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">From Account</label>
              <div className="relative">
                <input
                  type="text"
                  value={fromAccount}
                  onChange={(e) => onFromAccountChange?.(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Sender account number"
                />
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">To Account</label>
              <div className="relative">
                <input
                  type="text"
                  value={toAccount}
                  onChange={(e) => onToAccountChange?.(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Recipient account number"
                />
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => onAmountChange(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter amount"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Transaction Type</label>
              <select
                value={txType}
                onChange={(e) => onTxTypeChange?.(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              >
                <option value="">Select type</option>
                {transactionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.replace('_', ' ')}
                  </option>
                ))}
              </select>
              <span className="absolute left-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </span>
            </div>

            {txType === 'INTER_BANK' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
                <div className="relative">
                  <input
                    type="text"
                    value={ifscCode}
                    onChange={(e) => onIFSCChange?.(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="BKID000XXXX"
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </span>
                </div>
              </div>
            )}
          </>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <button
            onClick={onSubmit}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium py-2.5 rounded-lg shadow transition transform hover:scale-[1.02]"
          >
            Confirm {type === 'DEPOSIT' ? 'Deposit' : type === 'WITHDRAW' ? 'Withdrawal' : 'Transfer'}
          </button>
        </div>
      </div>
    </div>
  );
}