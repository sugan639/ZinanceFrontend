'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

// MUI Icons (for Users and Branch only)
import GroupIcon from '@mui/icons-material/Group';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DashboardIcon from '@mui/icons-material/Dashboard';


export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
      { href: '/admin/dashboard', icon: <DashboardIcon className="nav-icon" />, label: 'Dashboard' },
,
    {
      href: '/admin/moneyTransfer',
      icon: (
        <Image
          src="/money.png"
          alt="Transfer"
          width={24}
          height={24}
          className="nav-icon"
        />
      ),
      label: 'Transfer',
    },
    {
      href: '/admin/transactions',
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
      href: '/admin/users',
      icon: <GroupIcon className="nav-icon" />,
      label: 'Users',
    },
    {
      href: '/admin/accounts',
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
    {
      href: '/admin/branch',
      icon: <AccountBalanceIcon className="nav-icon" />,
      label: 'Branch',
    },
  ];

  return (
   <aside className="sidebar">
      <nav>
        <ul>
          {navItems.map((item) => item && (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`nav-link ${pathname.startsWith(item.href) ? 'active' : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
