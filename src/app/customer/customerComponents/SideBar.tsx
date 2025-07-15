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
            <Link href="/customer/dashboard">
              <span className="icon">🏠</span> Home
            </Link>
          </li>
          <li>
            <Link href="/customer/moneyTransfer">
              <span className="icon">🔁</span> Transfer Money
            </Link>
          </li>
          <li>
            <Link href="/customer/transactions">
              <span className="icon">🔍</span> Find Transactions
            </Link>
          </li>
          <li>
            <Link href="/customer/accounts">
              <span className="icon">💳 </span> Accounts
            </Link>
          </li>
        
        </ul>
      </nav>
    </aside>
  );
}
