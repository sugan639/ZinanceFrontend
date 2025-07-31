'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';


// MUI Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SearchIcon from '@mui/icons-material/Search';
import CreditCardIcon from '@mui/icons-material/CreditCard';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
  { href: '/customer/dashboard', icon: <DashboardIcon className="nav-icon" />, label: 'Dashboard' },
  { 
    href: '/customer/moneyTransfer',
    icon: (
      <Image
        src="/money.png"
        alt="Transfer"
        width={24}
        height={24}
        className="nav-icon"
      />
    ),
     label: 'Transfer' },

  {
    href: '/customer/transactions',
    icon: (
      <Image
        src="/findTransaction.png"
        alt="Transactions"
        width={24}
        height={24}
        className="nav-icon"
      />
    ),
    label: 'Transactions',
  },
    {
    href: '/customer/accounts',
    icon: (
      <Image
        src="/bank-account.png"
        alt="Accounts"
        width={24}
        height={24}
        className="nav-icon"
      />
    ),
    label: 'Accounts',
  },
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
