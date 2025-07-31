'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserCircle } from 'lucide-react';
import ProfileDrawer from '@/app/admin/components/ProfileDrawer';
import { CUSTOMER_PROFILE_URL } from '@/lib/constants';
import axios from 'axios';
import '@/app/customer/css/topbar.css';
import UserAvatar from './UserAvatar';


interface TopBarProps {
  user: any;
  onProfileClick: () => void;
}


export default function TopBar({ user, onProfileClick }: TopBarProps) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);



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
            className="text-gray-700 hover:text-blue-700 cursor-pointer"
            onClick={onProfileClick}
            title="Profile"
          >
            <UserAvatar name={user?.name || 'U'} size={36} />
          </button>
        </div>
      </header>

      {!loading && (
        <ProfileDrawer
          user={user}
          visible={drawerOpen}
          setVisible={setDrawerOpen}
        />
      )}
    </>
  );
}
