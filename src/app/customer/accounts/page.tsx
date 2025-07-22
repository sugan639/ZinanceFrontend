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
} from '@mui/material';

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

  if (loading) return <Loading message="Loading account management..." />;
  if (!user) return null;

  return (
    <>
      <Sidebar />
      <TopBar user={user} />
      {user && <ProfileDrawer user={user} />}

      <main className="pl-64 pt-20 bg-gray-50 min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <header className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-800">Account Management</h1>
            <p className="text-gray-600 mt-2">Manage and view details of your bank accounts</p>
          </header>

          <section className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Accounts</h2>

            {accounts.length === 0 ? (
              <p className="text-gray-500 py-4 text-center">No accounts found</p>
            ) : (
              <TableContainer
                component={Paper}
                sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              >
                <Table aria-label="account table">
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-semibold">Account Number</TableCell>
                      <TableCell className="font-semibold">Balance</TableCell>
                      <TableCell className="font-semibold">Status</TableCell>
                      <TableCell className="font-semibold">Created At</TableCell>
                      <TableCell align="center" className="font-semibold">Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {accounts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((acc, index) => (
                      <TableRow
                        key={acc.account_number}
                        sx={{
                          '&:hover': { backgroundColor: '#f5f5f5' },
                        }}
                      >
                        <TableCell>{acc.account_number}</TableCell>
                        <TableCell>₹{parseFloat(acc.balance).toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip
                            label={acc.status}
                            color={acc.status === 'ACTIVE' ? 'success' : 'error'}
                            size="small"
                            sx={{ color: '#fff', fontWeight: 500 }}
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(Number(acc.created_at)).toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton onClick={() => openModal(acc)} size="small" color="primary">
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={accounts.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
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
            <div className="flex justify-between items-center mb-4 text-gray-600">
              <Typography variant="h6" component="h2">
                Account Details
              </Typography>
              <IconButton onClick={closeModal} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>

            {selectedAccount && (
              <div className="space-y-3 text-sm text-gray-800">
                <p>
                  <strong className="text-gray-600">Account Number:</strong>{' '}
                  <span className="font-medium">{selectedAccount.account_number}</span>
                </p>
                <p>
                  <strong className="text-gray-600">Balance:</strong>{' '}
                  <span className="font-medium">₹{parseFloat(selectedAccount.balance).toFixed(2)}</span>
                </p>
                <p>
                  <strong className="text-gray-600">Status:</strong>{' '}
                  <Chip
                    label={selectedAccount.status}
                    color={selectedAccount.status === 'ACTIVE' ? 'success' : 'error'}
                    size="small"
                    sx={{ color: '#fff', fontWeight: 500 }}
                  />
                </p>
                <p>
                  <strong className="text-gray-600">Branch ID:</strong>{' '}
                  <span className="font-medium">{selectedAccount.branch_id}</span>
                </p>
                <p>
                  <strong className="text-gray-600">Created At:</strong>{' '}
                  <span className="font-medium">
                    {new Date(Number(selectedAccount.created_at)).toLocaleString('en-IN')}
                  </span>
                </p>
                <p>
                  <strong className="text-gray-600">Last Updated:</strong>{' '}
                  <span className="font-medium">
                    {new Date(Number(selectedAccount.modified_at)).toLocaleString('en-IN')}
                  </span>
                </p>
                <p>
                  <strong className="text-gray-600">Modified By:</strong>{' '}
                  <span className="font-medium">{selectedAccount.modified_by || 'System'}</span>
                </p>
                <p>
                  <strong className="text-gray-600">User ID:</strong>{' '}
                  <span className="font-medium">{selectedAccount.user_id}</span>
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