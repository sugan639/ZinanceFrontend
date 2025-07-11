// /components/TopBar.tsx
'use client';

import { useRouter } from 'next/navigation';

import '@/app/css/topbar.css';


export default function TopBar() {
  const router = useRouter();

  return (
    <header className="custom-topbar">
      <div className="custom-topbar-content">
        <div
          className="custom-topbar-logo"
          style={{ marginLeft: '1px', marginRight: 'auto', cursor: 'pointer' }} // Added marginLeft
          onClick={() => router.push('/admin/dashboard')}
        >
          <img
            src="/zinance_logo.png"
            alt="Zinance Logo"
            style={{ height: '150px', maxHeight: '150px', width: 'auto', display: 'block' }}
          />
        </div>
      </div>
    </header>
  );
}

