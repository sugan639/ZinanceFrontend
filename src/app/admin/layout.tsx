// app/admin/layout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ADMIN_PROFILE_URL } from '@/lib/constants';
import Sidebar from './components/SideBar';
import TopBar from './components/TopBar';
import ProfileDrawer from './components/ProfileDrawer';



export default function AdminLayout({ children }: { children: React.ReactNode }) {
      const [user, setUser] = useState<any>(null);
      const [loading, setLoading] = useState(true);
       const [drawerOpen, setDrawerOpen] = useState(false);

      useEffect(() => {
    axios
      .get(ADMIN_PROFILE_URL, { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => (window.location.href = '/login'))
      .finally(() => setLoading(false));
  }, []);
  if (loading) return null;


  return (
    <>

      {/* Persistent Sidebar */}
      <Sidebar />

      <div className="pl-64 min-h-screen bg-gray-50">

      {/* Persistent TopBar */}
      <TopBar user={user} onProfileClick={() => setDrawerOpen(true)} />

           {/* Page Content (changes on navigation) */}
        <main className="pt-20 px-6 pb-10">
          {children}
        </main>


      {/* Persistent Profile Drawer */}
      <ProfileDrawer visible={drawerOpen} setVisible={setDrawerOpen} user={user} />

 
        </div>
      </>
  );



}