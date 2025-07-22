'use client';

import React, { useState, useEffect, useRef } from 'react';
import { EMPLOYEE_PROFILE_URL, LOGOUT_URL, EMPLOYEE_UPDATE_PROFILE_URL } from '@/lib/constants';
import { LogOut, Pencil, X } from 'lucide-react';
import axios from 'axios';
import Loading from '@/app/Loading';
import ErrorMessage from '@/app/ErrorMessage';

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
  const [profileError, setProfileError] = useState('');
  const [loading, setLoading] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    branchId: '',
  });

  useEffect(() => {
    if (typeof visible === 'boolean') {
      setIsVisible(visible);
    }
  }, [visible]);

  useEffect(() => {
    if (!user && isVisible) {
      fetchProfile();
    } else if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        branchId: user.branchId,
      });
    }
  }, [user, isVisible]);

  const fetchProfile = async () => {
    setLoading(true);
    setProfileError('');
    try {
      const response = await axios.get(EMPLOYEE_PROFILE_URL, { withCredentials: true });
      const userData = response.data;
      setFormData({
        name: userData.name,
        email: userData.email,
        mobileNumber: userData.mobileNumber,
        branchId: userData.branchId,
      });
    } catch (e: any) {
      const errorMsg = e?.response?.data?.error || e.message || 'Failed to load profile';
      setProfileError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

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

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      await axios.put(
        EMPLOYEE_UPDATE_PROFILE_URL,
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

  if (!isVisible) return null;

  return (
    <div
      ref={drawerRef}
      className={`fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-blue-100 to-white shadow-xl border-l border-gray-200 transform transition-transform duration-300 ease-in-out z-50 ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-6 flex flex-col  relative h-full">
        {/* ❌ Close Button */}
        <button
          onClick={() => setVisible?.(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition"
          title="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {loading ? (
          <Loading message="Loading profile..." />
        ) : profileError ? (
          <ErrorMessage message={profileError} onClose={() => setProfileError('')} />
        ) : (
          <>
            {/* Avatar */}
            <div className="flex flex-col items-center justify-center mb-4">
              <div className="relative h-20 w-20">
                <div className="h-full w-full rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 p-1 shadow-lg">
                  <div className="h-full w-full rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-inner transition-transform duration-300 hover:scale-110 hover:shadow-xl">
                    {getInitials(formData.name)}
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
                <span className="font-medium text-gray-700">Employee ID:</span>{' '}
                <span className="text-black">{user?.employeeId || 'N/A'}</span>
              </p>

              <p>
                <span className="font-medium text-gray-700">Name:</span>{' '}
                {isEditing ? (
                  <input
                    className="border rounded p-1 w-full"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                ) : (
                  <span className="text-black">{formData.name}</span>
                )}
              </p>

              <p>
                <span className="font-medium text-gray-700">Email:</span>{' '}
                {isEditing ? (
                  <input
                    className="border rounded p-1 w-full"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                ) : (
                  <span className="text-black">{formData.email}</span>
                )}
              </p>

              <p>
                <span className="font-medium text-gray-700">Mobile:</span>{' '}
                {isEditing ? (
                  <input
                    className="border rounded p-1 w-full"
                    value={formData.mobileNumber}
                    onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                  />
                ) : (
                  <span className="text-black">{formData.mobileNumber}</span>
                )}
              </p>

              <p>
                <span className="font-medium text-gray-700">Branch ID:</span>{' '}
                <span className="text-black">{formData.branchId}</span>
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
                      name: user?.name || '',
                      email: user?.email || '',
                      mobileNumber: user?.mobileNumber || '',
                      branchId: user?.branchId || '',
                    });
                  }}
                  className="cursor-pointer bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
