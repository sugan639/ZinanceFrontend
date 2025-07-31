// app/customer/layout.tsx
'use client';


import { ReactNode, useEffect, useState } from 'react';
import Sidebar from './customerComponents/SideBar';
import TopBar from './customerComponents/TopBar';
import ProfileDrawer from './customerComponents/ProfileDrawer';
import axios from 'axios';
import { CUSTOMER_PROFILE_URL } from '@/lib/constants';

export default function CustomerLayout({ children }: { children: ReactNode }) {
      const [user, setUser] = useState<any>(null);
      const [loading, setLoading] = useState(true);
       const [drawerOpen, setDrawerOpen] = useState(false);

      useEffect(() => {
    axios
      .get(CUSTOMER_PROFILE_URL, { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => (window.location.href = '/login'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;


  return (
    <>
      {/* Persistent Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="pl-64 min-h-screen bg-gray-50">
        {/* Persistent TopBar */}
        <TopBar user={user} onProfileClick={() => setDrawerOpen(true)} />
        
        {/* Page Content (changes on navigation) */}
        <main className="pt-20 px-6 pb-10">
          {children}
        </main>

        {/* Persistent Profile Drawer (if modal-style) */}
        <ProfileDrawer visible={drawerOpen} setVisible={setDrawerOpen} user={user}/>
      </div>
    </>
  );
}











