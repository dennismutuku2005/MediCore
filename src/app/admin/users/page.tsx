'use client';
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import PageSkeleton from '@/components/ui/PageSkeleton';
import { apiFetch } from '@/lib/api';
import { PersonIcon, EditIcon, TrashIcon, PlusIcon, SearchIcon, EyeIcon, EyeOffIcon } from '@/components/ui/Icons';
import { toast } from 'sonner';

export default function AdminUsers() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<any>(null);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({ id: '', name: '', username: '', password: '', email: '', phone: '', role: 'NURSE', status: 'active' });

  const fetchData = async () => {
    try {
      const res = await apiFetch('/users');
      if (res.status === 'success') {
        setUsers(res.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = users.filter(u => 
    (u.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (u.username || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingUser(null);
    setForm({ id: '', name: '', username: '', password: '', email: '', phone: '', role: 'NURSE', status: 'ACTIVE' });
    setModalOpen(true);
  };

  const handleOpenEdit = (user: any) => {
    setEditingUser(user);
    setForm({ 
      id: user.id, 
      name: user.name, 
      username: user.username, 
      password: '', 
      email: user.email || '', 
      phone: user.phone || '',
      role: user.role, 
      status: user.status || 'active' 
    });
    setModalOpen(true);
  };

  const handleOpenView = (user: any) => {
    setViewingUser(user);
    setViewModalOpen(true);
  };

  const handleOpenDelete = (user: any) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await apiFetch('/users', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      if (res.status === 'success') {
        await fetchData();
        setModalOpen(false);
        toast.success(editingUser ? "User updated successfully" : "User created successfully");
      }
    } catch (error) {
      toast.error("Failed to save user.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleting(true);
    try {
      const res = await apiFetch(`/users?id=${id}`, { method: 'DELETE' });
      
      if (res.status === 'error') {
        toast.error(res.message || "Failed to delete user");
      } else {
        await fetchData();
        setDeleteModalOpen(false);
        setUserToDelete(null);
        toast.success(res.message || "User removed from system");
      }
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <PageSkeleton variant="list" />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-[350px]">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <SearchIcon size={16} />
          </div>
          <input 
            className="w-full h-10 pl-10 pr-4 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-all shadow-sm" 
            placeholder="Search users..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
        <Button onClick={handleOpenAdd} className="h-10 text-[11px] font-black uppercase tracking-widest">
          <PlusIcon size={14} /> 
          <span className="ml-2">Create New User</span>
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <Table headers={['User', 'Username', 'Email', 'Role', 'Status', 'Actions']}>
          {filtered.map(u => (
            <tr key={u.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 font-medium group cursor-pointer" onClick={() => handleOpenView(u)}>
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <PersonIcon size={16} />
                  </div>
                  <span className="text-sm font-bold text-slate-800">{u.name}</span>
                </div>
              </td>
              <td className="px-5 py-4 text-sm text-slate-600 font-mono">{u.username}</td>
              <td className="px-5 py-4 text-sm text-slate-500">{u.email || 'N/A'}</td>
              <td className="px-5 py-4 text-sm"><Badge status={u.role} /></td>
              <td className="px-5 py-4 text-sm"><Badge status={u.status || 'active'} /></td>
              <td className="px-5 py-4 text-sm" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all" onClick={() => handleOpenEdit(u)} title="Edit User">
                    <EditIcon size={16} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all" onClick={() => handleOpenDelete(u)} title="Delete User">
                    <TrashIcon size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingUser ? "Edit User Account" : "Create User Account"}
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button loading={saving} onClick={handleSave}>{editingUser ? "Update User" : "Create User"}</Button></>}>
        <div className="space-y-4 py-2">
          <Input label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
            <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <Input label="Phone" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Role" options={[{value:'ADMIN',label:'Admin'},{value:'DOCTOR',label:'Doctor'},{value:'NURSE',label:'Nurse'},{value:'LABTECH',label:'Lab Tech'},{value:'PATIENT',label:'Patient'}]} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
            <Input label="Status" options={[{value:'active',label:'Active'},{value:'inactive',label:'Inactive'}]} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} />
          </div>
          <Input 
            label="Password" 
            type={showPassword ? "text" : "password"} 
            placeholder={editingUser ? "Leave blank to keep current" : "Enter password"} 
            value={form.password} 
            onChange={e => setForm({ ...form, password: e.target.value })} 
            suffix={
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="focus:outline-none hover:text-blue-600 transition-colors"
              >
                {showPassword ? <EyeOffIcon size={14} /> : <EyeIcon size={14} />}
              </button>
            }
          />
        </div>
      </Modal>

      <Modal open={viewModalOpen} onClose={() => setViewModalOpen(false)} title="User Account Details"
        footer={<><Button variant="secondary" onClick={() => setViewModalOpen(false)}>Close</Button><Button onClick={() => { setViewModalOpen(false); handleOpenEdit(viewingUser); }}>Edit User</Button></>}>
        {viewingUser && (
          <div className="space-y-4 py-4">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Full Name</p>
              <p className="text-sm font-bold text-slate-800 mt-1">{viewingUser.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Username</p>
                <p className="text-sm font-mono text-slate-800 mt-1">{viewingUser.username}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Email</p>
                <p className="text-sm text-slate-600 mt-1">{viewingUser.email || 'N/A'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Phone</p>
                <p className="text-sm text-slate-600 mt-1">{viewingUser.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Role</p>
                <p className="text-sm mt-1"><Badge status={viewingUser.role} /></p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                <p className="text-sm mt-1"><Badge status={viewingUser.status || 'active'} /></p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Account Created</p>
                <p className="text-sm text-slate-600 mt-1">{viewingUser.createdAt ? new Date(viewingUser.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Remove Medical Professional"
        footer={<><Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button><Button variant="danger" loading={deleting} onClick={() => userToDelete && handleDelete(userToDelete.id)}>Confirm Removal</Button></>}>
        {userToDelete && (
          <div className="space-y-4 py-4">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg">
              <p className="text-sm font-bold text-rose-900">Warning: This action cannot be undone</p>
            </div>
            <p className="text-sm text-slate-700">
              Are you sure you want to remove <span className="font-bold text-slate-900">{userToDelete.name}</span> ({userToDelete.username}) from the system?
            </p>
            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">User Information</p>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-400">Role</p>
                  <p className="font-bold text-slate-800">{userToDelete.role}</p>
                </div>
                <div>
                  <p className="text-slate-400">Status</p>
                  <p className="font-bold text-slate-800">{userToDelete.status}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-400">Email</p>
                  <p className="font-bold text-slate-800">{userToDelete.email || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
