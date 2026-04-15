'use client';
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { PlusIcon } from '@/components/ui/Icons';
import { labTests as initial, patients } from '@/lib/mockData';
import { LabTest } from '@/lib/types';

export default function DoctorLabRequests() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<LabTest[]>(initial);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ patient: '', testType: '', urgency: '', notes: '' });

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  const handleAdd = () => {
    setSaving(true);
    setTimeout(() => {
      setList([...list, { id: `T${String(list.length+1).padStart(3,'0')}`, patient: form.patient, doctor: 'Dr. Amina Odhiambo', testType: form.testType, urgency: form.urgency as 'STAT'|'Routine', dateRequested: new Date().toISOString().split('T')[0], status: 'pending', result: null, notes: form.notes }]);
      setSaving(false); setModalOpen(false); setForm({ patient:'', testType:'', urgency:'', notes:'' });
    }, 1000);
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
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Diagnostic Orders & Laboratory Tracking</h3>
        <Button onClick={() => setModalOpen(true)} className="h-10">
          <PlusIcon size={16} /> 
          <span className="ml-1">Initiate Lab Request</span>
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <Table headers={['Patient Identity', 'Diagnostic Protocol', 'Priority', 'Timestamp', 'Status', 'Laboratory Finding']}>
          {list.map(t => (
            <tr key={t.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 font-medium">
              <td className="px-5 py-3 text-sm text-slate-800 font-bold">{t.patient}</td>
              <td className="px-5 py-3 text-sm text-slate-800 font-black">{t.testType}</td>
              <td className="px-5 py-3 text-sm"><Badge status={t.urgency} /></td>
              <td className="px-5 py-3 text-sm text-slate-400 font-mono">{t.dateRequested}</td>
              <td className="px-5 py-3 text-sm"><Badge status={t.status} /></td>
              <td className="px-5 py-3 text-sm text-slate-600 italic font-semibold">{t.result || 'Pending Result...'}</td>
            </tr>
          ))}
        </Table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Initialize Diagnostic Request"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Abort</Button><Button loading={saving} onClick={handleAdd}>Confirm Request</Button></>}>
        <div className="space-y-4 py-2">
          <Input label="Select Patient" options={patients.map(p => ({ value: p.name, label: p.name }))} value={form.patient} onChange={e => setForm({...form, patient: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Diagnostic Test Type" options={[{value:'CBC',label:'CBC'},{value:'Malaria RDT',label:'Malaria RDT'},{value:'Blood Glucose',label:'Blood Glucose'},{value:'Urinalysis',label:'Urinalysis'},{value:'Chest X-Ray',label:'Chest X-Ray'}]} value={form.testType} onChange={e => setForm({...form, testType: e.target.value})} />
            <Input label="Clinical Priority" options={[{value:'STAT',label:'High Urgency (STAT)'},{value:'Routine',label:'Routine Diagnostic'}]} value={form.urgency} onChange={e => setForm({...form, urgency: e.target.value})} />
          </div>
          <Input label="Diagnostic Justification/Notes" isTextarea placeholder="Specific findings or reason for request..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
        </div>
      </Modal>
    </div>
  );
}
