'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ADMIN_PROFILE_URL, LOGOUT_URL, UPDATE_PROFILE_URL } from '@/lib/constants';
import { LogOut, Pencil, X, Check, Lock, AlertCircle } from 'lucide-react';
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
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // ✅ New state
  const drawerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
      });
    }
  }, [user]);

  useEffect(() => {
    setIsVisible(!!visible);
    if (visible) {
      setIsEditing(false);
      setIsChangingPassword(false);
      setLogoutError('');
      setPasswordSuccess('');
      setPasswordErrors([]);
    }
  }, [visible]);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Validate password
  const validatePassword = (): boolean => {
    const { newPassword, confirmPassword } = passwordData;
    const errors: string[] = [];

    if (!newPassword || !confirmPassword) {
      errors.push('All fields are required.');
    } else {
      if (newPassword.length < 8) {
        errors.push('Password must be at least 8 characters.');
      }
      if (!/(?=.*[a-z])/.test(newPassword)) {
        errors.push('Password must contain a lowercase letter.');
      }
      if (!/(?=.*[A-Z])/.test(newPassword)) {
        errors.push('Password must contain an uppercase letter.');
      }
      if (!/(?=.*\d)/.test(newPassword)) {
        errors.push('Password must contain a number.');
      }
      if (!/(?=.*[@$!%*?&])/.test(newPassword)) {
        errors.push('Password must contain a special character (@$!%*?&).');
      }
      if (newPassword !== confirmPassword) {
        errors.push('Passwords do not match.');
      }
    }

    setPasswordErrors(errors);
    return errors.length === 0;
  };

  // Handle profile save
  const handleProfileSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const payload: any = { employee_id: user.employeeId };

      if (formData.name !== user.name) payload.name = formData.name;
      if (formData.email !== user.email) payload.email = formData.email;
      if (formData.mobileNumber !== user.mobileNumber)
        payload.mobile_number = formData.mobileNumber;

      await axios.put(UPDATE_PROFILE_URL, payload, { withCredentials: true });
      setIsEditing(false);
      setPasswordSuccess('Profile updated successfully!');
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (!validatePassword()) return;

    setIsSaving(true);
    try {
      await axios.put(
        UPDATE_PROFILE_URL,
        {
          employee_id: user?.employeeId,
          new_password: passwordData.newPassword,
        },
        { withCredentials: true }
      );
      setPasswordSuccess('Password updated successfully!');
      setPasswordData({ newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err: any) {
      setPasswordErrors([
        err?.response?.data?.error || 'Failed to update password.',
      ]);
    } finally {
      setIsSaving(false);
    }
  };

  // Show confirmation dialog
  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  // Cancel logout
  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // Confirm and perform logout
  const handleConfirmLogout = async () => {
    try {
      const res = await axios.post(LOGOUT_URL, null, { withCredentials: true });
      if (res.status === 200) {
        window.location.href = '/login';
      } else {
        setLogoutError('Logout failed');
        setShowLogoutConfirm(false);
      }
    } catch {
      setLogoutError('Logout failed');
      setShowLogoutConfirm(false);
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Main Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-96 bg-gradient-to-b from-white via-blue-50 to-indigo-50 shadow-2xl border-l border-gray-200 transform transition-transform duration-300 ease-in-out z-50 ${
          visible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-6 relative">
          {/* Close Button */}
          <button
            onClick={() => setVisible?.(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition duration-200"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Avatar & User Info */}
          <div className="flex flex-col items-center mb-6">
            <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 p-0.5 shadow-lg">
              <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-2xl">
                {getInitials(user.name)}
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mt-3 text-lg">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto space-y-6">
            {/* Profile Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Profile</h2>
                {!isEditing && !isChangingPassword && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-600 hover:text-blue-800 transition"
                    title="Edit Profile"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="space-y-3 text-sm text-gray-700 px-2">
                {/* Name */}
                <div className="flex items-center justify-between py-1">
                  <span className="font-medium text-gray-600 min-w-24">Name</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="flex-1 ml-4 px-2 py-1 border border-blue-300 rounded text-sm focus:ring-2 focus:ring-blue-300 outline-none"
                    />
                  ) : (
                    <span className="text-gray-800">{user.name}</span>
                  )}
                </div>

                {/* Employee ID */}
                <div className="flex items-center justify-between py-1">
                  <span className="font-medium text-gray-600 min-w-24">Employee ID</span>
                  <span className="text-gray-800 font-mono">{user.employeeId}</span>
                </div>

                {/* Email */}
                <div className="flex items-center justify-between py-1">
                  <span className="font-medium text-gray-600 min-w-24">Email</span>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="flex-1 ml-4 px-2 py-1 border border-blue-300 rounded text-sm focus:ring-2 focus:ring-blue-300 outline-none"
                    />
                  ) : (
                    <span className="text-gray-800 truncate max-w-48 text-right">{user.email}</span>
                  )}
                </div>

                {/* Mobile */}
                <div className="flex items-center justify-between py-1">
                  <span className="font-medium text-gray-600 min-w-24">Mobile</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.mobileNumber}
                      onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                      className="flex-1 ml-4 px-2 py-1 border border-blue-300 rounded text-sm focus:ring-2 focus:ring-blue-300 outline-none"
                    />
                  ) : (
                    <span className="text-gray-800">{user.mobileNumber}</span>
                  )}
                </div>

                {/* Branch ID */}
                <div className="flex items-center justify-between py-1">
                  <span className="font-medium text-gray-600 min-w-24">Branch ID</span>
                  <span className="text-gray-800 font-mono">{user.branchId}</span>
                </div>
              </div>

              {isEditing && (
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={handleProfileSave}
                    disabled={isSaving}
                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition disabled:opacity-70"
                  >
                    {isSaving ? 'Saving...' : <><Check className="w-4 h-4" /> Save</>}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user.name,
                        email: user.email,
                        mobileNumber: user.mobileNumber,
                      });
                    }}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded text-sm transition"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {passwordSuccess && (
                <div className="mt-3 p-3 bg-green-100 border border-green-200 text-green-700 text-sm rounded flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  {passwordSuccess}
                </div>
              )}
            </div>

            {/* Change Password Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Change Password</h2>
                {!isChangingPassword && !isEditing && (
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="text-blue-600 hover:text-blue-800 transition"
                    title="Change Password"
                  >
                    <Lock className="w-5 h-5" />
                  </button>
                )}
              </div>

              {isChangingPassword ? (
                <div className="space-y-4 px-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      className="w-full border rounded px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-300 outline-none"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className="w-full border rounded px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-300 outline-none"
                      placeholder="Re-enter password"
                    />
                  </div>

                  {passwordErrors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <div className="flex items-start gap-2 text-red-700 text-xs">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <ul className="space-y-1">
                          {passwordErrors.map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {passwordSuccess && !passwordErrors.length && (
                    <div className="bg-green-50 border border-green-200 rounded p-3">
                      <div className="flex items-center gap-2 text-green-700 text-sm">
                        <Check className="w-4 h-4" />
                        {passwordSuccess}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handlePasswordChange}
                      disabled={isSaving}
                      className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition disabled:opacity-70"
                    >
                      {isSaving ? 'Updating...' : <><Check className="w-4 h-4" /> Update</>}
                    </button>
                    <button
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({ newPassword: '', confirmPassword: '' });
                        setPasswordErrors([]);
                      }}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded text-sm transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 px-2">
                  Click the lock icon to change your password.
                </p>
              )}
            </div>
          </div>

          {/* Sign Out Section (Fixed at Bottom) */}
          <div className="border-t border-gray-200 pt-4 mt-6">
            {logoutError && (
              <div className="mb-3 p-3 bg-red-100 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {logoutError}
              </div>
            )}
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:text-red-800 font-medium rounded-lg transition hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to sign out? You'll need to log in again.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelLogout}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}