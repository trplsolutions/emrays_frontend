'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Key, ShieldCheck, UserX, UserCheck, X } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useAuthStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

// Types
interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone: string;
  is_active: boolean;
}

const ROLES = [
  { value: 'admin', label: 'System Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'sales_user', label: 'Sales User' },
  { value: 'sourcing_user', label: 'Sourcing User' },
  { value: 'sourcing_manager', label: 'Sourcing Manager' },
  { value: 'operation_user', label: 'Operation User' },
];

export default function UsersPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '', email: '', first_name: '', last_name: '', role: 'sales_user', phone: '', password: ''
  });

  const [passwordData, setPasswordData] = useState({ password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.replace('/dashboard');
    } else if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user, router]);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, ok } = await apiFetch<User[]>('/api/users/');
    if (ok && data) {
      setUsers(data);
    } else {
      setError('Failed to fetch users');
    }
    setLoading(false);
  };

  const handleOpenModal = (userToEdit?: User) => {
    setError('');
    setSuccess('');
    if (userToEdit) {
      setEditingUser(userToEdit);
      setFormData({
        username: userToEdit.username,
        email: userToEdit.email,
        first_name: userToEdit.first_name,
        last_name: userToEdit.last_name,
        role: userToEdit.role,
        phone: userToEdit.phone,
        password: '' // empty for edit
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: '', email: '', first_name: '', last_name: '', role: 'sales_user', phone: '', password: ''
      });
    }
    setShowUserModal(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const endpoint = editingUser ? `/api/users/${editingUser.id}/` : '/api/users/';
    const method = editingUser ? 'PATCH' : 'POST';

    const payload = { ...formData };
    if (editingUser) {
      delete (payload as any).password; // Don't send password on edit
    }

    const { ok, data } = await apiFetch<User>(endpoint, {
      method,
      body: JSON.stringify(payload),
    });

    if (ok) {
      setShowUserModal(false);
      setSuccess(`User successfully ${editingUser ? 'updated' : 'created'}.`);
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(JSON.stringify(data) || 'Failed to save user');
    }
  };

  const handleToggleActive = async (targetUser: User) => {
    if (!confirm(`Are you sure you want to ${targetUser.is_active ? 'deactivate' : 'activate'} ${targetUser.username}?`)) return;

    const { ok } = await apiFetch(`/api/users/${targetUser.id}/`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active: !targetUser.is_active })
    });
    if (ok) fetchUsers();
  };

  const handleDelete = async (targetUser: User) => {
    if (targetUser.id === user?.id) {
      setError("You cannot delete your own account.");
      return;
    }
    if (!confirm(`DANGER: Are you sure you want to permanently delete ${targetUser.username}?`)) return;

    const { ok } = await apiFetch(`/api/users/${targetUser.id}/`, { method: 'DELETE' });
    if (ok) {
      setSuccess('User deleted permanently.');
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleOpenPasswordModal = (targetUser: User) => {
    setEditingUser(targetUser);
    setPasswordData({ password: '' });
    setError('');
    setSuccess('');
    setShowPasswordModal(true);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!editingUser) return;

    const { ok, data } = await apiFetch(`/api/users/${editingUser.id}/set-password/`, {
      method: 'POST',
      body: JSON.stringify(passwordData)
    });

    if (ok) {
      setShowPasswordModal(false);
      setSuccess(`Password for ${editingUser.username} successfully updated.`);
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(JSON.stringify(data) || 'Failed to reset password');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center space-y-4">
          <ShieldCheck size={48} className="mx-auto text-gray-300" />
          <h2 className="text-xl font-bold text-gray-700">Access Denied</h2>
          <p className="text-gray-500 text-sm">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#1A3B3E]">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage system administrators and staff accounts.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#00A8BC] text-white px-4 py-2 rounded-lg font-bold text-sm hover:scale-105 transition-transform shadow-md shadow-[#00A8BC]/20"
        >
          <Plus size={16} /> Add New User
        </button>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
          {success}
        </div>
      )}
      {error && !showUserModal && !showPasswordModal && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#E6F7F9]/50 border-b border-gray-100">
                <th className="p-4 text-xs font-bold text-[#5F7E82] uppercase tracking-wider">User</th>
                <th className="p-4 text-xs font-bold text-[#5F7E82] uppercase tracking-wider">Role</th>
                <th className="p-4 text-xs font-bold text-[#5F7E82] uppercase tracking-wider">Contact</th>
                <th className="p-4 text-xs font-bold text-[#5F7E82] uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-[#5F7E82] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-sm text-gray-400">Loading users...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-sm text-gray-400">No users found.</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-[#1A3B3E]">{u.username}</div>
                      <div className="text-xs text-gray-500">{u.first_name} {u.last_name}</div>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold",
                        u.role === 'admin' ? "bg-purple-100 text-purple-700" :
                          u.role === 'manager' ? "bg-blue-100 text-blue-700" :
                            "bg-gray-100 text-gray-700"
                      )}>
                        {ROLES.find(r => r.value === u.role)?.label || u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-xs text-gray-700">{u.email}</div>
                      <div className="text-[10px] text-gray-400">{u.phone || '—'}</div>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "flex items-center gap-1.5 text-xs font-semibold select-none",
                        u.is_active ? "text-green-600" : "text-gray-400"
                      )}>
                        <div className={cn("w-2 h-2 rounded-full", u.is_active ? "bg-green-500" : "bg-gray-300")} />
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenPasswordModal(u)} title="Reset Password"
                          className="p-1.5 text-orange-400 hover:bg-orange-50 rounded-md transition-colors">
                          <Key size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleActive(u)}
                          title={u.id === user?.id ? "Cannot deactivate yourself" : (u.is_active ? 'Deactivate User' : 'Activate User')}
                          disabled={u.id === user?.id}
                          className={cn("p-1.5 rounded-md transition-colors", u.id === user?.id ? "text-gray-300 cursor-not-allowed" : "text-gray-400 hover:bg-gray-50")}
                        >
                          {u.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
                        </button>
                        <button onClick={() => handleOpenModal(u)} title="Edit User"
                          className="p-1.5 text-blue-400 hover:bg-blue-50 rounded-md transition-colors">
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(u)}
                          title={u.id === user?.id ? "Cannot delete yourself" : "Delete User"}
                          disabled={u.id === user?.id}
                          className={cn("p-1.5 rounded-md transition-colors", u.id === user?.id ? "text-gray-300 cursor-not-allowed" : "text-red-400 hover:bg-red-50")}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE/EDIT USER MODAL */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-[#1A3B3E]">
                {editingUser ? 'Edit User' : 'Create New User'}
              </h2>
              <button onClick={() => setShowUserModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              {error && <div className="mb-4 text-xs font-bold text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
              <form onSubmit={handleSaveUser} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#5F7E82]">First Name</label>
                    <input required type="text" className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-[#00A8BC]/20 outline-none"
                      value={formData.first_name} onChange={e => setFormData({ ...formData, first_name: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#5F7E82]">Last Name</label>
                    <input required type="text" className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-[#00A8BC]/20 outline-none"
                      value={formData.last_name} onChange={e => setFormData({ ...formData, last_name: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#5F7E82]">Username*</label>
                  <input required type="text" className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-[#00A8BC]/20 outline-none"
                    value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#5F7E82]">Email Address*</label>
                  <input required type="email" className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-[#00A8BC]/20 outline-none"
                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#5F7E82]">Role*</label>
                    <select className="w-full text-sm border border-gray-200 rounded-lg p-2 text-gray-700 bg-white focus:ring-2 focus:ring-[#00A8BC]/20 outline-none"
                      value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                      {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#5F7E82]">Phone (Optional)</label>
                    <input type="text" className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-[#00A8BC]/20 outline-none"
                      value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                </div>
                {!editingUser && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#5F7E82]">Initial Password*</label>
                    <input required type="password" minLength={9} className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-[#00A8BC]/20 outline-none"
                      value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="Min 9 characters" />
                  </div>
                )}
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowUserModal(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm font-bold bg-[#00A8BC] text-white rounded-lg hover:opacity-90 leading-tight">Save User</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {showPasswordModal && editingUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-base font-bold text-[#1A3B3E]">Reset Password</h2>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="p-6">
              {error && <div className="mb-4 text-xs font-bold text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
              <p className="text-xs text-gray-500 mb-4">You are securely changing the password for <b>{editingUser.username}</b>.</p>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#5F7E82]">New Password</label>
                  <input required type="password" minLength={9} className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-[#00A8BC]/20 outline-none"
                    value={passwordData.password} onChange={e => setPasswordData({ password: e.target.value })} placeholder="Min 9 characters" />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setShowPasswordModal(false)} className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                  <button type="submit" className="px-3 py-1.5 text-xs font-bold bg-orange-500 text-white rounded-lg hover:opacity-90 flex items-center gap-1">
                    <Key size={14} /> Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}