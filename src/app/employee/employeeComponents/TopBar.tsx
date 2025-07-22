'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CUSTOMER_PROFILE_URL } from '@/lib/constants';
import axios from 'axios';
import '@/app/employee/css/topbar.css';
import UserAvatar from './UserAvatar';
import ProfileDrawer from './ProfileDrawer';



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

export default function TopBar({ user }: Props) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
 



  return (
    <>
      <header className="custom-topbar">
        <div className="custom-topbar-content flex items-center justify-between px-4">
          <div
            className="custom-topbar-logo cursor-pointer"
            onClick={() => router.push('/employee/dashboard')}
          >
            <img
              src="/zinance_logo.png"
              alt="Zinance Logo"
              style={{
                height: '150px',
                width: 'auto',
                display: 'block',
                paddingLeft: '1px',
              }}
            />
          </div>

          {/* Profile icon on right */}
          <button
            className="text-gray-700 hover:text-blue-700 cursor-pointer"
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
