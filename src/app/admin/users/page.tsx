'use client';
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { apiFetch } from '@/lib/api';
import { PersonIcon, EditIcon, TrashIcon, PlusIcon, SearchIcon } from '@/components/ui/Icons';
import { toast } from 'sonner';

export default function AdminUsers() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ id: '', name: '', username: '', password: '', email: '', role: 'NURSE', status: 'ACTIVE' });

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
    setForm({ id: '', name: '', username: '', password: '', email: '', role: 'NURSE', status: 'ACTIVE' });
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
      role: user.role, 
      status: user.status || 'ACTIVE' 
    });
    setModalOpen(true);
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
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await apiFetch(`/users?id=${id}`, { method: 'DELETE' });
        await fetchData();
        toast.success("User removed from system");
      } catch (error) {
        toast.error("Failed to delete user.");
      }
    }
  };

  if (loading) return (
    <div className="space-y-6">
      <SkeletonLoader height={40} width={200} />
      <SkeletonLoader height={400} className="rounded-xl shadow-sm" />
    </div>
  );

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
            <tr key={u.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 font-medium group">
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
              <td className="px-5 py-4 text-sm"><Badge status={u.status || 'ACTIVE'} /></td>
              <td className="px-5 py-4 text-sm">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all" onClick={() => handleOpenEdit(u)}>
                    <EditIcon size={16} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all" onClick={() => handleDelete(u.id)}>
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
          <div className="grid grid-cols-2 gap-4">
            <Input label="Role" options={[{value:'ADMIN',label:'Admin'},{value:'DOCTOR',label:'Doctor'},{value:'NURSE',label:'Nurse'},{value:'LABTECH',label:'Lab Tech'},{value:'PATIENT',label:'Patient'}]} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
            <Input label="Status" options={[{value:'ACTIVE',label:'Active'},{value:'INACTIVE',label:'Inactive'}]} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} />
          </div>
          <Input label="Password" type="password" placeholder={editingUser ? "Leave blank to keep current" : "Enter password"} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        </div>
      </Modal>
    </div>
  );
}
