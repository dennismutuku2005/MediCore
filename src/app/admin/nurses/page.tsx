'use client';
import React, { useState, useEffect } from 'react';
import { tableStyles } from '@/components/ui/Table';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import PageSkeleton from '@/components/ui/PageSkeleton';
import { SearchIcon, EditIcon, TrashIcon, PlusIcon, EyeIcon, EyeOffIcon } from '@/components/ui/Icons';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import Combobox from '@/components/ui/Combobox';

export default function AdminNurses() {
  const [loading, setLoading] = useState(true);
  const [nursesList, setNursesList] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ id: '', name: '', email: '', phone: '', wardId: '', shift: 'Morning', username: '', password: '' });
  const [wards, setWards] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [editingNurse, setEditingNurse] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedNurse, setSelectedNurse] = useState<any>(null);
  const [nurseToDelete, setNurseToDelete] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchNurses = async () => {
    try {
      const [nurseRes, wardRes] = await Promise.all([
        apiFetch('/nurses'),
        apiFetch('/wards')
      ]);
      if (nurseRes.status === 'success') {
        setNursesList(nurseRes.data || []);
      }
      if (wardRes.status === 'success') {
        setWards(wardRes.data || []);
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
    setForm({ id: '', name: '', email: '', phone: '', wardId: '', shift: 'Morning', username: '', password: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (nurse: any) => {
    setEditingNurse(nurse);
    setForm({ 
      id: nurse.id, 
      name: nurse.name, 
      email: nurse.email || '', 
      phone: nurse.phone || '',
      wardId: nurse.ward?.id || '', 
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

  const handleOpenView = (nurse: any) => {
    setSelectedNurse(nurse);
    setViewModalOpen(true);
  };

  const handleOpenDelete = (nurse: any) => {
    setNurseToDelete(nurse);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!nurseToDelete) return;
    setDeleting(true);
    try {
      await apiFetch(`/nurses?id=${nurseToDelete.id}`, { method: 'DELETE' });
      await fetchNurses();
      setDeleteModalOpen(false);
      setNurseToDelete(null);
      toast.success("Nursing record removed from registry");
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
            placeholder="Search nursing staff registry..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
        <Button onClick={handleOpenAdd} className="h-10 text-[11px] font-bold uppercase tracking-wider">
          <PlusIcon size={14} /> 
          <span className="ml-2">Register Nursing Staff</span>
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <Table headers={['Identity', 'Staff Name', 'Ward Allocation', 'Operational Shift', 'Status', 'Matrix Action']}>
          {filtered.map(n => (
            <tr key={n.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 font-medium group">
              <td className="px-5 py-3"><div className={tableStyles.avatar} style={{ background: '#ecfdf5', color: '#059669' }}>{getInitials(n.name)}</div></td>
              <td className="px-5 py-3 text-sm font-bold text-slate-800">{n.name}</td>
              <td className="px-5 py-3 text-sm text-slate-600 font-bold">{n.ward?.name || 'Unassigned'}</td>
              <td className="px-5 py-3 text-sm"><Badge status={n.shift} /></td>
              <td className="px-5 py-3 text-sm"><Badge status={n.status || 'active'} /></td>
              <td className="px-5 py-3 text-sm">
                <div className="flex items-center gap-2 transition-opacity">
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all" title="View Record" onClick={() => handleOpenView(n)}>
                    <EyeIcon size={16} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all" title="Modify Record" onClick={() => handleOpenEdit(n)}>
                    <EditIcon size={16} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all" title="De-register" onClick={() => handleOpenDelete(n)}>
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

      <Modal open={viewModalOpen} onClose={() => { setViewModalOpen(false); setSelectedNurse(null); }} title="Nursing Staff Details"
        footer={<><Button variant="secondary" onClick={() => { setViewModalOpen(false); setSelectedNurse(null); }}>Close</Button><Button onClick={() => { setViewModalOpen(false); handleOpenEdit(selectedNurse); }}>Edit Profile</Button></>}> 
        {selectedNurse && (
          <div className="space-y-4 py-2">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Name</p>
              <p className="text-sm font-bold text-slate-800 mt-1">{selectedNurse.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Email</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{selectedNurse.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Phone</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{selectedNurse.phone || 'N/A'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Ward</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{selectedNurse.ward?.name || 'Unassigned'}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Shift</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{selectedNurse.shift || 'Morning'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={deleteModalOpen} onClose={() => { setDeleteModalOpen(false); setNurseToDelete(null); }} title="Confirm De-registration"
        footer={<><Button variant="secondary" onClick={() => { setDeleteModalOpen(false); setNurseToDelete(null); }}>Cancel</Button><Button loading={deleting} onClick={handleDelete}>Delete Record</Button></>}> 
        <div className="space-y-2 py-2">
          <p className="text-sm text-slate-700">Remove this nursing staff record from the registry?</p>
          <p className="text-sm font-bold text-slate-900">{nurseToDelete?.name}</p>
        </div>
      </Modal>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingNurse ? "Modify Nursing Profile" : "Register Staff Member"}
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button loading={saving} onClick={handleSave}>{editingNurse ? "Update Profile" : "Confirm Registration"}</Button></>}>
        <div className="space-y-4 py-2">
          <Input label="Full Legal Name" placeholder="e.g. Patricia Wanjiku" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Clinical Email" type="email" placeholder="patricia@medicore.ke" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <Input label="Mobile Link" placeholder="+254 700 000 000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Combobox 
              label="Ward Allocation" 
              placeholder="Select Ward..."
              options={[
                { value: '', label: 'Unassigned' },
                ...wards.map(w => ({ value: w.id, label: w.name, sublabel: `${w.occupied}/${w.totalBeds || w.capacity} Beds` }))
              ]} 
              value={form.wardId} 
              onChange={val => setForm({ ...form, wardId: val })} 
            />
            <Input label="Operational Shift" options={[{value:'Morning',label:'Morning'},{value:'Evening',label:'Evening'},{value:'Night',label:'Night'}]} value={form.shift} onChange={e => setForm({ ...form, shift: e.target.value })} />
          </div>
          <div className="pt-4 border-t border-slate-50">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">System Authentication</h4>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Identifier (Username)" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
              <Input 
                label="Security Key (Password)" 
                type={showPassword ? "text" : "password"} 
                value={form.password} 
                onChange={e => setForm({ ...form, password: e.target.value })} 
                placeholder={editingNurse ? "Leave blank to preserve" : "Enter temporary key"} 
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
        </div>
      </Modal>
    </div>
  );
}
