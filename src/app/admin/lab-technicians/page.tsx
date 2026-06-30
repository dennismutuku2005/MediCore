'use client';
import React, { useState, useEffect } from 'react';
import { tableStyles } from '@/components/ui/Table';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import PageSkeleton from '@/components/ui/PageSkeleton';
import { SearchIcon, EditIcon, TrashIcon, PlusIcon, EyeIcon } from '@/components/ui/Icons';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';

export default function AdminLabTechs() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ id: '', name: '', email: '', phone: '', username: '', password: '' });
  const [editingTech, setEditingTech] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTech, setSelectedTech] = useState<any>(null);
  const [techToDelete, setTechToDelete] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    try {
      const res = await apiFetch('/labtechs');
      if (res.status === 'success') {
        setList(res.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch lab techs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  const filtered = list.filter(l => (l.name || '').toLowerCase().includes(search.toLowerCase()));
  const getInitials = (n: string) => n.split(' ').map(w => w[0]).join('').slice(0, 2);

  const handleOpenAdd = () => {
    setEditingTech(null);
    setForm({ id: '', name: '', email: '', phone: '', username: '', password: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (tech: any) => {
    setEditingTech(tech);
    setForm({ 
      id: tech.id, 
      name: tech.name, 
      email: tech.email || '', 
      phone: tech.phone || '',
      username: tech.username || '',
      password: ''
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await apiFetch('/labtechs', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      if (res.status === 'success') {
        await fetchData();
        setModalOpen(false);
        toast.success(editingTech ? "Laboratory staff record updated" : "Laboratory professional enrolled successfully");
      }
    } catch (error) {
      toast.error("Failed to save laboratory staff record.");
    } finally {
      setSaving(false);
    }
  };

  const handleOpenView = (tech: any) => {
    setSelectedTech(tech);
    setViewModalOpen(true);
  };

  const handleOpenDelete = (tech: any) => {
    setTechToDelete(tech);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!techToDelete) return;
    setDeleting(true);
    try {
      await apiFetch(`/labtechs?id=${techToDelete.id}`, { method: 'DELETE' });
      await fetchData();
      setDeleteModalOpen(false);
      setTechToDelete(null);
      toast.success("Staff record removed from registry");
    } catch (error) {
      toast.error("Failed to delete record.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <PageSkeleton variant="list" />;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-[350px]">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <SearchIcon size={16} />
          </div>
          <input 
            className="w-full h-10 pl-10 pr-4 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-all shadow-sm" 
            placeholder="Search laboratory staff registry..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
        <Button onClick={handleOpenAdd} className="h-10 text-[11px] font-bold uppercase tracking-wider">
          <PlusIcon size={14} /> 
          <span className="ml-2">Register Laboratory Staff</span>
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <Table headers={['Identity', 'Consultant Name', 'Email Address', 'Mobile Contact', 'Operational Status', 'Matrix Action']}>
          {filtered.map(l => (
            <tr key={l.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 font-medium group">
              <td className="px-5 py-3"><div className={tableStyles.avatar} style={{ background: '#eff6ff', color: '#2563eb' }}>{getInitials(l.name)}</div></td>
              <td className="px-5 py-3 text-sm font-bold text-slate-800">{l.name}</td>
              <td className="px-5 py-3 text-sm text-slate-600 font-bold">{l.email}</td>
              <td className="px-5 py-3 text-sm text-slate-500 font-mono">{l.phone}</td>
              <td className="px-5 py-3 text-sm"><Badge status={l.status || 'active'} /></td>
              <td className="px-5 py-3 text-sm">
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all" title="View Profile" onClick={() => handleOpenView(l)}>
                    <EyeIcon size={16} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all" title="Modify Profile" onClick={() => handleOpenEdit(l)}>
                    <EditIcon size={16} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all" title="De-register Staff" onClick={() => handleOpenDelete(l)}>
                    <TrashIcon size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
        {filtered.length === 0 && (
          <div className="p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            No laboratory staff identified in the medical registry
          </div>
        )}
      </div>

      <Modal open={viewModalOpen} onClose={() => { setViewModalOpen(false); setSelectedTech(null); }} title="Laboratory Staff Details"
        footer={<><Button variant="secondary" onClick={() => { setViewModalOpen(false); setSelectedTech(null); }}>Close</Button><Button onClick={() => { setViewModalOpen(false); handleOpenEdit(selectedTech); }}>Edit Profile</Button></>}> 
        {selectedTech && (
          <div className="space-y-4 py-2">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Name</p>
              <p className="text-sm font-bold text-slate-800 mt-1">{selectedTech.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Email</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{selectedTech.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Phone</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{selectedTech.phone || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={deleteModalOpen} onClose={() => { setDeleteModalOpen(false); setTechToDelete(null); }} title="Confirm Removal"
        footer={<><Button variant="secondary" onClick={() => { setDeleteModalOpen(false); setTechToDelete(null); }}>Cancel</Button><Button loading={deleting} onClick={handleDelete}>Delete Record</Button></>}> 
        <div className="space-y-2 py-2">
          <p className="text-sm text-slate-700">Remove this laboratory staff member from the registry?</p>
          <p className="text-sm font-bold text-slate-900">{techToDelete?.name}</p>
        </div>
      </Modal>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingTech ? "Modify Laboratory Profile" : "Register Diagnostic Staff"}
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button loading={saving} onClick={handleSave}>{editingTech ? "Update Profile" : "Confirm Enrollment"}</Button></>}>
        <div className="space-y-4 py-2">
          <Input label="Staff Member Name" placeholder="e.g. John Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Work Email" type="email" placeholder="john.doe@medicore.ke" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            <Input label="Emergency Phone" placeholder="+254 700 000 000" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          </div>
          <div className="pt-4 border-t border-slate-50">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">System Authentication</h4>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Identifier (Username)" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
              <Input label="Security Key (Password)" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder={editingTech ? "Leave blank to preserve" : "Enter temporary key"} />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
