'use client';
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { PlusIcon, TrashIcon, BedIcon } from '@/components/ui/Icons';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';

export default function AdminWards() {
  const [loading, setLoading] = useState(true);
  const [wards, setWards] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ id: '', name: '', capacity: 20 });

  const fetchWards = async () => {
    try {
      const res = await apiFetch('/wards');
      if (res.status === 'success') {
        setWards(res.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch wards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWards();
  }, []);

  const handleSave = async () => {
    if (!form.name) return;
    setSaving(true);
    try {
      const res = await apiFetch('/wards', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      if (res.status === 'success') {
        await fetchWards();
        setModalOpen(false);
        setForm({ id: '', name: '', capacity: 20 });
        toast.success("Ward configuration committed to system");
      }
    } catch (error) {
      toast.error("Failed to save ward record");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to decommission this ward?')) {
      try {
        await apiFetch(`/wards?id=${id}`, { method: 'DELETE' });
        await fetchWards();
        toast.success("Ward decommissioned successfully");
      } catch (error) {
        toast.error("Failed to delete ward");
      }
    }
  };

  if (loading) return (
    <div className="space-y-6">
      <div className="flex justify-between"><SkeletonLoader width={200} height={40} /><SkeletonLoader width={150} height={40} /></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1,2,3].map(i => <SkeletonLoader key={i} height={200} className="rounded-xl" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Ward Infrastructure Matrix</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Institutional capacity and bed management</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="h-10 text-[11px] font-black uppercase tracking-widest">
          <PlusIcon size={14} /> 
          <span className="ml-2">Provision New Ward</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wards.map(w => (
          <div key={w.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-blue-200 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => handleDelete(w.id)} className="text-slate-300 hover:text-rose-600 transition-colors">
                  <TrashIcon size={16} />
               </button>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                <BedIcon size={24} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{w.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Facility ID: #{w.id}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-widest">Occupancy Load</span>
                <span className="text-slate-800 font-black">{w.occupied} / {w.totalBeds} Beds</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${ (w.occupied/w.totalBeds) > 0.9 ? 'bg-rose-500' : (w.occupied/w.totalBeds) > 0.7 ? 'bg-amber-500' : 'bg-blue-600' }`}
                  style={{ width: `${(w.occupied / w.totalBeds) * 100}%` }}
                />
              </div>
              <div className="flex justify-between items-center pt-2">
                <Badge status={w.available > 0 ? 'active' : 'critical'}>
                  {w.available > 0 ? `${w.available} VACANT` : 'FULL CAPACITY'}
                </Badge>
                <div className="text-[9px] font-bold text-slate-400 uppercase">Load: {Math.round((w.occupied/w.totalBeds)*100)}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Register Clinical Ward"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button loading={saving} onClick={handleSave}>Confirm Registration</Button></>}>
        <div className="space-y-4 py-2">
          <Input label="Ward Denomination" placeholder="e.g. Ward C or Pediatric Wing" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <Input label="Bed Capacity" type="number" placeholder="20" value={form.capacity} onChange={e => setForm({...form, capacity: parseInt(e.target.value)})} />
        </div>
      </Modal>
    </div>
  );
}
