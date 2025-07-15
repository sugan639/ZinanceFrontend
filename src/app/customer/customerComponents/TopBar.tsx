'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import '@/app/employee/css/topbar.css';
import UserAvatar from './UserAvatar';
import ProfileDrawer from './ProfileDrawer';



type Props = {
  user?: {
    name: string;
    email: string;
    customerId: string;
    mobileNumber: string;
    address : string;
    dob: string;
    panNumber: string;
    aadharNumber: string;
    [key: string]: any;
  } | null;
};

export default function TopBar({ user }: Props) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
 


  return (
    <>
      <header className="custom-topbar">
        <div className="custom-topbar-content flex items-center justify-between px-4">
          <div
            className="custom-topbar-logo cursor-pointer"
            onClick={() => router.push('/customer/dashboard')}
          >
            <img
              src="/zinance_logo.png"
              alt="Zinance Logo"
              style={{
                height: '150px',
                width: 'auto',
                display: 'block',
              }}
            />
          </div>

          {/* Profile icon on right */}
          <button
            className="text-gray-700 hover:text-blue-700"
            onClick={() => setDrawerOpen(true)}
            title="Profile"
          >
            <UserAvatar name={user?.name || 'Z'} size={36} />
          </button>
        </div>
      </header>

        <ProfileDrawer user={user} visible={drawerOpen} setVisible={setDrawerOpen} />

    </>
  );
}
