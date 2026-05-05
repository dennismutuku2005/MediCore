'use client';
import React, { useState, useEffect } from 'react';
import { tableStyles } from '@/components/ui/Table';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { SearchIcon, EditIcon, TrashIcon, PlusIcon } from '@/components/ui/Icons';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';

export default function AdminNurses() {
  const [loading, setLoading] = useState(true);
  const [nursesList, setNursesList] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ id: '', name: '', email: '', phone: '', ward: 'Ward A', shift: 'Morning', username: '', password: '' });
  const [editingNurse, setEditingNurse] = useState<any>(null);

  const fetchNurses = async () => {
    try {
      const res = await apiFetch('/nurses');
      if (res.status === 'success') {
        setNursesList(res.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch nurses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNurses();
  }, []);

  const filtered = nursesList.filter(n => (n.name || '').toLowerCase().includes(search.toLowerCase()));
  const getInitials = (n: string) => n.split(' ').map(w => w[0]).join('').slice(0, 2);

  const handleOpenAdd = () => {
    setEditingNurse(null);
    setForm({ id: '', name: '', email: '', phone: '', ward: 'Ward A', shift: 'Morning', username: '', password: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (nurse: any) => {
    setEditingNurse(nurse);
    setForm({ 
      id: nurse.id, 
      name: nurse.name, 
      email: nurse.email || '', 
      phone: nurse.phone || '',
      ward: nurse.ward || 'Ward A', 
      shift: nurse.shift || 'Morning',
      username: nurse.username || '',
      password: ''
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await apiFetch('/nurses', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      if (res.status === 'success') {
        await fetchNurses();
        setModalOpen(false);
        toast.success(editingNurse ? "Nursing record updated successfully" : "Nursing staff enrolled successfully");
      }
    } catch (error) {
      toast.error("Failed to save nursing record.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to remove this nursing record?')) {
      try {
        await apiFetch(`/nurses?id=${id}`, { method: 'DELETE' });
        await fetchNurses();
        toast.success("Nursing record removed from registry");
      } catch (error) {
        toast.error("Failed to delete record.");
      }
    }
  };

  if (loading) return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SkeletonLoader width={250} height={36} />
        <SkeletonLoader width={150} height={36} />
      </div>
      <div className="bg-white border border-slate-200 rounded p-5 space-y-3 shadow-sm">
        <SkeletonLoader variant="row" count={7} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-[350px]">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <SearchIcon size={16} />
          </div>
          <input 
            className="w-full h-10 pl-10 pr-4 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-all shadow-sm" 
            placeholder="Search nursing staff registry..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
        <Button onClick={handleOpenAdd} className="h-10 text-[11px] font-black uppercase tracking-widest">
          <PlusIcon size={14} /> 
          <span className="ml-2">Enroll Nursing Staff</span>
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <Table headers={['Identity', 'Staff Name', 'Ward Allocation', 'Operational Shift', 'Status', 'Matrix Action']}>
          {filtered.map(n => (
            <tr key={n.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 font-medium group">
              <td className="px-5 py-3"><div className={tableStyles.avatar} style={{ background: '#ecfdf5', color: '#059669' }}>{getInitials(n.name)}</div></td>
              <td className="px-5 py-3 text-sm font-bold text-slate-800">{n.name}</td>
              <td className="px-5 py-3 text-sm text-slate-600 font-bold">{n.ward}</td>
              <td className="px-5 py-3 text-sm"><Badge status={n.shift} /></td>
              <td className="px-5 py-3 text-sm"><Badge status={n.status || 'active'} /></td>
              <td className="px-5 py-3 text-sm">
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all" title="Modify Record" onClick={() => handleOpenEdit(n)}>
                    <EditIcon size={16} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all" title="De-register" onClick={() => handleDelete(n.id)}>
                    <TrashIcon size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
        {filtered.length === 0 && (
          <div className="p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            No nursing staff identified in the medical registry
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingNurse ? "Update Protocol: Nursing Staff" : "Enrollment: Nursing Staff"}
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Abort interface</Button><Button loading={saving} onClick={handleSave}>{editingNurse ? "Commit Updates" : "Finalize Enrollment"}</Button></>}>
        <div className="space-y-4 py-2">
          <Input label="Full Legal Name" placeholder="e.g. Patricia Wanjiku" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Clinical Email" type="email" placeholder="patricia@medicore.ke" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <Input label="Mobile Link" placeholder="+254 700 000 000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Ward Allocation" options={[{value:'Ward A',label:'Ward A'},{value:'Ward B',label:'Ward B'},{value:'Ward C',label:'Ward C'},{value:'ICU',label:'ICU'}]} value={form.ward} onChange={e => setForm({ ...form, ward: e.target.value })} />
            <Input label="Operational Shift" options={[{value:'Morning',label:'Morning'},{value:'Evening',label:'Evening'},{value:'Night',label:'Night'}]} value={form.shift} onChange={e => setForm({ ...form, shift: e.target.value })} />
          </div>
          <div className="pt-4 border-t border-slate-50">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">System Authentication</h4>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Identifier (Username)" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
              <Input label="Security Key (Password)" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder={editingNurse ? "Leave blank to preserve" : "Enter temporary key"} />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
