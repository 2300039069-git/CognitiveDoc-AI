import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Shield,
  UserCheck,
  UserX,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
  Mail,
  Building,
  KeyRound
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Password Reset Modal State
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [selectedUserForReset, setSelectedUserForReset] = useState(null);
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [resettingPassword, setResettingPassword] = useState(false);
  const [resetSuccessMsg, setResetSuccessMsg] = useState('');

  // New user form state
  const [newUser, setNewUser] = useState({
    full_name: '',
    email: '',
    password: '',
    organization: '',
    role: 'user'
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    try {
      const newStatus = !user.is_active;
      await adminService.updateUserStatus(user.id, newStatus);
      setUsers(users.map(u => u.id === user.id ? { ...u, is_active: newStatus ? 1 : 0 } : u));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleToggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (confirm(`Change role of ${user.full_name} to ${newRole.toUpperCase()}?`)) {
      try {
        await adminService.updateUserRole(user.id, newRole);
        setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u));
      } catch (err) {
        alert("Failed to update role");
      }
    }
  };

  const handleDeleteUser = async (user) => {
    if (confirm(`Permanently delete user account "${user.email}"?`)) {
      try {
        await adminService.deleteUser(user.id);
        setUsers(users.filter(u => u.id !== user.id));
      } catch (err) {
        alert(err.response?.data?.detail || "Failed to delete user");
      }
    }
  };

  const handleOpenResetModal = (user) => {
    setSelectedUserForReset(user);
    setNewPasswordValue('');
    setResetSuccessMsg('');
    setResetModalOpen(true);
  };

  const handleAdminResetPassword = async (e) => {
    e.preventDefault();
    if (!newPasswordValue || newPasswordValue.length < 6) {
      alert("Password must be at least 6 characters in length");
      return;
    }
    setResettingPassword(true);
    try {
      await adminService.resetUserPassword(selectedUserForReset.id, newPasswordValue);
      setResetSuccessMsg(`Password for ${selectedUserForReset.email} successfully updated to: ${newPasswordValue}`);
      setTimeout(() => {
        setResetModalOpen(false);
        setResetSuccessMsg('');
        setNewPasswordValue('');
        setSelectedUserForReset(null);
      }, 2000);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to reset password");
    } finally {
      setResettingPassword(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    try {
      const created = await adminService.createUser(newUser);
      setUsers([created, ...users]);
      setModalOpen(false);
      setNewUser({ full_name: '', email: '', password: '', organization: '', role: 'user' });
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create user");
    } finally {
      setCreating(false);
    }
  };

  const filteredUsers = users.filter(u =>
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.organization?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [activeOtps, setActiveOtps] = useState({ registration_otps: [], password_resets: [] });
  const [loadingOtps, setLoadingOtps] = useState(false);

  const handleOpenOtpModal = async () => {
    setOtpModalOpen(true);
    setLoadingOtps(true);
    try {
      const data = await adminService.getActiveOtps();
      setActiveOtps(data || { registration_otps: [], password_resets: [] });
    } catch (err) {
      console.error("Failed to load active OTPs:", err);
    } finally {
      setLoadingOtps(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">User Administration</h1>
          <p className="text-xs text-slate-400">
            Manage organizational accounts, roles, access states, and user permissions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenOtpModal}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 border border-brand-500/30 text-brand-400 hover:bg-brand-500/10 transition-all font-mono"
            title="View Live Registration & Reset OTPs"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Live Active OTPs</span>
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all font-mono"
          >
            <UserPlus className="w-4 h-4" />
            <span>Provision New User</span>
          </button>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="glass-panel rounded-2xl p-4 border-slate-800 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or org..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>
        <span className="text-xs text-slate-400 font-mono hidden sm:inline">
          {filteredUsers.length} User {filteredUsers.length === 1 ? 'Record' : 'Records'}
        </span>
      </div>

      {/* User Table */}
      <div className="glass-panel rounded-3xl p-6 border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-slate-400 uppercase tracking-wider border-b border-slate-800/80">
            <tr>
              <th className="pb-3 font-semibold">User</th>
              <th className="pb-3 font-semibold">Organization</th>
              <th className="pb-3 font-semibold">Role</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold">Created Date</th>
              <th className="pb-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-slate-900/60 transition-colors">
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-xs uppercase">
                      {u.full_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-white">{u.full_name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 text-slate-300 font-medium">
                  {u.organization || 'General Team'}
                </td>
                <td className="py-3.5">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                    u.role === 'admin'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-3.5">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    u.is_active
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {u.is_active ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td className="py-3.5 text-slate-400 font-mono text-[11px]">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="py-3.5 text-right space-x-1.5">
                  {u.email === 'kancharladhanush2003@gmail.com' ? (
                    <span className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30">
                      Master Admin (Owner)
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                          u.is_active
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                            : 'bg-emerald-600 text-white hover:bg-emerald-500'
                        }`}
                        title={u.is_active ? "Suspend account" : "Activate account"}
                      >
                        {u.is_active ? 'Suspend' : 'Activate'}
                      </button>

                      <button
                        onClick={() => handleToggleRole(u)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          u.role === 'admin'
                            ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
                            : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold'
                        }`}
                        title={u.role === 'admin' ? "Demote to Standard User" : "Grant Admin Access"}
                      >
                        {u.role === 'admin' ? 'Demote' : 'Make Admin'}
                      </button>

                      <button
                        onClick={() => handleOpenResetModal(u)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 inline-flex items-center gap-1"
                        title="Reset User Password"
                      >
                        <KeyRound className="w-3 h-3" />
                        <span>Pass</span>
                      </button>

                      <button
                        onClick={() => handleDeleteUser(u)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Provision User Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border-slate-700 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white">Provision New Account</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                  placeholder="e.g. Rachel Adams"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="rachel@company.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Temporary Password</label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Min 6 characters"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Organization</label>
                  <input
                    type="text"
                    value={newUser.organization}
                    onChange={(e) => setNewUser({ ...newUser, organization: e.target.value })}
                    placeholder="Legal Team"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">System Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="user">Standard User</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full py-3 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all font-mono mt-2"
              >
                {creating ? 'Creating Account...' : 'Confirm Account Provisioning'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Live Active OTPs Modal (Super Admin Real-Time Verification Oversight) */}
      {otpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-2xl shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Live Active Verification OTPs</h2>
                  <p className="text-[11px] text-slate-400">Real-time unexpired 6-digit codes for registration & password resets</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenOtpModal}
                  disabled={loadingOtps}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  {loadingOtps ? 'Refreshing...' : '🔄 Refresh'}
                </button>
                <button
                  onClick={() => setOtpModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              <div>
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                  Registration Verification Codes (Pending)
                </h3>
                {activeOtps.registration_otps?.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                    No pending registration OTPs at this moment.
                  </p>
                ) : (
                  <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl bg-slate-950/60 overflow-hidden">
                    {(activeOtps.registration_otps || []).map((item, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between gap-4 text-xs">
                        <div>
                          <p className="font-bold text-white">{item.email}</p>
                          <p className="text-[10px] text-slate-400">Created: {new Date(item.created_at).toLocaleTimeString()}</p>
                        </div>
                        <div className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-sm font-bold tracking-widest">
                          {item.code}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                  Password Reset Codes (Pending)
                </h3>
                {activeOtps.password_resets?.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                    No pending password reset OTPs at this moment.
                  </p>
                ) : (
                  <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl bg-slate-950/60 overflow-hidden">
                    {(activeOtps.password_resets || []).map((item, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between gap-4 text-xs">
                        <div>
                          <p className="font-bold text-white">{item.email}</p>
                          <p className="text-[10px] text-slate-400">Created: {new Date(item.created_at).toLocaleTimeString()}</p>
                        </div>
                        <div className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-sm font-bold tracking-widest">
                          {item.code}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Password Reset Modal */}
      {resetModalOpen && selectedUserForReset && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border-slate-700 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Reset User Password</h2>
                  <p className="text-xs text-slate-400 font-mono">{selectedUserForReset.email}</p>
                </div>
              </div>
              <button onClick={() => setResetModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {resetSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{resetSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleAdminResetPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">New Password</label>
                <input
                  type="text"
                  required
                  minLength={6}
                  value={newPasswordValue}
                  onChange={(e) => setNewPasswordValue(e.target.value)}
                  placeholder="Enter new 6+ char password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
                <p className="text-[11px] text-slate-400">
                  Enter the password that the user will use to log in immediately.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setResetModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resettingPassword}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/30"
                >
                  {resettingPassword ? 'Updating...' : 'Set New Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
