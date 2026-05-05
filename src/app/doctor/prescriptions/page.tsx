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

export default function DoctorPrescriptions() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ patientId: '', medication: '', dosage: '', frequency: '', startDate: '', duration: '', instructions: '' });
  const user = authService.getUser();

  const fetchData = async () => {
    try {
      const docId = user?.id || '';
      const [prescRes, patRes] = await Promise.all([
        apiFetch(`/doctor/prescriptions?doctorId=${docId}`),
        apiFetch(`/doctor/patients?doctorId=${docId}`)
      ]);

      if (prescRes.status === 'success') setList(prescRes.data || []);
      if (patRes.status === 'success') setPatients(patRes.data || []);
    } catch (error) {
      console.error("Failed to fetch prescription data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const handleAdd = async () => {
    if (!form.patientId || !form.medication) return;
    setSaving(true);
    try {
      const payload = {
        patient: { id: form.patientId },
        doctor: { id: user?.id },
        medication: form.medication,
        dosage: form.dosage,
        frequency: form.frequency,
        startDate: form.startDate,
        instructions: form.instructions,
        status: 'active'
      };

      const res = await apiFetch('/doctor/prescriptions', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res.status === 'success') {
        await fetchData();
        setModalOpen(false);
        setForm({ patientId: '', medication: '', dosage: '', frequency: '', startDate: '', duration: '', instructions: '' });
      }
    } catch (error) {
      toast.error("Failed to issue clinical prescription.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="space-y-6">
      <div className="flex justify-end"><SkeletonLoader width={180} height={40} /></div>
      <div className="bg-white border border-slate-200 rounded p-6 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <SkeletonLoader width={150} height={20} />
          <SkeletonLoader width={80} height={20} />
        </div>
        <div className="space-y-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="flex items-center gap-6 py-4 border-b border-slate-50 last:border-0">
               <div className="flex-1 space-y-2">
                 <SkeletonLoader width="60%" height={16} />
                 <SkeletonLoader width="30%" height={12} />
               </div>
               <SkeletonLoader width="15%" height={14} />
               <SkeletonLoader width="15%" height={14} />
               <SkeletonLoader width={70} height={24} />
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
          <h3 className="text-base font-black text-slate-900 tracking-tight">Pharmaceutical Registry</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Audit of active and historical prescriptions</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="h-10 text-[11px] font-black uppercase tracking-widest">
          <PlusIcon size={14} /> 
          <span className="ml-2">Issue New Medication</span>
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <Table headers={['Patient Identity', 'Medication Protocol', 'Dosage', 'Frequency', 'Start Epoch', 'Status']}>
          {list.map(rx => (
            <tr key={rx.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 font-medium group">
              <td className="px-5 py-3 text-sm text-slate-800 font-bold">{rx.patientName || rx.patient}</td>
              <td className="px-5 py-3 text-sm text-blue-600 font-black tracking-tight">{rx.medication}</td>
              <td className="px-5 py-3 text-sm text-slate-600">{rx.dosage}</td>
              <td className="px-5 py-3 text-sm text-slate-500">{rx.frequency}</td>
              <td className="px-5 py-3 text-sm text-slate-400 font-mono italic">{rx.startDate}</td>
              <td className="px-5 py-3 text-sm"><Badge status={rx.status} /></td>
            </tr>
          ))}
        </Table>
        {list.length === 0 && (
          <div className="p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            No pharmaceutical protocols issued by your clinical ID
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Issue Clinical Prescription"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Abort interface</Button><Button loading={saving} onClick={handleAdd}>Confirm Protocol</Button></>}>
        <div className="space-y-4 py-2">
          <Input label="Target Patient Identity" options={patients.map(p => ({ value: p.id, label: p.name }))} value={form.patientId} onChange={e => setForm({...form, patientId: e.target.value})} />
          <Input label="Pharmaceutical Compound" placeholder="e.g. Amoxicillin 500mg" value={form.medication} onChange={e => setForm({...form, medication: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Dosage Quantity" placeholder="e.g. 1 Tablet" value={form.dosage} onChange={e => setForm({...form, dosage: e.target.value})} />
            <Input label="Temporal Frequency" options={[
              {value:'Once daily',label:'Once daily'},
              {value:'Twice daily (BD)',label:'Twice daily (BD)'},
              {value:'Three times daily (TDS)',label:'Three times daily (TDS)'},
              {value:'Four times daily (QDS)',label:'Four times daily (QDS)'},
              {value:'When required (PRN)',label:'When required (PRN)'}
            ]} value={form.frequency} onChange={e => setForm({...form, frequency: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} />
            <Input label="Duration (Days)" placeholder="e.g. 7" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} />
          </div>
          <Input label="Provider Instructions" isTextarea placeholder="Clinical guidance for the patient..." value={form.instructions} onChange={e => setForm({...form, instructions: e.target.value})} />
        </div>
      </Modal>
    </div>
  );
}
