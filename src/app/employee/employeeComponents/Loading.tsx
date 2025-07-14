'use client';

import React from 'react';
import Image from 'next/image';


export default function Loading({ message = 'Please wait while we process your request...' }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="flex flex-col items-center space-y-6 animate-fade-in">
        {/* Optional: Animated bank icon */}
        <div className="animate-bounce">
          <Image
            src="/zinance_logo.png"
            alt="Bank Logo"
            width={150}
            height={150}
            className="rounded-full shadow-lg"
          />
        </div>

        {/* Spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6l4 2"
              />
            </svg>
          </div>
        </div>

        {/* Message */}
        <p className="text-xl font-medium text-blue-800 text-center">{message}</p>
      </div>
    </div>
  );
}
