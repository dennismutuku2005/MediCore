'use client';
import React, { useState, useEffect } from 'react';
import { tableStyles } from '@/components/ui/Table';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { apiFetch } from '@/lib/api';
import { SearchIcon, EditIcon, TrashIcon, PlusIcon, EyeIcon, EyeOffIcon } from '@/components/ui/Icons';
import { toast } from 'sonner';
import Combobox from '@/components/ui/Combobox';

export default function AdminDoctors() {
  const [loading, setLoading] = useState(true);
  const [doctorsList, setDoctorsList] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ 
    id: '', 
    name: '', 
    email: '', 
    specialization: '', 
    phone: '', 
    wardId: '', 
    username: '', 
    password: '' 
  });
  const [editingDoc, setEditingDoc] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [wards, setWards] = useState<any[]>([]);

  const fetchDoctors = async () => {
    try {
      const [docRes, wardRes] = await Promise.all([
        apiFetch('/doctors'),
        apiFetch('/wards')
      ]);
      if (docRes.status === 'success') {
        setDoctorsList(docRes.data || []);
      }
      if (wardRes.status === 'success') {
        setWards(wardRes.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filtered = doctorsList.filter(d => (d.name || '').toLowerCase().includes(search.toLowerCase()));

  const handleOpenAdd = () => {
    setEditingDoc(null);
    setForm({ id: '', name: '', email: '', specialization: 'General', phone: '', wardId: '', username: '', password: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (doc: any) => {
    setEditingDoc(doc);
    setForm({ 
      id: doc.id,
      name: doc.name, 
      email: doc.email || '', 
      specialization: doc.specialization || 'General', 
      phone: doc.phone || '', 
      wardId: doc.ward?.id || '', 
      username: doc.username || '', 
      password: '' 
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await apiFetch('/doctors', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      if (res.status === 'success') {
        await fetchDoctors();
        setModalOpen(false);
        toast.success(editingDoc ? "Professional record updated successfully" : "New clinician added to medical staff");
      }
    } catch (error) {
      toast.error("Failed to save professional record.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to remove this medical professional? This action cannot be undone.')) {
      try {
        await apiFetch(`/doctors?id=${id}`, { method: 'DELETE' });
        setDoctorsList(prev => prev.filter(d => d.id !== id));
        toast.success("Medical professional removed from staff registry");
      } catch (error) {
        toast.error("Failed to delete record.");
      }
    }
  };

  const getInitials = (n: string) => (n || 'U').split(' ').map(w => w[0]).join('').slice(0, 2);

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
            placeholder="Search medical staff by name..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
        <Button onClick={handleOpenAdd} className="h-10">
          <PlusIcon size={16} /> 
          <span className="ml-1">Add Medical Professional</span>
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <Table headers={['', 'Practitioner Name', 'Specialization', 'Phone Contact', 'Assigned Ward', 'Status', 'Actions']}>
          {filtered.map(d => (
            <tr key={d.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 font-medium">
              <td className="px-5 py-3"><div className={tableStyles.avatar}>{getInitials(d.name)}</div></td>
              <td className="px-5 py-3 text-sm font-bold text-slate-800">{d.name}</td>
              <td className="px-5 py-3 text-sm text-blue-600 font-bold">{d.specialization}</td>
              <td className="px-5 py-3 text-sm text-slate-600">{d.phone || 'N/A'}</td>
              <td className="px-5 py-3 text-sm text-slate-500">{d.ward?.name || 'Unassigned'}</td>
              <td className="px-5 py-3 text-sm"><Badge status={d.status || 'active'} /></td>
              <td className="px-5 py-3 text-sm">
                <div className="flex items-center gap-2">
                  <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit Professional" onClick={() => handleOpenEdit(d)}>
                    <EditIcon size={14} />
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors" title="Remove Record" onClick={() => handleDelete(d.id)}>
                    <TrashIcon size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
        {filtered.length === 0 && (
          <div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
            No doctors found matching "{search}"
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingDoc ? "Edit Clinician Profile" : "Add New Clinician"}
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button loading={saving} onClick={handleSave}>{editingDoc ? "Update Records" : "Save Professional"}</Button></>}>
        <div className="space-y-4 py-2">
          <Input label="Full Medical Name" placeholder="e.g. Dr. Jane Smith" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input label="Professional Email" type="email" placeholder="jane.smith@medicore.ke" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Department/Specialty" placeholder="e.g. Pediatrics" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} />
            <Input label="Mobile Contact" placeholder="+254..." value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <Combobox 
            label="Primary Ward Allocation" 
            placeholder="Select Ward..."
            options={[
              { value: '', label: 'Unassigned / OPD' },
              ...wards.map(w => ({ value: w.id, label: w.name, sublabel: `${w.occupied}/${w.totalBeds || w.capacity} Beds` }))
            ]} 
            value={form.wardId} 
            onChange={val => setForm({ ...form, wardId: val })} 
          />
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50">
            <Input label="System Username" placeholder="e.g. jsmith_doc" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
            <Input 
              label="Temporary Password" 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••" 
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
        </div>
      </Modal>
    </div>
  );
}
