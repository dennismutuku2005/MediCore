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
import { doctors as initialDoctors } from '@/lib/mockData';
import { Doctor } from '@/lib/types';

export default function AdminDoctors() {
  const [loading, setLoading] = useState(true);
  const [doctorsList, setDoctorsList] = useState<Doctor[]>(initialDoctors);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', specialization: '', phone: '', ward: '', username: '', password: '' });

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  const filtered = doctorsList.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    setSaving(true);
    setTimeout(() => {
      const newDoc: Doctor = {
        id: `D${String(doctorsList.length + 1).padStart(3, '0')}`,
        name: form.name || 'New Doctor',
        specialization: form.specialization || 'General',
        email: form.email || '',
        phone: form.phone || '',
        ward: form.ward || 'Ward A',
        status: 'active',
        username: form.username || 'newdoc',
      };
      setDoctorsList([...doctorsList, newDoc]);
      setSaving(false);
      setModalOpen(false);
      setForm({ name: '', email: '', specialization: '', phone: '', ward: '', username: '', password: '' });
    }, 1000);
  };

  const getInitials = (n: string) => n.split(' ').map(w => w[0]).join('').slice(0, 2);

  if (loading) return <><SkeletonLoader height={40} style={{ marginBottom: 20 }} /><SkeletonLoader height={52} count={6} /></>;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="w-full h-9 px-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none">
          <span className="w-full h-9 px-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none"><SearchIcon size={15} /></span>
          <input className="w-full h-9 px-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none" placeholder="Search doctors..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Button onClick={() => setModalOpen(true)}><PlusIcon size={16} /> Add Doctor</Button>
      </div>

      <Table headers={['', 'Name', 'Specialization', 'Contact', 'Ward', 'Status', 'Actions']} isEmpty={filtered.length === 0}>
        {filtered.map(d => (
          <tr key={d.id}>
            <td><div className={tableStyles.avatar}>{getInitials(d.name)}</div></td>
            <td><strong>{d.name}</strong></td>
            <td>{d.specialization}</td>
            <td>{d.phone}</td>
            <td>{d.ward}</td>
            <td><Badge status={d.status} /></td>
            <td>
              <div className={tableStyles.actions}>
                <button className={tableStyles.actionBtn}><EditIcon size={14} /></button>
                <button className={`${tableStyles.actionBtn} ${tableStyles.dangerBtn}`}><TrashIcon size={14} /></button>
              </div>
            </td>
          </tr>
        ))}
      </Table>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Doctor"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button loading={saving} onClick={handleAdd}>Add Doctor</Button></>}>
        <Input label="Full Name" placeholder="Dr. Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <Input label="Email" type="email" placeholder="email@medicore.ke" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
          <Input label="Specialization" placeholder="e.g. Cardiology" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} />
          <Input label="Phone" placeholder="0712 345 678" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        </div>
        <Input label="Ward" options={[{value:'Ward A',label:'Ward A'},{value:'Ward B',label:'Ward B'},{value:'Ward C',label:'Ward C'},{value:'ICU',label:'ICU'}]} value={form.ward} onChange={e => setForm({ ...form, ward: e.target.value })} />
        <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
          <Input label="Username" placeholder="username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
          <Input label="Password" type="password" placeholder="••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        </div>
      </Modal>
    </>
  );
}
