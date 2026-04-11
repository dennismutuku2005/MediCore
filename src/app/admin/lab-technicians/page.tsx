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

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);
  const filtered = list.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));
  const getInitials = (n: string) => n.split(' ').map(w => w[0]).join('').slice(0, 2);

  const handleAdd = () => {
    setSaving(true);
    setTimeout(() => {
      setList([...list, { id: `L${String(list.length+1).padStart(3,'0')}`, name: form.name||'New Tech', email: form.email||'', status: 'active', phone: form.phone||'' }]);
      setSaving(false); setModalOpen(false); setForm({ name:'', email:'', phone:'' });
    }, 1000);
  };

  if (loading) return <><SkeletonLoader height={40} style={{ marginBottom: 20 }} /><SkeletonLoader height={52} count={4} /></>;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="w-full h-9 px-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none"><span className="w-full h-9 px-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none"><SearchIcon size={15} /></span>
          <input className="w-full h-9 px-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none" placeholder="Search lab technicians..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        <Button onClick={() => setModalOpen(true)}><PlusIcon size={16} /> Add Lab Technician</Button>
      </div>
      <Table headers={['', 'Name', 'Email', 'Phone', 'Status', 'Actions']} isEmpty={filtered.length===0}>
        {filtered.map(l => (
          <tr key={l.id}>
            <td><div className={tableStyles.avatar} style={{ background: 'var(--info)' }}>{getInitials(l.name)}</div></td>
            <td><strong>{l.name}</strong></td><td>{l.email}</td><td>{l.phone}</td>
            <td><Badge status={l.status} /></td>
            <td><div className={tableStyles.actions}>
              <button className={tableStyles.actionBtn}><EditIcon size={14} /></button>
              <button className={`${tableStyles.actionBtn} ${tableStyles.dangerBtn}`}><TrashIcon size={14} /></button>
            </div></td>
          </tr>
        ))}
      </Table>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Lab Technician"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button loading={saving} onClick={handleAdd}>Add</Button></>}>
        <Input label="Full Name" placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        <Input label="Email" type="email" placeholder="email@medicore.ke" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <Input label="Phone" placeholder="0717 111 222" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
      </Modal>
    </>
  );
}
