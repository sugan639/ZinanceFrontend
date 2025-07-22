'use client';

import Link from 'next/link';
import '@/app/employee/css/sidebar.css'; // Ensure styles are defined

// MUI Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SearchIcon from '@mui/icons-material/Search';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import GroupIcon from '@mui/icons-material/Group';


export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <h2>Zinance</h2>
      </div>
      <nav>
        <ul>
          <li>
            <Link href="/employee/dashboard" className="nav-link gap-2">
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href="/employee/moneyTransfer" className="nav-link gap-2">
              <SwapHorizIcon className="icon" />
              <span>Money Transfer</span>
            </Link>
          </li>
          <li>
            <Link href="/employee/transactions" className="nav-link gap-2">
              <SearchIcon className="icon" />
              <span>Transactions</span>
            </Link>
          </li>
          <li>
            <Link href="/employee/users" className="nav-link gap-2">
              <GroupIcon className="icon" />
              <span>Users</span>
            </Link>
          </li>
          <li>
            <Link href="/employee/accounts" className="nav-link gap-2">
              <CreditCardIcon className="icon" />
              <span>Accounts</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}