'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ADMIN_PROFILE_URL, LOGOUT_URL, UPDATE_PROFILE_URL } from '@/lib/constants';
import { LogOut, Pencil, X } from 'lucide-react';
import axios from 'axios';

type Props = {
  user?: {
    name: string;
    email: string;
    employeeId: string;
    mobileNumber: string;
    branchId: string;
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
    branchId: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        branchId: user.branchId,
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
      const response = await axios.post(LOGOUT_URL, null, { withCredentials: true });
      if (response.status === 200) {
        window.location.href = '/login';
      } else {
        setLogoutError('Logout failed');
      }
    } catch {
      setLogoutError('Logout failed');
    }
  };

  useEffect(() => {
    if (isVisible && user) {
      axios
        .get(ADMIN_PROFILE_URL, { withCredentials: true })
        .then(res => console.log('User access recorded:', res.status))
        .catch(err => console.error('Error recording drawer open:', err));
    }
  }, [isVisible, user]);

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
    try {
      await axios.post(
        UPDATE_PROFILE_URL,
        {
          user_id: user.employeeId,
          name: formData.name,
          email: formData.email,
          mobile_number: formData.mobileNumber,
        },
        { withCredentials: true }
      );
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
          title="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <div>
          {/* Avatar + Logout */}
          <div className="flex flex-col items-center justify-center mb-4">
            <div className="relative h-20 w-20">
              <div className="h-full w-full rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 p-1 shadow-lg">
                <div className="h-full w-full rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-inner transition-transform duration-300 hover:scale-110 hover:shadow-xl">
                  {getInitials(user.name)}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="mt-4 flex items-center gap-2 px-5 py-3 text-red-500 text-base font-medium rounded-xl hover:text-red-800 transition-all duration-200 cursor-pointer"
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
            <h2 className="text-xl font-semibold text-blue-900">Profile</h2>
            {!isEditing && (
              <button
                className="text-blue-500 hover:text-blue-700 cursor-pointer"
                onClick={() => setIsEditing(true)}
                title="Edit"
              >
                <Pencil className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Info Fields */}
          <div className="space-y-3 text-gray-800 text-sm px-2">
            <p>
              <span className="font-medium text-gray-600">Employee ID:</span> {user.employeeId}
            </p>

            <p>
              <span className="font-medium text-gray-600">Name:</span>{' '}
              {isEditing ? (
                <input
                  className="border rounded p-1 w-full"
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                />
              ) : (
                formData.name
              )}
            </p>

            <p>
              <span className="font-medium text-gray-600">Email:</span>{' '}
              {isEditing ? (
                <input
                  className="border rounded p-1 w-full"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                />
              ) : (
                formData.email
              )}
            </p>

            <p>
              <span className="font-medium text-gray-600">Mobile:</span>{' '}
              {isEditing ? (
                <input
                  className="border rounded p-1 w-full"
                  value={formData.mobileNumber}
                  onChange={e => handleInputChange('mobileNumber', Number(e.target.value))}
                />
              ) : (
                formData.mobileNumber
              )}
            </p>

            <p>
              <span className="font-medium text-gray-600">Branch ID:</span>{' '}
              {formData.branchId}
            </p>
          </div>

          {/* Save / Cancel Buttons */}
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
                    branchId: user.branchId,
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
