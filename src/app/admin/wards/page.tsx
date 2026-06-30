'use client';
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import PageSkeleton from '@/components/ui/PageSkeleton';
import { PlusIcon, TrashIcon, BedIcon } from '@/components/ui/Icons';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';

export default function AdminWards() {
  const [loading, setLoading] = useState(true);
  const [wards, setWards] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewingWard, setViewingWard] = useState<any>(null);
  const [wardToDelete, setWardToDelete] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editingWard, setEditingWard] = useState<any>(null);
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

  const handleOpenEdit = (ward: any) => {
    setEditingWard(ward);
    setForm({ id: ward.id, name: ward.name, capacity: ward.capacity });
    setModalOpen(true);
  };

  const handleOpenView = (ward: any) => {
    setViewingWard(ward);
    setViewModalOpen(true);
  };

  const handleOpenDelete = (ward: any) => {
    setWardToDelete(ward);
    setDeleteModalOpen(true);
  };

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
        setEditingWard(null);
        setForm({ id: '', name: '', capacity: 20 });
        toast.success(editingWard ? "Ward updated successfully" : "Ward configuration committed to system");
      }
    } catch (error) {
      toast.error("Failed to save ward record");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleting(true);
    try {
      await apiFetch(`/wards?id=${id}`, { method: 'DELETE' });
      await fetchWards();
      setDeleteModalOpen(false);
      setWardToDelete(null);
      toast.success("Ward decommissioned successfully");
    } catch (error) {
      toast.error("Failed to delete ward");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <PageSkeleton variant="list" />;

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
          <div key={w.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-blue-200 transition-all group relative overflow-hidden cursor-pointer" onClick={() => handleOpenView(w)}>
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2" onClick={e => e.stopPropagation()}>
               <button onClick={(e) => { e.stopPropagation(); handleOpenEdit(w); }} className="text-slate-300 hover:text-blue-600 transition-colors p-1 hover:bg-blue-50 rounded" title="Edit Ward">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 6-6m-6 6 2 2m-2-2 4-4 2 2m-4 4 2 2"/></svg>
               </button>
               <button onClick={(e) => { e.stopPropagation(); handleDelete(w.id); }} className="text-slate-300 hover:text-rose-600 transition-colors p-1 hover:bg-rose-50 rounded">
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

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditingWard(null); }} title={editingWard ? "Edit Clinical Ward" : "Register Clinical Ward"}
        footer={<><Button variant="secondary" onClick={() => { setModalOpen(false); setEditingWard(null); }}>Cancel</Button><Button loading={saving} onClick={handleSave}>{editingWard ? "Update Ward" : "Confirm Registration"}</Button></>}>
        <div className="space-y-4 py-2">
          <Input label="Ward Denomination" placeholder="e.g. Ward C or Pediatric Wing" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <Input label="Bed Capacity" type="number" placeholder="20" value={form.capacity} onChange={e => setForm({...form, capacity: parseInt(e.target.value)})} />
        </div>
      </Modal>

      <Modal open={viewModalOpen} onClose={() => setViewModalOpen(false)} title="Ward Details"
        footer={<><Button variant="secondary" onClick={() => setViewModalOpen(false)}>Close</Button><Button onClick={() => { setViewModalOpen(false); handleOpenEdit(viewingWard); }}>Edit Ward</Button></>}>
        {viewingWard && (
          <div className="space-y-4 py-4">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Ward Name</p>
              <p className="text-sm font-bold text-slate-800 mt-1">{viewingWard.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total Beds</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{viewingWard.capacity}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Occupied Beds</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{viewingWard.occupied || 0}</p>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Available Beds</p>
              <p className="text-sm font-bold text-blue-600 mt-1">{viewingWard.available || viewingWard.capacity}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Occupancy Load</p>
              <div className="mt-2 space-y-2">
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${ ((viewingWard.occupied || 0)/(viewingWard.capacity)) > 0.9 ? 'bg-rose-500' : ((viewingWard.occupied || 0)/(viewingWard.capacity)) > 0.7 ? 'bg-amber-500' : 'bg-blue-600' }`}
                    style={{ width: `${((viewingWard.occupied || 0) / viewingWard.capacity) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-slate-600">{Math.round(((viewingWard.occupied || 0)/viewingWard.capacity)*100)}% Full</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
