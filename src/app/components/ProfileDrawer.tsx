'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getUserData, LOGOUT_URL, UPDATE_PROFILE_URL } from '@/lib/constants';
import { LogOut, Pencil } from 'lucide-react';
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
};

export default function ProfileDrawer({ user }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // ✅ Guard: Wait until user is available
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
        .get(getUserData(user.employeeId), { withCredentials: true })
        .then(res => console.log('User access recorded:', res.status))
        .catch(err => console.error('Error recording drawer open:', err));
    }
  }, [isVisible, user]);

  const DRAWER_WIDTH = 320;
  const EDGE_THRESHOLD = 20;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cursorX = e.clientX;
      const windowWidth = window.innerWidth;
      const distanceFromRight = windowWidth - cursorX;
      const drawerLeftEdge = windowWidth - DRAWER_WIDTH;

      if (distanceFromRight <= EDGE_THRESHOLD) setIsVisible(true);
      else if (cursorX < drawerLeftEdge) setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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

  // ⛔ Don't render if user is null
  if (!user) return null;

  return (
    <div
      ref={drawerRef}
      className={`fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-blue-100 to-white shadow-xl border-l border-gray-200 transform transition-transform duration-300 ease-in-out z-50 ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-6 h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-center mb-6">
            <div className="relative h-20 w-20">
              <div className="h-full w-full rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 p-1 shadow-lg">
                <div className="h-full w-full rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-inner transition-transform duration-300 hover:scale-110 hover:shadow-xl">
                  {getInitials(user.name)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-blue-900">Welcome, {user.name}</h2>
            {!isEditing && (
              <button className="text-blue-500 hover:text-blue-700" onClick={() => setIsEditing(true)}>
                <Pencil className="w-5 h-5" />
              </button>
            )}
          </div>

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
              {isEditing ? (
                <input
                  className="border rounded p-1 w-full"
                  value={formData.branchId}
                  onChange={e => handleInputChange('branchId', Number(e.target.value))}
                />
              ) : (
                formData.branchId
              )}
            </p>
          </div>

          {isEditing && (
            <div className="mt-4 flex justify-between">
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
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
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div>
          <button
            onClick={handleLogout}
            className="mt-8 w-full flex items-center justify-center gap-2 px-5 py-3 bg-gray-100 text-gray-800 text-base font-medium rounded-xl hover:bg-red-100 hover:text-red-700 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Sign out
          </button>

          {logoutError && (
            <p className="text-red-500 text-sm mt-2 text-center">{logoutError}</p>
          )}
        </div>
      </div>
    </div>
  );
}
