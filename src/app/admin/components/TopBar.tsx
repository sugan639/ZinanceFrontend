'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserCircle } from 'lucide-react';
import ProfileDrawer from '@/app/admin/components/ProfileDrawer';
import { ADMIN_PROFILE_URL } from '@/lib/constants';
import axios from 'axios';
import '@/app/admin/css/topbar.css';
import UserAvatar from './UserAvatar';

export default function TopBar() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    axios
      .get(ADMIN_PROFILE_URL, { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => (window.location.href = '/login'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <header className="custom-topbar">
        <div className="custom-topbar-content flex items-center justify-between px-4">
          <div
            className="custom-topbar-logo cursor-pointer"
            onClick={() => router.push('/admin/dashboard')}
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
            onClick={() => setDrawerOpen(true)}
            title="Profile"
          >
            <UserAvatar name={user?.name || 'U'} size={36} />
          </button>
        </div>
      </header>

      {!loading && (
        <ProfileDrawer user={user} visible={drawerOpen} setVisible={setDrawerOpen} />
      )}
    </>
  );
}
