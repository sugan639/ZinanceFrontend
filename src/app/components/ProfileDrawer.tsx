'use client';

import React, { useState, useEffect, useRef } from 'react';
import { LOGOUT_URL } from '@/lib/constants';
import { LogOut, User2 } from 'lucide-react'; // Modern Lucide icons

type Props = {
  user: {
    name: string;
    email: string;
    employeeId: number;
    mobileNumber: number;
    [key: string]: any;
  };
};

export default function ProfileDrawer({ user }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const drawerRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      const response = await fetch(LOGOUT_URL, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        window.location.href = '/login';
      } else {
        setLogoutError('Logout failed');
        console.error('Logout failed');
      }
    } catch (error) {
      setLogoutError('Logout failed');
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const distanceFromRight = window.innerWidth - e.clientX;

      if (distanceFromRight <= 20) {
        setIsVisible(true);
      } else if (
        distanceFromRight > 240 &&
        !drawerRef.current?.contains(e.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Get initials from user name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  };

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
            <div className="h-16 w-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-inner">
              {getInitials(user.name)}
            </div>
          </div>

          <h2 className="text-xl text-center font-semibold text-blue-900 mb-4">Welcome, {user.name}</h2>

          <div className="space-y-3 text-gray-800 text-sm px-2">
            <p>
              <span className="font-medium text-gray-600">Employee ID:</span> {user.employeeId}
            </p>
            <p>
              <span className="font-medium text-gray-600">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-medium text-gray-600">Mobile:</span> {user.mobileNumber}
            </p>
          </div>
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
