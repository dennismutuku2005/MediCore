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
import { labTechnicians as initial } from '@/lib/mockData';
import { LabTechnician } from '@/lib/types';

export default function AdminLabTechs() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<LabTechnician[]>(initial);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  const [editingTech, setEditingTech] = useState<LabTechnician | null>(null);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);
  
  const filtered = list.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));
  const getInitials = (n: string) => n.split(' ').map(w => w[0]).join('').slice(0, 2);

  const handleOpenAdd = () => {
    setEditingTech(null);
    setForm({ name: '', email: '', phone: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (tech: LabTechnician) => {
    setEditingTech(tech);
    setForm({ name: tech.name, email: tech.email || '', phone: tech.phone || '' });
    setModalOpen(true);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      if (editingTech) {
        setList(list.map(l => l.id === editingTech.id ? { ...l, ...form } : l));
      } else {
        const newTech: LabTechnician = {
          id: `L${String(list.length + 1).padStart(3, '0')}`,
          name: form.name || 'New Lab Professional',
          email: form.email || '',
          phone: form.phone || '',
          status: 'active'
        };
        setList([...list, newTech]);
      }
      setSaving(false);
      setModalOpen(false);
      setEditingTech(null);
      setForm({ name: '', email: '', phone: '' });
    }, 1000);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this lab technician?')) {
      setList(list.filter(l => l.id !== id));
    }
  };

  if (loading) return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SkeletonLoader width={250} height={36} />
        <SkeletonLoader width={150} height={36} />
      </div>
      <div className="bg-white border border-slate-200 rounded p-5 space-y-3 shadow-sm">
        <SkeletonLoader variant="row" count={5} />
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
            placeholder="Search laboratory staff..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
        <Button onClick={handleOpenAdd} className="h-10">
          <PlusIcon size={16} /> 
          <span className="ml-1">Add Lab Professional</span>
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <Table headers={['', 'Consultant Name', 'Email Address', 'Mobile Contact', 'Current Status', 'Action']}>
          {filtered.map(l => (
            <tr key={l.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 font-medium">
              <td className="px-5 py-3"><div className={tableStyles.avatar} style={{ background: '#eff6ff', color: '#2563eb' }}>{getInitials(l.name)}</div></td>
              <td className="px-5 py-3 text-sm font-bold text-slate-800">{l.name}</td>
              <td className="px-5 py-3 text-sm text-slate-600">{l.email}</td>
              <td className="px-5 py-3 text-sm text-slate-500">{l.phone}</td>
              <td className="px-5 py-3 text-sm"><Badge status={l.status} /></td>
              <td className="px-5 py-3 text-sm text-right">
                <div className="flex items-center gap-2">
                  <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit Staff" onClick={() => handleOpenEdit(l)}>
                    <EditIcon size={14} />
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors" title="Remove Record" onClick={() => handleDelete(l.id)}>
                    <TrashIcon size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
        {filtered.length === 0 && (
          <div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
            No laboratory staff found matching "{search}"
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingTech ? "Update Lab Profile" : "Add Lab Technician"}
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button loading={saving} onClick={handleSave}>{editingTech ? "Update Records" : "Save Tech Record"}</Button></>}>
        <div className="space-y-4 py-2">
          <Input label="Staff Member Name" placeholder="e.g. John Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <Input label="Work Email" type="email" placeholder="john.doe@medicore.ke" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <Input label="Emergency Phone" placeholder="+254..." value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
        </div>
      </Modal>
    </div>
  );
}
