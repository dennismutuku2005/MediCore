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
import { nurses as initialNurses } from '@/lib/mockData';
import { Nurse } from '@/lib/types';

export default function AdminNurses() {
  const [loading, setLoading] = useState(true);
  const [nursesList, setNursesList] = useState<Nurse[]>(initialNurses);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', ward: '', shift: '' });
  const [editingNurse, setEditingNurse] = useState<Nurse | null>(null);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  const filtered = nursesList.filter(n => n.name.toLowerCase().includes(search.toLowerCase()));
  const getInitials = (n: string) => n.split(' ').map(w => w[0]).join('').slice(0, 2);

  const handleOpenAdd = () => {
    setEditingNurse(null);
    setForm({ name: '', email: '', ward: '', shift: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (nurse: Nurse) => {
    setEditingNurse(nurse);
    setForm({ name: nurse.name, email: nurse.email || '', ward: nurse.ward, shift: nurse.shift });
    setModalOpen(true);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      if (editingNurse) {
        setNursesList(nursesList.map(n => n.id === editingNurse.id ? { ...n, ...form as any } : n));
      } else {
        const newNurse: Nurse = {
          id: `N${String(nursesList.length + 1).padStart(3, '0')}`,
          name: form.name || 'New Nurse', ward: form.ward || 'Ward A',
          shift: (form.shift as Nurse['shift']) || 'Morning', status: 'active', email: form.email || '',
        };
        setNursesList([...nursesList, newNurse]);
      }
      setSaving(false);
      setModalOpen(false);
      setEditingNurse(null);
      setForm({ name: '', email: '', ward: '', shift: '' });
    }, 1000);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this nursing record?')) {
      setNursesList(nursesList.filter(n => n.id !== id));
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
            className="w-full h-10 pl-10 pr-4 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-all" 
            placeholder="Search nursing staff..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
        <Button onClick={handleOpenAdd} className="h-10">
          <PlusIcon size={16} /> 
          <span className="ml-1">Add Nursing Staff</span>
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <Table headers={['', 'Nurse Name', 'Assigned Ward', 'Active Shift', 'Status', 'Actions']}>
          {filtered.map(n => (
            <tr key={n.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 font-medium">
              <td className="px-5 py-3"><div className={tableStyles.avatar} style={{ background: '#ecfdf5', color: '#059669' }}>{getInitials(n.name)}</div></td>
              <td className="px-5 py-3 text-sm font-bold text-slate-800">{n.name}</td>
              <td className="px-5 py-3 text-sm text-slate-600">{n.ward}</td>
              <td className="px-5 py-3 text-sm"><Badge status={n.shift} /></td>
              <td className="px-5 py-3 text-sm"><Badge status={n.status} /></td>
              <td className="px-5 py-3 text-sm">
                <div className="flex items-center gap-2">
                  <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit Staff" onClick={() => handleOpenEdit(n)}>
                    <EditIcon size={14} />
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors" title="Remove Record" onClick={() => handleDelete(n.id)}>
                    <TrashIcon size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
        {filtered.length === 0 && (
          <div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
            No nursing staff found matching "{search}"
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingNurse ? "Update Staff Information" : "Add Nursing Staff"}
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button loading={saving} onClick={handleSave}>{editingNurse ? "Update Records" : "Save Staff Record"}</Button></>}>
        <div className="space-y-4 py-2">
          <Input label="Full Name" placeholder="e.g. Nurse Alice" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input label="Staff Email" type="email" placeholder="alice@medicore.ke" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Assigned Ward" options={[{value:'Ward A',label:'Ward A'},{value:'Ward B',label:'Ward B'},{value:'Ward C',label:'Ward C'},{value:'ICU',label:'ICU'}]} value={form.ward} onChange={e => setForm({ ...form, ward: e.target.value })} />
            <Input label="Work Shift" options={[{value:'Morning',label:'Morning'},{value:'Evening',label:'Evening'},{value:'Night',label:'Night'}]} value={form.shift} onChange={e => setForm({ ...form, shift: e.target.value })} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
