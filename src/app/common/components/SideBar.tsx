'use client';

import React from 'react';
import Link from 'next/link';

type SidebarProps = {
  role: 'admin' | 'employee' | 'customer';
};

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const links =
    role === 'admin'
      ? [
          { name: 'Dashboard', href: '/admin/dashboard' },
          { name: 'User Management', href: '/admin/usermanagement' },
          { name: 'Money Transfer', href: '/admin/moneytransfer' },
          { name: 'Transactions', href: '/admin/transactions' },
        ]
      : role === 'employee'
      ? [
          { name: 'Dashboard', href: '/employee/dashboard' },
          { name: 'Money Transfer', href: '/employee/moneytransfer' },
          { name: 'Transactions', href: '/employee/transactions' },
        ]
      : [
          { name: 'Dashboard', href: '/customer/dashboard' },
          { name: 'Money Transfer', href: '/customer/moneytransfer' },
          { name: 'Transactions', href: '/customer/transactions' },
          { name: 'Beneficiaries', href: '/customer/beneficiaries' },
        ];

  return (
    <aside className="w-64 h-screen fixed bg-blue-900 text-white p-4">
      <h2 className="text-xl font-semibold mb-6">Zinance</h2>
      <nav className="flex flex-col gap-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="hover:bg-blue-800 p-2 rounded"
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
