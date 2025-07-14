'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/components/SideBar';
import TopBar from '@/app/components/TopBar';
import ProfileDrawer from '@/app/components/ProfileDrawer';
import axios from 'axios';
import Loading from '@/app/components/Loading';
import { ADMIN_PROFILE_URL } from '@/lib/constants';





export default function Branch(){
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
   
    
    useEffect(() => {
        axios
        .get(ADMIN_PROFILE_URL, { withCredentials: true })
        .then((res) => setUser(res.data))
        .catch(() => (window.location.href = '/login'))
        .finally(() => setLoading(false));
    }, []);
    
    // Page loading
    if(loading){
     return <Loading message="Loading branches..." />;
    }
    
    return (
        <div className="flex">
        <Sidebar />
        <div className="flex-1">
            <TopBar />
            <ProfileDrawer user={user} />
           
        </div>
        </div>
    );
}