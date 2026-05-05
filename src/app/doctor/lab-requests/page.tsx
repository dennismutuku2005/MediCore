'use client';
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { apiFetch } from '@/lib/api';
import authService from '@/lib/auth';
import { PlusIcon } from '@/components/ui/Icons';
import { toast } from 'sonner';

export default function DoctorLabRequests() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ patientId: '', testType: '', urgency: 'Routine', notes: '' });
  const user = authService.getUser();

  const fetchData = async () => {
    try {
      const docId = user?.id || '';
      const [labRes, patRes] = await Promise.all([
        apiFetch(`/doctor/lab-requests?doctorId=${docId}`),
        apiFetch(`/doctor/patients?doctorId=${docId}`)
      ]);

      if (labRes.status === 'success') setList(labRes.data || []);
      if (patRes.status === 'success') setPatients(patRes.data || []);
    } catch (error) {
      console.error("Failed to fetch lab request data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const handleAdd = async () => {
    if (!form.patientId || !form.testType) return;
    setSaving(true);
    try {
      const payload = {
        patient: { id: form.patientId },
        doctor: { id: user?.id },
        testType: form.testType,
        urgency: form.urgency,
        notes: form.notes,
        status: 'pending'
      };

      const res = await apiFetch('/doctor/lab-requests', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res.status === 'success') {
        await fetchData();
        setModalOpen(false);
        setForm({ patientId: '', testType: '', urgency: 'Routine', notes: '' });
      }
    } catch (error) {
      toast.error("Failed to initiate diagnostic request.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="space-y-6">
      <div className="flex justify-end"><SkeletonLoader width={180} height={40} /></div>
      <div className="bg-white border border-slate-200 rounded p-6 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <SkeletonLoader width={220} height={20} />
          <SkeletonLoader width={80} height={20} />
        </div>
        <div className="space-y-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="flex items-center gap-6 py-4 border-b border-slate-50 last:border-0">
               <div className="flex-1 space-y-2">
                 <SkeletonLoader width="50%" height={16} />
                 <SkeletonLoader width="25%" height={12} />
               </div>
               <SkeletonLoader width="10%" height={24} />
               <SkeletonLoader width="15%" height={12} />
               <SkeletonLoader width="10%" height={24} />
               <SkeletonLoader width="20%" height={16} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-black text-slate-900 tracking-tight">Diagnostic Analysis Queue</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time tracking of clinical investigations</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="h-10 text-[11px] font-black uppercase tracking-widest">
          <PlusIcon size={14} /> 
          <span className="ml-2">Initiate Lab Request</span>
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <Table headers={['Patient Identity', 'Diagnostic Protocol', 'Priority', 'Timestamp', 'Status', 'Laboratory Finding']}>
          {list.map(t => (
            <tr key={t.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 font-medium group">
              <td className="px-5 py-3 text-sm text-slate-800 font-bold">{t.patientName || t.patient}</td>
              <td className="px-5 py-3 text-sm text-blue-600 font-black tracking-tight">{t.testType}</td>
              <td className="px-5 py-3 text-sm"><Badge status={t.urgency} /></td>
              <td className="px-5 py-3 text-sm text-slate-400 font-mono italic">{t.dateRequested}</td>
              <td className="px-5 py-3 text-sm"><Badge status={t.status} /></td>
              <td className="px-5 py-3 text-sm text-slate-800 font-black italic">{t.result || 'Analysis in progress...'}</td>
            </tr>
          ))}
        </Table>
        {list.length === 0 && (
          <div className="p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            No diagnostic orders identified for your clinical ID
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Initialize Diagnostic Request"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Abort interface</Button><Button loading={saving} onClick={handleAdd}>Confirm Request</Button></>}>
        <div className="space-y-4 py-2">
          <Input label="Target Patient Identity" options={patients.map(p => ({ value: p.id, label: p.name }))} value={form.patientId} onChange={e => setForm({...form, patientId: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Diagnostic Protocol" options={[
              {value:'CBC',label:'Full Blood Count (CBC)'},
              {value:'Malaria RDT',label:'Malaria RDT'},
              {value:'Blood Glucose',label:'Blood Glucose (FBG)'},
              {value:'Urinalysis',label:'Urinalysis'},
              {value:'Chest X-Ray',label:'Radiology (Chest X-Ray)'}
            ]} value={form.testType} onChange={e => setForm({...form, testType: e.target.value})} />
            <Input label="Clinical Urgency" options={[{value:'STAT',label:'High Priority (STAT)'},{value:'Routine',label:'Routine Diagnostic'}]} value={form.urgency} onChange={e => setForm({...form, urgency: e.target.value})} />
          </div>
          <Input label="Clinical Justification" isTextarea placeholder="Specific symptoms or findings justifying the request..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
        </div>
      </Modal>
    </div>
  );
}
