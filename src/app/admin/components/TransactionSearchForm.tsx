'use client';
import React, { useState } from 'react';

type Props = {
  onSubmit: (params: any) => void;
  message?: string;
};

export default function TransactionSearchForm({ onSubmit, message }: Props) {
  const [mode, setMode] = useState<'BY_ID' | 'BY_FILTER'>('BY_ID');
  const [txnId, setTxnId] = useState('');
  const [refNo, setRefNo] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [limit, setLimit] = useState('10');
  const [offset, setOffset] = useState('0');
  const [formError, setFormError] = useState('');

  const handleSubmit = () => {
    setFormError('');

    if (mode === 'BY_ID') {
      if (txnId && refNo) {
        setFormError('Please provide only one: either Transaction ID or Reference Number.');
        return;
      }
      if (!txnId && !refNo) {
        setFormError('Please provide either Transaction ID or Reference Number.');

        return;
      }


      return onSubmit({
        ...(txnId && { transaction_id: Number(txnId) }),
        ...(refNo && { transaction_reference_number: Number(refNo) }),
      });
    }

    const hasCustomerId = !!customerId.trim();
    const hasAccountNumber = !!accountNumber.trim();

    if ((hasCustomerId && hasAccountNumber) || (!hasCustomerId && !hasAccountNumber)) {
      setFormError('Please provide either Customer ID or Account Number — not both.');
      return;
    }

    if (!fromDate || !toDate) {
      setFormError('Please select both From and To dates.');
      return;
    }

    const payload: any = {
      from_date: Date.parse(fromDate),
      to_date: Date.parse(toDate),
      limit: Number(limit),
      offset: Number(offset),
    };

    if (hasCustomerId){
        payload.customer_id = Number(customerId);
    } 
    if (hasAccountNumber){
        payload.account_number = Number(accountNumber);
    }

    onSubmit(payload);
  };

  return (
    <div className="p-6 bg-white rounded shadow-md w-full max-w-lg mx-auto">
      <h2 className="text-lg font-semibold mb-4 text-blue-800">Find Transactions</h2>

      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => {
            setMode('BY_ID');
            setFormError('');
          }}
          className={`px-4 py-2 rounded ${mode === 'BY_ID' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          By Transaction / Ref No
        </button>
        <button
          onClick={() => {
            setMode('BY_FILTER');
            setFormError('');
          }}
          className={`px-4 py-2 rounded ${mode === 'BY_FILTER' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          By Customer / Date
        </button>
      </div>

      {mode === 'BY_ID' ? (
        <div className="space-y-3">
          <input
            value={txnId}
            onChange={e => setTxnId(e.target.value)}
            placeholder="Transaction ID"
            type="text"
            className="w-full border rounded px-3 py-2 text-gray-900"
          />
          <div className="text-center text-sm text-gray-500">-- or --</div>
          <input
            value={refNo}
            onChange={e => setRefNo(e.target.value)}
            placeholder="Transaction Ref No"
            type="text"
            className="w-full border rounded px-3 py-2 text-gray-900"
          />
        </div>
      ) : (
        <div className="space-y-3">
          <input
            value={customerId}
            onChange={e => setCustomerId(e.target.value)}
            placeholder="Customer ID"
            type="text"
            className="w-full border rounded px-3 py-2 text-gray-900"
          />
          <div className="text-center text-sm text-gray-500">-- or --</div>
          <input
            value={accountNumber}
            onChange={e => setAccountNumber(e.target.value)}
            placeholder="Account Number"
            type="text"
            className="w-full border rounded px-3 py-2 text-gray-900"
          />

          <div className="flex space-x-2">
            <input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className="flex-1 border rounded px-3 py-2 text-gray-900"
            />
            <input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className="flex-1 border rounded px-3 py-2 text-gray-900"
            />
          </div>

          <div className="flex space-x-2">
            <input
              type="number"
              value={limit}
              onChange={e => setLimit(e.target.value)}
              placeholder="Limit"
              className="w-1/2 border rounded px-3 py-2 text-gray-900"
            />
            <input
              type="number"
              value={offset}
              onChange={e => setOffset(e.target.value)}
              placeholder="Offset"
              className="w-1/2 border rounded px-3 py-2 text-gray-900"
            />
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Search
      </button>

      {formError && <p className="mt-2 text-sm text-center text-red-600">{formError}</p>}
      {message && <p className="mt-1 text-sm text-center text-green-700">{message}</p>}
    </div>
  );
}
