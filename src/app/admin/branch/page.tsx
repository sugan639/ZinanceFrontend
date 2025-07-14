'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/app/admin/components/SideBar';
import TopBar from '@/app/admin/components/TopBar';
import ProfileDrawer from '@/app/admin/components/ProfileDrawer';
import Loading from '@/app/admin/components/Loading';
import axios from 'axios';
import { ADMIN_PROFILE_URL } from '@/lib/constants';

/* ─────────────────────────────────── API ENDPOINTS ─────────────────────────────────── */
const CREATE_URL = 'http://localhost:8080/Banking_App/admin/branch/create';
const GET_URL    = 'http://localhost:8080/Banking_App/admin/branches/ifsc-code';
const UPDATE_URL = 'http://localhost:8080/Banking_App/admin/branches';

/* ────────────────────────────────── Types & Helpers ────────────────────────────────── */
interface Branch {
  branchId:  string;
  adminId:   string;
  bankName:  string;
  location:  string;
  ifscCode:  string;
  createdAt: string;
  modifiedAt:string;
  modifiedBy:string;
}

const labelCls   = 'block text-sm font-medium text-gray-700 mb-1';
const inputCls   = 'border border-gray-400 rounded px-3 py-2 w-full';
const btnPrimary = 'px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded';
const btnGhost   = 'px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded';

export default function BranchPage() {
  /* ───────────── Top‑level state ───────────── */
  const [loading, setLoading] = useState(true);
  const [user, setUser]       = useState<any>(null);

  /* create‑branch form */
  const [createForm, setCreate] = useState({
    new_admin_id: '',
    bank_name   : '',
    location    : '',
  });

  /* search + update */
  const [searchId, setSearchId]   = useState('');
  const [updateForm, setUpdate]   = useState<Partial<Branch>>({});
  const [branch, setBranch]       = useState<Branch | null>(null);

  /* feedback */
  const [message, setMessage] = useState('');
  const [error,   setError]   = useState('');

  const resetFeedback = () => { setMessage(''); setError(''); };

  /* ───────────── Auth check ───────────── */
  useEffect(() => {
    axios.get(ADMIN_PROFILE_URL, { withCredentials: true })
         .then(res => setUser(res.data))
         .catch(() => (window.location.href = '/login'))
         .finally(() => setLoading(false));
  }, []);

  /* ───────────── Handlers ───────────── */
  const handleCreate = async () => {
    resetFeedback();
    try {
      const res = await axios.post(CREATE_URL, createForm, { withCredentials: true });
      setBranch(res.data);
      setMessage(res.data.message || 'Branch created');
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Creation failed');
    }
  };

  const handleSearch = async () => {
    resetFeedback();
    if (!searchId) return setError('Enter a IFSC code');
    try {
      const res = await axios.get(`${GET_URL}?ifsccode=${searchId}`, { withCredentials: true });
      setBranch(res.data);
      setUpdate({
        branchId : res.data.branchId,
        bankName : res.data.bankName,
        location : res.data.location,
        adminId  : res.data.adminId,
        
      });
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Branch not found');
    }
  };

  const handleUpdate = async () => {
    resetFeedback();
    if (!updateForm.branchId) return setError('Branch ID required');

    /* camelCase → snake_case payload */
    const payload = {
      branch_id : updateForm.branchId,
      bank_name : updateForm.bankName,
      location  : updateForm.location,
      admin_id  : updateForm.adminId,
      ifsc_code : updateForm.ifscCode,
    };

    try {
      const res = await axios.put(UPDATE_URL, payload, { withCredentials: true });
      setBranch(res.data);
      setMessage('Branch updated');
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Update failed');
    }
  };

  const clearCreate = () => setCreate({ new_admin_id: '', bank_name: '', location: '' });
  const clearUpdate = () => { setUpdate({}); setBranch(null); setSearchId(''); };

  /* ───────────── UI Loading ───────────── */
  if (loading) return <Loading message="Loading branches..." />;

  /* ───────────── UI ───────────── */
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <TopBar />
        <ProfileDrawer user={user} />

        <main className="pl-64 pt-20 p-6 space-y-12 bg-gray-100 min-h-screen text-gray-800">
          {/* ───────────── Create Branch ───────────── */}
          <section className="bg-white shadow rounded p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-800">Create Branch</h2>
              <button onClick={clearCreate} className={btnGhost}>Clear</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={labelCls}>Admin&nbsp;ID</label>
                <input
                  type="number"
                  className={inputCls}
                  value={createForm.new_admin_id}
                  onChange={e => setCreate({ ...createForm, new_admin_id: e.target.value })}
                />
              </div>
              <div>
                <label className={labelCls}>Bank&nbsp;Name</label>
                <input
                  className={inputCls}
                  value={createForm.bank_name}
                  onChange={e => setCreate({ ...createForm, bank_name: e.target.value })}
                />
              </div>
              <div>
                <label className={labelCls}>Location</label>
                <input
                  className={inputCls}
                  value={createForm.location}
                  onChange={e => setCreate({ ...createForm, location: e.target.value })}
                />
              </div>
            </div>

            <button onClick={handleCreate} className={`${btnPrimary} mt-6`}>Create</button>
          </section>

          {/* ───────────── Get / Update Branch ───────────── */}
          <section className="bg-white shadow rounded p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-800">Get / Update Branch</h2>
              <button onClick={clearUpdate} className={btnGhost}>Clear</button>
            </div>

            {/* Fetch */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex-grow md:flex-grow-0">
                <label className={labelCls}>Branch&nbsp;IFSC code</label>
                <input
                  placeholder="ZIN2CA4494"
                  className={inputCls}
                  value={searchId}
                  onChange={e => setSearchId(e.target.value)}
                />
              </div>
              <button onClick={handleSearch} className={btnPrimary}>Fetch</button>
            </div>

            {/* Update form (visible after fetch) */}
            {branch && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Update form – Branch ID now read‑only */}
                <div>
                <label className={labelCls}>Branch ID</label>
                <input
                    className={`${inputCls} bg-gray-100 cursor-not-allowed`}
                    value={updateForm.branchId || ''}
                    disabled
                />
                </div>


                  <div>
                    <label className={labelCls}>Bank&nbsp;Name</label>
                    <input
                      className={inputCls}
                      value={updateForm.bankName || ''}
                      onChange={e => setUpdate({ ...updateForm, bankName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Location</label>
                    <input
                      className={inputCls}
                      value={updateForm.location || ''}
                      onChange={e => setUpdate({ ...updateForm, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Admin&nbsp;ID</label>
                    <input
                      type="number"
                      className={inputCls}
                      value={updateForm.adminId || ''}
                      onChange={e => setUpdate({ ...updateForm, adminId: e.target.value })}
                    />
                  </div>
                  
                </div>

                <button onClick={handleUpdate} className={`${btnPrimary} mt-6`}>Update</button>
              </>
            )}
          </section>


            {message && branch && !updateForm.ifscCode && (
            <section className="bg-green-50 border border-green-200 rounded p-4 text-green-900">
                <h3 className="text-lg font-semibold mb-2">Branch Created:</h3>
                <ul className="list-disc ml-5 space-y-1 text-sm">
                <li><strong>Admin ID:</strong> {branch.adminId}</li>
                <li><strong>Bank Name:</strong> {branch.bankName}</li>
                <li><strong>Location:</strong> {branch.location}</li>
                <li><strong>IFSC Code:</strong> {branch.ifscCode}</li>
                <li><strong>Modified By:</strong> {branch.modifiedBy}</li>
                </ul>
            </section>
            )}


          {/* ───────────── Feedback ───────────── */}
          {(message || error) && (
            <div
              className={`p-4 rounded w-full md:w-2/3 ${
                message ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {message || error}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
