'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ADMIN_PROFILE_URL } from '@/lib/constants';
import TopBar from '@/app/components/TopBar';
import Sidebar from '@/app/components/SideBar';
import ContentArea from '@/app/components/ContentArea';

import '@/app/css/sidebar.css';
import ProfileDrawer from '@/app/components/ProfileDrawer';
import Loading from '@/app/components/Loading';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [logoutError, setLogoutError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(ADMIN_PROFILE_URL, {
          withCredentials: true, // sends cookies
        });

        if (res.data) {
          setUser(res.data);
        } else {
          router.replace('/login'); // fallback
        }
      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          router.replace('/login'); // use replace to prevent going back
        } else {
          setError('Failed to load user data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);


  // Page loading
  if(loading){
   return <Loading message="Loading user management..." />;
  }
  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return null; // render nothing while redirecting
  }

  return (
    <>
      <Sidebar />
      <TopBar />
      <ContentArea user={user} logoutError={logoutError} />
      <ProfileDrawer user={user} />
    </>
  );
}
