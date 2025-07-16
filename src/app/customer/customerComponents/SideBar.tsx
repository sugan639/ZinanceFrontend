'use client';

import Link from 'next/link';


import '@/app/customer/css/sidebar.css'; // Ensure styles are defined

// MUI Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SearchIcon from '@mui/icons-material/Search';
import CreditCardIcon from '@mui/icons-material/CreditCard';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <h2>Zinance</h2>
      </div>
      <nav>
        <ul>
          <li>
            <Link href="/customer/dashboard" className="nav-link gap-2">
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href="/customer/moneyTransfer" className="nav-link gap-2">
              <SwapHorizIcon className="icon" />
              <span>Transfer Money</span>
            </Link>
          </li>
          <li>
            <Link href="/customer/transactions" className="nav-link gap-2">
              <SearchIcon className="icon" />
              <span>Find Transactions</span>
            </Link>
          </li>
          <li>
            <Link href="/customer/accounts" className="nav-link gap-2">
              <CreditCardIcon className="icon" />
              <span>Accounts</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
