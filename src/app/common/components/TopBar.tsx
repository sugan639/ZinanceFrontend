'use client';

import React from 'react';

type TopBarProps = {
  user: {
    name: string;
    email: string;
  };
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const TopBar: React.FC<TopBarProps> = ({ user, setDrawerOpen }) => {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white shadow z-10 flex items-center justify-between px-6">
      <div className="text-lg font-semibold">Welcome, {user.name}</div>
      <div className="flex items-center gap-4">
        <span className="text-gray-500 text-sm">{user.email}</span>
        <button
          onClick={() => setDrawerOpen(true)}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Profile
        </button>
      </div>
    </header>
  );
};

export default TopBar;
