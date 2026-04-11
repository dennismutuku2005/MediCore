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

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  const filtered = nursesList.filter(n => n.name.toLowerCase().includes(search.toLowerCase()));
  const getInitials = (n: string) => n.split(' ').map(w => w[0]).join('').slice(0, 2);

  const handleAdd = () => {
    setSaving(true);
    setTimeout(() => {
      const newNurse: Nurse = {
        id: `N${String(nursesList.length + 1).padStart(3, '0')}`,
        name: form.name || 'New Nurse', ward: form.ward || 'Ward A',
        shift: (form.shift as Nurse['shift']) || 'Morning', status: 'active', email: form.email || '',
      };
      setNursesList([...nursesList, newNurse]);
      setSaving(false); setModalOpen(false);
      setForm({ name: '', email: '', ward: '', shift: '' });
    }, 1000);
  };

  if (loading) return <><SkeletonLoader height={40} style={{ marginBottom: 20 }} /><SkeletonLoader height={52} count={6} /></>;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="w-full h-9 px-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none">
          <span className="w-full h-9 px-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none"><SearchIcon size={15} /></span>
          <input className="w-full h-9 px-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none" placeholder="Search nurses..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Button onClick={() => setModalOpen(true)}><PlusIcon size={16} /> Add Nurse</Button>
      </div>

      <Table headers={['', 'Name', 'Ward', 'Shift', 'Status', 'Actions']} isEmpty={filtered.length === 0}>
        {filtered.map(n => (
          <tr key={n.id}>
            <td><div className={tableStyles.avatar} style={{ background: 'var(--success)' }}>{getInitials(n.name)}</div></td>
            <td><strong>{n.name}</strong></td>
            <td>{n.ward}</td>
            <td><Badge status={n.shift} /></td>
            <td><Badge status={n.status} /></td>
            <td>
              <div className={tableStyles.actions}>
                <button className={tableStyles.actionBtn}><EditIcon size={14} /></button>
                <button className={`${tableStyles.actionBtn} ${tableStyles.dangerBtn}`}><TrashIcon size={14} /></button>
              </div>
            </td>
          </tr>
        ))}
      </Table>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Nurse"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button loading={saving} onClick={handleAdd}>Add Nurse</Button></>}>
        <Input label="Full Name" placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <Input label="Email" type="email" placeholder="email@medicore.ke" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <Input label="Ward" options={[{value:'Ward A',label:'Ward A'},{value:'Ward B',label:'Ward B'},{value:'Ward C',label:'Ward C'},{value:'ICU',label:'ICU'}]} value={form.ward} onChange={e => setForm({ ...form, ward: e.target.value })} />
        <Input label="Shift" options={[{value:'Morning',label:'Morning'},{value:'Evening',label:'Evening'},{value:'Night',label:'Night'}]} value={form.shift} onChange={e => setForm({ ...form, shift: e.target.value })} />
      </Modal>
    </>
  );
}
