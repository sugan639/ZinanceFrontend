'use client';

import Link from 'next/link';
import '@/app/employee/css/sidebar.css'; // Make sure this import exists

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <h2>Zinance</h2>
      </div>
      <nav>
        <ul>
          <li>
            <Link href="/employee/dashboard">
              <span className="icon">🏠</span> Home
            </Link>
          </li>
          <li>
            <Link href="/employee/moneyTransfer">
              <span className="icon">🔁</span> Transfer
            </Link>
          </li>
          <li>
            <Link href="/employee/transactions">
              <span className="icon">🔍</span> Transactions
            </Link>
          </li>
          <li>
            <Link href="/employee/users">
              <span className="icon">👥</span> Users
            </Link>
          </li>
          <li>
            <Link href="/employee/accounts">
              <span className="icon">💳 </span> Accounts
            </Link>
          </li>
          
        </ul>
      </nav>
    </aside>
  );
}
