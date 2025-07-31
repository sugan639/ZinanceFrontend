'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import {
  CUSTOMER_PROFILE_URL,
  CUSTOMER_ACCOUNTS_URL,
} from '@/lib/constants';

import Loading from '@/app/Loading';
import TopBar from '../customerComponents/TopBar';
import ProfileDrawer from '../customerComponents/ProfileDrawer';
import Sidebar from '../customerComponents/SideBar';

import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Modal,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TablePagination,
  Tooltip,
} from '@mui/material';
import DataTable from '@/app/common/components/DataTable';

interface Account {
  account_number: string;
  balance: string;
  status: string;
  branch_id: string;
  created_at: string;
  modified_at: string;
  modified_by: string;
  user_id: string;
}

export default function AccountManagement() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Fetch user and accounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await axios.get(CUSTOMER_PROFILE_URL, {
          withCredentials: true,
        });
        setUser(profileRes.data);

        const accountsRes = await axios.get(CUSTOMER_ACCOUNTS_URL, {
          withCredentials: true,
        });

        const normalized = (accountsRes.data.accounts || []).map((acc: any) => ({
          account_number: acc.accountNumber,
          balance: acc.balance,
          status: acc.status,
          branch_id: acc.branchId,
          created_at: acc.createdAt,
          modified_at: acc.modifiedAt,
          modified_by: acc.modifiedBy,
          user_id: acc.userId,
        }));

        setAccounts(normalized);
      } catch (err) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const openModal = (acc: Account) => {
    setSelectedAccount(acc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAccount(null);
  };

  if (!user) return null;

  return (
    <>
  

      <main className=" bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <header className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-800">Account Management</h1>
            <p className="text-gray-600 mt-2">Manage and view details of your bank accounts</p>
          </header>

          <section className="bg-white shadow-md rounded-xl p-6">

            {accounts.length === 0 ? (
              <p className="text-gray-500 py-4 text-center">No accounts found</p>
            ) : (
              <TableContainer
                component={Paper}
                sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              >

                
<DataTable
  title="Your Accounts"
  columns={[
    {
      key: 'account_number',
      label: 'Account Number',
    },
    {
      key: 'balance',
      label: 'Balance',
      format: (value) => `₹${parseFloat(value).toFixed(2)}`,
    },
   {
  key: 'status',
  label: 'Status',
  align: 'center',
  render: (row) => {
    const isActive = row.status === 'ACTIVE';
    return (
      <span
        className={`text-sm font-medium ${
          isActive
            ? 'text-green-700'  // Rich, professional green
            : 'text-amber-600' // Warm amber for INACTIVE
        }`}
      >
        {row.status}
      </span>
    );
  },
},
    {
      key: 'created_at',
      label: 'Created At',
      format: (value) => new Date(Number(value)).toLocaleString('en-IN'),
    },
  ]}
  actionColumn={{
    header: 'Details',
    render: (row) => (
      <Tooltip title="View Details">
        <IconButton onClick={() => openModal(row)} size="small" color="primary">
          <InfoIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    ),
  }}
  data={accounts}
  noDataMessage="No accounts found."
  onRowClick={(row) => openModal(row)}
/>


          
              </TableContainer>
            )}
          </section>
        </div>

        {/* Modal for account details */}
        <Modal open={isModalOpen} onClose={closeModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              borderRadius: 2,
              p: 4,
            }}
          >
            <div className="flex justify-between items-center mb-4 text-black">
              <Typography variant="h6" component="h2" className='text-green'>
                ------------- Account Details -------------
              </Typography>
             
            </div>



{/* Account info card */}
{selectedAccount && (
  <div className="space-y-3 text-sm text-gray-800">
    <p className="flex justify-between">
      <span className="font-medium">Account Number:</span>
      <strong className="text-gray-600">{selectedAccount.account_number}</strong>
    </p>
    <p className="flex justify-between">
      <span className="font-medium">Balance:</span>
      <strong className="text-gray-600">₹{parseFloat(selectedAccount.balance).toFixed(2)}</strong>
    </p>
    <p className="flex justify-between">
      <span className="font-medium">Status:</span>
      <strong className="text-gray-600">{selectedAccount.status}</strong>
    </p>
    <p className="flex justify-between">
      <span className="font-medium">Branch ID:</span>
      <strong className="text-gray-600">{selectedAccount.branch_id}</strong>
    </p>
    <p className="flex justify-between">
      <span className="font-medium">Created At:</span>
      <strong className="text-gray-600">
        {new Date(Number(selectedAccount.created_at)).toLocaleString('en-IN')}
      </strong>
    </p>
    <p className="flex justify-between">
      <span className="font-medium">Last Updated:</span>
      <strong className="text-gray-600">
        {new Date(Number(selectedAccount.modified_at)).toLocaleString('en-IN')}
      </strong>
    </p>
    <p className="flex justify-between">
      <span className="font-medium">Modified By:</span>
      <strong className="text-gray-600">{selectedAccount.modified_by || 'System'}</strong>
    </p>
    <p className="flex justify-between">
      <span className="font-medium">User ID:</span>
      <strong className="text-gray-600">{selectedAccount.user_id}</strong>
    </p>
  </div>
)}


           
          </Box>
        </Modal>

        {/* Messages */}
        {message && (
          <div className="mt-4 text-green-600 font-semibold text-center">{message}</div>
        )}
        {error && <div className="mt-4 text-red-600 font-semibold text-center">{error}</div>}
      </main>
    </>
  );
}






