'use client';

import React, { useState, useEffect } from 'react';

import axios from 'axios';
import {
  EMPLOYEE_PROFILE_URL,
  GET_USER__BY_EMPLOYEE,
  NEW_CUSTOMER_BY_EMPLOYEE,
  UPDATE_USER_BY_EMPLOYEE
 
} from '@/lib/constants';
import Loading from '@/app/Loading';
import ProfileDrawer from '../employeeComponents/ProfileDrawer';
import TopBar from '../employeeComponents/TopBar';
import Sidebar from '../employeeComponents/SideBar';

export default function UserManagementPage() {
  const [tab, setTab] = useState<'createCustomer' | 'createEmployee' | 'getUser'>('createCustomer');
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [responseData, setResponseData] = useState<any>(null);
  const [editableData, setEditableData] = useState<any>({});
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const resetForm = () => {
    setForm({});
    setResponseData(null);
    setEditableData({});
    setError('');
    setMessage('');
  };

  useEffect(() => {
    axios
      .get(EMPLOYEE_PROFILE_URL, { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => (window.location.href = '/login'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    setError('');
    setMessage('');
    try {
      let url = NEW_CUSTOMER_BY_EMPLOYEE;
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
      const res = await axios.get(GET_USER__BY_EMPLOYEE + form.user_id, { withCredentials: true });
      setResponseData(res.data);

          const isEditable = [
      'name',
      'email',
      'pan_number',
      'mobile_number',
      'dob',
      'aadhar_number',
      'address',
    ];

      const initialEditState: any = {};
      isEditable.forEach((key) => {
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

      const res = await axios.post(UPDATE_USER_BY_EMPLOYEE, payload, { withCredentials: true });
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


  // Page loading
  if(loading){
   return <Loading message="Loading user management..." />;
  }

  return (
    <>
      <Sidebar />
      <TopBar user={user} />
      {user && <ProfileDrawer user={user} />}

      <main className="pl-64 pt-20 bg-gray-100 min-h-screen p-6">
        <div className="max-w-3xl mx-auto">
          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            {['createCustomer', 'getUser'].map((tabName) => (
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
                  onChange={(e) => {
                    const dobMillis = new Date(e.target.value).getTime();
                    setForm({ ...form, dob: dobMillis });
                  }}
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
                      <label className="font-medium block mb-1">
                        {key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/\b\w/g, (l) => l.toUpperCase())}
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
                          type={['mobile_number', 'aadhar_number'].includes(key) ? 'number' : 'text'}
                          className="border px-2 py-1 rounded w-full text-gray-900 border-gray-500"
                          value={editableData[key]?.toString() || ''}
                          onChange={(e) =>
                            setEditableData({
                              ...editableData,
                              [key]: ['mobile_number', 'aadhar_number'].includes(key)
                                ? Number(e.target.value)
                                : e.target.value,
                            })
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
