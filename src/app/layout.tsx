import './globals.css';
import type { Metadata } from 'next';

import './admin/css/sidebar.css';
import './admin/css/admindashboard.css';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

export const metadata: Metadata = {
  title: 'Zinance Bank',
  description: 'Banking made simple',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      
      <body>
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </body>
    </html>
  );
}



