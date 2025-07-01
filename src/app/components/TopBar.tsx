// /components/TopBar.tsx
'use client';

import { useRouter } from 'next/navigation';
import axios from 'axios';
import '@/app/css/topbar.css';
import { LOGOUT_URL } from '@/lib/constants';
import { useState } from 'react';

export default function TopBar() {

  const router = useRouter();




  return (
    <header className="custom-topbar">
      <div className="custom-topbar-content">
        <div
          className="custom-topbar-logo"
          style={{ marginRight: 'auto' }} // Ensures logo is at the leftmost end
          onClick={() => router.push('/dashboard/admin')}
        >
          Zinance
        </div>
       
      </div>
    </header>
  );
}

