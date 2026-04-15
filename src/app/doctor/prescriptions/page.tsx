'use client';
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { PlusIcon } from '@/components/ui/Icons';
import { prescriptions as initial, patients } from '@/lib/mockData';
import { Prescription } from '@/lib/types';

export default function DoctorPrescriptions() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<Prescription[]>(initial);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ patient: '', medication: '', dosage: '', frequency: '', startDate: '', duration: '', instructions: '' });

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  const handleAdd = () => {
    setSaving(true);
    setTimeout(() => {
      const endDate = form.startDate && form.duration ? (() => { const d = new Date(form.startDate); d.setDate(d.getDate() + parseInt(form.duration || '7')); return d.toISOString().split('T')[0]; })() : '';
      setList([...list, { id: `RX${String(list.length+1).padStart(3,'0')}`, patient: form.patient, doctor: 'Dr. Amina Odhiambo', medication: form.medication, dosage: form.dosage, frequency: form.frequency, startDate: form.startDate, endDate, instructions: form.instructions, status: 'active' }]);
      setSaving(false); setModalOpen(false); setForm({ patient:'', medication:'', dosage:'', frequency:'', startDate:'', duration:'', instructions:'' });
    }, 1000);
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
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Historical & Active Prescriptions</h3>
        <Button onClick={() => setModalOpen(true)} className="h-10">
          <PlusIcon size={16} /> 
          <span className="ml-1">Issue New Medication</span>
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <Table headers={['Patient Identity', 'Medication Detail', 'Dosage', 'Frequency', 'Start Epoch', 'End Epoch', 'Status']}>
          {list.map(rx => (
            <tr key={rx.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 font-medium">
              <td className="px-5 py-3 text-sm text-slate-800 font-bold">{rx.patient}</td>
              <td className="px-5 py-3 text-sm text-slate-800 font-black">{rx.medication}</td>
              <td className="px-5 py-3 text-sm text-slate-600">{rx.dosage}</td>
              <td className="px-5 py-3 text-sm text-slate-500">{rx.frequency}</td>
              <td className="px-5 py-3 text-sm text-slate-400 font-mono">{rx.startDate}</td>
              <td className="px-5 py-3 text-sm text-slate-400 font-mono">{rx.endDate}</td>
              <td className="px-5 py-3 text-sm"><Badge status={rx.status} /></td>
            </tr>
          ))}
        </Table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Issue Clinical Prescription"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Abort</Button><Button loading={saving} onClick={handleAdd}>Confirm Issuance</Button></>}>
        <div className="space-y-4 py-2">
          <Input label="Select Patient" options={patients.filter(p => p.assignedDoctor === 'Dr. Amina Odhiambo').map(p => ({ value: p.name, label: p.name }))} value={form.patient} onChange={e => setForm({...form, patient: e.target.value})} />
          <Input label="Pharmaceutical Compound" placeholder="e.g. Paracetamol" value={form.medication} onChange={e => setForm({...form, medication: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Dosage (mg/ml)" placeholder="e.g. 500mg" value={form.dosage} onChange={e => setForm({...form, dosage: e.target.value})} />
            <Input label="Administratio Frequency" options={[{value:'Once daily',label:'Once daily'},{value:'Twice daily',label:'Twice daily'},{value:'Three times daily',label:'Three times daily'}]} value={form.frequency} onChange={e => setForm({...form, frequency: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Protocol Start" type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} />
            <Input label="Temporal Duration (Days)" placeholder="e.g. 7" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} />
          </div>
          <Input label="Clinical Instructions" isTextarea placeholder="Specific dietary or temporal instructions..." value={form.instructions} onChange={e => setForm({...form, instructions: e.target.value})} />
        </div>
      </Modal>
    </div>
  );
}
