'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CUSTOMER_UPDATE_PROFILE_URL, LOGOUT_URL } from '@/lib/constants';
import { LogOut, Pencil, X } from 'lucide-react';
import axios from 'axios';

type Props = {
  user?: {
    name: string;
    email: string;
    customerId: string;
    mobileNumber: string;
    address: string;
    dob: string;
    panNumber: string;
    aadharNumber: string;
    [key: string]: any;
  } | null;
  visible?: boolean;
  setVisible?: (val: boolean) => void;
};

export default function ProfileDrawer({ user, visible, setVisible }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    address: '',
    dob: '', // in DD-MM-YYYY format
  });

  // Convert epoch millis to DD-MM-YYYY
  const convertToDisplayDate = (millis: string) => {
    const date = new Date(Number(millis));
    if (isNaN(date.getTime())) return '';
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  // Convert DD-MM-YYYY to epoch millis
  const convertToEpochMillis = (ddmmyyyy: string) => {
    const [dd, mm, yyyy] = ddmmyyyy.split('-');
    const date = new Date(`${yyyy}-${mm}-${dd}`);
    return date.getTime();
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        address: user.address,
        dob: convertToDisplayDate(user.dob),
      });
    }
  }, [user]);

  useEffect(() => {
    if (typeof visible === 'boolean') {
      setIsVisible(visible);
    }
  }, [visible]);

  const handleLogout = async () => {
    try {
      const res = await axios.post(LOGOUT_URL, null, { withCredentials: true });
      if (res.status === 200) {
        window.location.href = '/login';
      } else {
        setLogoutError('Logout failed');
      }
    } catch {
      setLogoutError('Logout failed');
    }
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user) return;

    const payload: any = { user_id: user.customerId };

    if (formData.name !== user.name) payload.name = formData.name;
    if (formData.email !== user.email) payload.email = formData.email;
    if (formData.mobileNumber !== user.mobileNumber)
      payload.mobile_number = formData.mobileNumber;
    if (formData.address !== user.address) payload.address = formData.address;

    if (formData.dob && /^\d{2}-\d{2}-\d{4}$/.test(formData.dob)) {
      const millis = convertToEpochMillis(formData.dob);
      if (!isNaN(millis)) {
        payload.dob = millis;
      }
    }

    try {
      await axios.put(CUSTOMER_UPDATE_PROFILE_URL, payload, {
        withCredentials: true,
      });
      setIsEditing(false);
    } catch {
      alert('Failed to update profile');
    }
  };

  if (!user) return null;

  return (
    <div
      ref={drawerRef}
      className={`fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-blue-100 to-white shadow-xl border-l border-gray-200 transform transition-transform duration-300 ease-in-out z-50 ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-6 flex flex-col justify-between relative">
        {/* ❌ Close Button */}
        <button
          onClick={() => setVisible?.(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition"
       
        >
          <X className="w-6 h-6" />
        </button>

        <div>
          {/* Avatar */}
          <div className="flex flex-col items-center justify-center mb-4">
            <div className="relative h-20 w-20">
              <div className="h-full w-full rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 p-1 shadow-lg">
                <div className="h-full w-full rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-inner transition-transform duration-300 hover:scale-110 hover:shadow-xl">
                  {getInitials(user.name)}
                </div>
              </div>
            </div>


                       {/* Logout */}
     
         <button
              onClick={handleLogout}
              className="mt-4 flex items-center  gap-2 px-5 py-3 text-red-500 text-base font-medium rounded-xl  hover:text-red-800 transition-all duration-200 cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>

                      {logoutError && (
                        <p className="text-red-500 text-sm mt-2 text-center">{logoutError}</p>
                      )}
              
  
          </div>

 

          {/* Header */}
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-xl font-semibold text-blue-900">    Profile</h2>
            {!isEditing && (
              <button className="text-blue-500 hover:text-blue-700 cursor-pointer" onClick={() => setIsEditing(true)} title='Edit'>
                <Pencil className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Info Fields */}
          <div className="space-y-3 text-gray-800 text-sm px-2">
            <p>
              <span className="font-medium text-gray-600">Customer ID:</span> {user.customerId}
            </p>

            <p>
              <span className="font-medium text-gray-600">Name:</span>{' '}
              {isEditing ? (
                <input className="border rounded p-1 w-full" value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)} />
              ) : (
                formData.name
              )}
            </p>

            <p>
              <span className="font-medium text-gray-600">Email:</span>{' '}
              {isEditing ? (
                <input className="border rounded p-1 w-full" value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)} />
              ) : (
                formData.email
              )}
            </p>

            <p>
              <span className="font-medium text-gray-600">Mobile:</span>{' '}
              {isEditing ? (
                <input className="border rounded p-1 w-full" value={formData.mobileNumber}
                  onChange={e => handleInputChange('mobileNumber', Number(e.target.value))} />
              ) : (
                formData.mobileNumber
              )}
            </p>

<div>
  <span className="font-medium text-gray-600">DOB:</span>{' '}
  {isEditing ? (
    <>
      <input
        type="date"
        className="border rounded p-1 w-full"
        value={
          (() => {
            const parts = formData.dob.split('-');
            if (parts.length === 3) {
              const [dd, mm, yyyy] = parts;
              return `${yyyy}-${mm}-${dd}`;
            }
            return '';
          })()
        }
        onChange={e => {
          const iso = e.target.value; // yyyy-mm-dd
          if (iso) {
            const [yyyy, mm, dd] = iso.split('-');
            handleInputChange('dob', `${dd}-${mm}-${yyyy}`);
              }
            }}
          />
          <p className="text-xs text-gray-500 mt-1">Format: DD-MM-YYYY</p>
        </>
      ) : (
        formData.dob
      )}
    </div>



            <p>
              <span className="font-medium text-gray-600">Address:</span>{' '}
              {isEditing ? (
                <input className="border rounded p-1 w-full" value={formData.address}
                  onChange={e => handleInputChange('address', e.target.value)} />
              ) : (
                formData.address
              )}
            </p>

            <p>
              <span className="font-medium text-gray-600">Aadhar Number:</span> {user.aadharNumber}
            </p>

            <p>
              <span className="font-medium text-gray-600">PAN Number:</span> {user.panNumber}
            </p>
          </div>

          {/* Save / Cancel */}
          {isEditing && (
            <div className="mt-4 flex justify-between">
              <button
                onClick={handleSave}
                className="cursor-pointer bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: user.name,
                    email: user.email,
                    mobileNumber: user.mobileNumber,
                    address: user.address,
                    dob: convertToDisplayDate(user.dob),
                  });
                }}
                className="cursor-pointer bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
