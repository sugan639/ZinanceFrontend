'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/app/components/SideBar';
import TopBar from '@/app/components/TopBar';
import ProfileDrawer from '@/app/components/ProfileDrawer';
import axios from 'axios';
import {
  ADMIN_PROFILE_URL,
  GET_USER_URL,
  NEW_CUSTOMER_URL,
  NEW_EMPLOYEE_URL,
  UPDATE_USER_URL,
} from '@/lib/constants';

export default function UserManagementPage() {
  const [tab, setTab] = useState<'createCustomer' | 'createEmployee' | 'getUser'>('createCustomer');
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [responseData, setResponseData] = useState<any>(null);
  const [editableData, setEditableData] = useState<any>({});
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const resetForm = () => {
    setForm({});
    setResponseData(null);
    setEditableData({});
    setError('');
    setMessage('');
  };

  useEffect(() => {
    axios
      .get(ADMIN_PROFILE_URL, { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => (window.location.href = '/login'));
  }, []);

  const handleSubmit = async () => {
    setError('');
    setMessage('');
    try {
      const url = tab === 'createCustomer' ? NEW_CUSTOMER_URL : NEW_EMPLOYEE_URL;
      const res = await axios.post(url, form, { withCredentials: true });
      setMessage(res.data.message || 'User created successfully!');
      setResponseData(res.data);
      setForm({});
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to create user.');
    }
  };

  const handleFetch = async () => {
    setError('');
    setResponseData(null);
    if (!form.user_id) return setError('Please provide a user ID.');
    try {
      const res = await axios.get(GET_USER_URL + form.user_id, { withCredentials: true });
      setResponseData(res.data);

      // ✅ Use snake_case keys for consistency
      const editableKeys = [
        'name',
        'email',
        'pan_number',
        'mobile_number',
        'dob',
        'aadhar_number',
        'address',
      ];
      const initialEditState: any = {};
      editableKeys.forEach((key) => {
        if (res.data[key] !== undefined) {
          initialEditState[key] = res.data[key];
        }
      });
      setEditableData(initialEditState);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to fetch user.');
    }
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        ...editableData,
        user_id: form.user_id,
      };
      const res = await axios.post(UPDATE_USER_URL, payload, { withCredentials: true });
      setMessage(res.data.message || 'User updated successfully!');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Update failed.');
    }
  };

  const renderField = (name: string, placeholder: string, type: string = 'text') => (
    <input
      type={type}
      placeholder={placeholder}
      value={form[name] || ''}
      onChange={(e) => setForm({ ...form, [name]: e.target.value })}
      className="w-full px-3 py-2 border border-gray-500 rounded text-gray-900"
    />
  );

  return (
    <>
      <Sidebar />
      <TopBar />
      {user && <ProfileDrawer user={user} />}

      <main className="pl-64 pt-20 bg-gray-100 min-h-screen p-6">
        <div className="max-w-3xl mx-auto">
          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            {['createCustomer', 'createEmployee', 'getUser'].map((tabName) => (
              <button
                key={tabName}
                onClick={() => {
                  setTab(tabName as any);
                  resetForm();
                }}
                className={`px-4 py-2 rounded ${
                  tab === tabName ? 'bg-blue-700 text-white' : 'bg-white border text-blue-700'
                }`}
              >
                {tabName === 'createCustomer'
                  ? 'Add Customer'
                  : tabName === 'createEmployee'
                  ? 'Add Employee/Admin'
                  : 'Get User'}
              </button>
            ))}
          </div>

          {/* Forms */}
          <div className="bg-white shadow rounded p-6 space-y-4 text-gray-900">
            {tab === 'createCustomer' && (
              <>
                <h2 className="text-xl font-semibold text-blue-800">New Customer</h2>
                {renderField('name', 'Full Name')}
                {renderField('email', 'Email')}
                {renderField('mobile_number', 'Mobile Number')}
                <input
                  type="date"
                  value={form.dob ? new Date(form.dob).toISOString().split('T')[0] : ''}
                  onChange={(e) =>
                    setForm({ ...form, dob: new Date(e.target.value).getTime() })
                  }
                  className="w-full px-3 py-2 border border-gray-500 rounded text-gray-900"
                />
                {renderField('address', 'Address')}
                {renderField('aadhar_number', 'Aadhar Number')}
                {renderField('pan_number', 'PAN Number')}
                {renderField('branch_id', 'Branch ID')}
                <button
                  onClick={handleSubmit}
                  className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
                >
                  Create Customer
                </button>
                {responseData?.customerId && (
                  <div className="mt-4 p-4 border rounded bg-blue-100 text-blue-900">
                    <p><strong>Customer ID:</strong> {responseData.customerId}</p>
                    <p><strong>Temporary Password:</strong> {responseData.newPassword}</p>
                  </div>
                )}
              </>
            )}

            {tab === 'createEmployee' && (
              <>
                <h2 className="text-xl font-semibold text-blue-800">New Employee/Admin</h2>
                {renderField('name', 'Full Name')}
                {renderField('email', 'Email')}
                {renderField('mobile_number', 'Mobile Number')}
                {renderField('branch_id', 'Branch ID')}
                <select
                  value={form.role || ''}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-500 rounded text-gray-900"
                >
                  <option value="">Select Role</option>
                  <option value="EMPLOYEE">EMPLOYEE</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                <button
                  onClick={handleSubmit}
                  className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
                >
                  Create Employee/Admin
                </button>
              </>
            )}

            {tab === 'getUser' && (
              <>
                <h2 className="text-xl font-semibold text-blue-800">Get User</h2>
                {renderField('user_id', 'Enter User ID')}
                <button
                  onClick={handleFetch}
                  className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
                >
                  Fetch User
                </button>
              </>
            )}

            {message && <p className="text-green-600 font-semibold">{message}</p>}
            {error && <p className="text-red-600 font-semibold">{error}</p>}
          </div>

          {/* Editable User Data */}
          {responseData && tab === 'getUser' && (
            <div className="bg-white shadow mt-6 rounded p-6">
              <h3 className="text-lg font-bold text-blue-800 mb-4">Edit User Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-gray-900">
                {Object.entries(responseData).map(([key, val]) => {
                  const isEditable = [
                    'name',
                    'email',
                    'pan_number',
                    'mobile_number',
                    'dob',
                    'aadhar_number',
                    'address',
                  ].includes(key);

                  const isDate = key.toLowerCase().includes('dob');
                  const displayValue = isDate && !isNaN(Number(val))
                    ? new Date(Number(val)).toLocaleDateString()
                    : String(val);

                  return (
                    <div key={key}>
                      <label className="font-medium block mb-1 capitalize">
                        {key.replace(/_/g, ' ')}
                      </label>
                      {isEditable ? (
                        isDate ? (
                          <input
                            type="date"
                            className="border px-2 py-1 rounded w-full text-gray-900 border-gray-500"
                            value={
                              editableData[key]
                                ? new Date(Number(editableData[key])).toISOString().split('T')[0]
                                : ''
                            }
                            onChange={(e) =>
                              setEditableData({
                                ...editableData,
                                [key]: new Date(e.target.value).getTime(),
                              })
                            }
                          />
                        ) : (
                          <input
                            className="border px-2 py-1 rounded w-full text-gray-900 border-gray-500"
                            value={editableData[key] || ''}
                            onChange={(e) =>
                              setEditableData({ ...editableData, [key]: e.target.value })
                            }
                          />
                        )
                      ) : (
                        <input
                          className="border px-2 py-1 rounded w-full bg-gray-100 text-gray-700"
                          value={displayValue}
                          disabled
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <button
                onClick={handleUpdate}
                className="mt-6 w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
