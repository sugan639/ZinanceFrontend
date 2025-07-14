'use client';

import Link from 'next/link';
import '@/app/admin/css/sidebar.css'; // Make sure this import exists

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <h2>Zinance</h2>
      </div>
      <nav>
        <ul>
          <li>
            <Link href="/admin/dashboard">
              <span className="icon">🏠</span> Home
            </Link>
          </li>
          <li>
            <Link href="/admin/moneyTransfer">
              <span className="icon">🔁</span> Transfer
            </Link>
          </li>
          <li>
            <Link href="/admin/transactions">
              <span className="icon">🔍</span> Transactions
            </Link>
          </li>
          <li>
            <Link href="/admin/users">
              <span className="icon">👥</span> Users
            </Link>
          </li>
          <li>
            <Link href="/admin/accounts">
              <span className="icon">💳 </span> Accounts
            </Link>
          </li>
          <li>
            <Link href="/admin/branch">
              <span className="icon">🏦</span> Branch
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
