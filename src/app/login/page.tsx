'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { LOGIN_URL } from '@/lib/constants';

export default function LoginPage() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        LOGIN_URL,
        {
          user_id: userId,
          password: password,
        },
        { withCredentials: true }
      );

      const user = response.data;

      if (user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (user.role === 'EMPLOYEE') {
        router.push('/employee/dashboard');
      } else if (user.role === 'CUSTOMER') {
        router.push('/customer/dashboard');
      } else {
        throw new Error('Unknown user role');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div
        className="absolute inset-0 opacity-80 transition-all duration-1000 ease-in-out"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.2), transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(147, 51, 234, 0.15), transparent 40%),
            linear-gradient(135deg, 
              #f0f9ff 0%, 
              #e0f2fe 25%, 
              #bae6fd 50%, 
              #a5f3fc 75%, 
              #c7f9cc 100%
            )`,
        }}
      />

      {/* Subtle Noise Overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
      }} />

      {/* Logo & Form Card */}
      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-10 space-y-6 border border-white/30 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-2">
          <div className="inline-block p-3 mb-4">
            <img
              src="/zinance-high-resolution-logo-transparent(1).png"
              alt="Zinance Logo"
              className="w-12 h-12 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Zinance</h1>
          <p className="text-gray-500 text-sm mt-1">Secure. Fast. Trusted.</p>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center text-gray-700 mt-4">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 text-sm">Please sign in to continue</p>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6 mt-6">
          {/* User ID (WPF-style) */}
          <div className="wpf-input-group">
            <input
              type="text"
              id="userId"
              placeholder=" "
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="wpf-input"
            />
            <label htmlFor="userId" className="wpf-label">User ID</label>
            <div className="wpf-underline"></div>
          </div>

          {/* Password (WPF-style) */}
          <div className="wpf-input-group">
            <input
              type="password"
              id="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="wpf-input"
            />
            <label htmlFor="password" className="wpf-label">Password</label>
            <div className="wpf-underline"></div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm text-center animate-pulse mt-4">
            <span className="flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-400 space-y-1">
          <p>© 2025 Zinance Bank. All rights reserved.</p>
          <p>Secure SSL Encrypted Login</p>
        </div>
      </div>

      {/* WPF-Style Input CSS */}
      <style jsx>{`
        .wpf-input-group {
          position: relative;
          margin-top: 1rem;
        }

        .wpf-input {
          width: 100%;
          padding: 10px 0;
          font-size: 16px;
          color: #1f2937;
          border: none;
          outline: none;
          background: transparent;
          border-bottom: 1px solid #d1d5db;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .wpf-input:focus {
          border-color: #6366f1;
          box-shadow: 0 1px 0 0 #6366f1;
        }

        .wpf-label {
          position: absolute;
          left: 0;
          top: 10px;
          font-size: 16px;
          color: #6b7280;
          pointer-events: none;
          transition: all 0.3s ease;
        }

        .wpf-input:focus ~ .wpf-label,
        .wpf-input:not(:placeholder-shown) ~ .wpf-label {
          top: -10px;
          font-size: 12px;
          color: #6366f1;
        }

        .wpf-underline {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: #d1d5db;
          transition: background-color 0.3s ease;
        }

        .wpf-input:focus ~ .wpf-underline {
          background: #6366f1;
          box-shadow: 0 1px 0 0 #6366f1;
        }

        /* Optional: Ripple effect on focus */
        .wpf-input:focus ~ .wpf-underline::after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: 0;
          width: 0;
          height: 2px;
          background: #8b5cf6;
          transition: width 0.4s ease;
        }

        .wpf-input:focus ~ .wpf-underline::after {
          left: 0;
          width: 100%;
        }

        /* Animation for fade-in */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}