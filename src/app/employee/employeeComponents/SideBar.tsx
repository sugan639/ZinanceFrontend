'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// MUI Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SearchIcon from '@mui/icons-material/Search';
import GroupIcon from '@mui/icons-material/Group';
import CreditCardIcon from '@mui/icons-material/CreditCard';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/employee/dashboard', icon: <DashboardIcon className="nav-icon" />, label: 'Dashboard' },
    { href: '/employee/moneyTransfer', icon: <SwapHorizIcon className="nav-icon" />, label: 'Money Transfer' },
    { href: '/employee/transactions', icon: <SearchIcon className="nav-icon" />, label: 'Transactions' },
    { href: '/employee/users', icon: <GroupIcon className="nav-icon" />, label: 'Users' },
    { href: '/employee/accounts', icon: <CreditCardIcon className="nav-icon" />, label: 'Accounts' },
  ];

  return (
    <aside className="sidebar">
      
      <nav>
        <ul>
          {navItems.map(({ href, icon, label }) => (
            <li key={href}>
              <Link href={href} className={`nav-link ${pathname.startsWith(href) ? 'active' : ''}`}>
                {icon}
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}