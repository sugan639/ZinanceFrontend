'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SearchIcon from '@mui/icons-material/Search';
import GroupIcon from '@mui/icons-material/Group';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

export default function Sidebar() {
  const pathname = usePathname();

  // Define menu items
  const menuItems = [
    {
      href: '/admin/dashboard',
      icon: <DashboardIcon className="icon" />,
      label: 'Dashboard',
    },
    {
      href: '/admin/moneyTransfer',
      icon: <SwapHorizIcon className="icon" />,
      label: 'Money Transfer',
    },
    {
      href: '/admin/transactions',
      icon: <SearchIcon className="icon" />,
      label: 'Transactions',
    },
    {
      href: '/admin/users',
      icon: <GroupIcon className="icon" />,
      label: 'Users',
    },
    {
      href: '/admin/accounts',
      icon: <CreditCardIcon className="icon" />,
      label: 'Accounts',
    },
    {
      href: '/admin/branch',
      icon: <AccountBalanceIcon className="icon" />,
      label: 'Branch',
    },
  ];

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="logo">
        <h2 className="text-2xl font-bold tracking-tight">Zinance</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 transition-all duration-200 hover:bg-white hover:shadow-sm hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isActive
                      ? 'bg-white shadow-sm text-blue-700 font-semibold'
                      : 'hover:text-blue-800'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span
                    className={`transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}