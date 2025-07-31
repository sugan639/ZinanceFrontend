'use client';

import React, { useState } from 'react';
import axios from 'axios';

const ADD_BENEFICIARY_URL = 'http://localhost:8080/Banking_App/customer/beneficiaries/add';

export default function AddBeneficiaryForm() {
  const [form, setForm] = useState({
    beneficiary_account_number: '',
    beneficiary_name: '',
    ifsc_code: '',
    nickname: '',
    bank_name: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const { beneficiary_account_number, beneficiary_name, ifsc_code } = form;

    if (!beneficiary_account_number || !beneficiary_name || !ifsc_code) {
      setError('Account number, Name and IFSC code are required.');
      return;
    }

    try {
      const response = await axios.post(ADD_BENEFICIARY_URL, form, {
        withCredentials: true,
      });
      setMessage('Beneficiary added successfully.');
      setForm({
        beneficiary_account_number: '',
        beneficiary_name: '',
        ifsc_code: '',
        nickname: '',
        bank_name: '',
      });
    } catch (err) {
      console.error(err);
      setError('Failed to add beneficiary.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Beneficiary</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: 'Account Number', name: 'beneficiary_account_number' },
          { label: 'Beneficiary Name', name: 'beneficiary_name' },
          { label: 'IFSC Code', name: 'ifsc_code' },

        ].map(({ label, name }) => (
          <div key={name}>
            <label className="block mb-1 text-sm text-gray-600">{label}</label>
            <input
              type="text"
              name={name}
              value={form[name as keyof typeof form]}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          Add Beneficiary
        </button>
        {message && <p className="text-green-600 mt-2">{message}</p>}
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  );
}
