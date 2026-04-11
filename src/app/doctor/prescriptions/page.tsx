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

  if (loading) return <><SkeletonLoader height={40} style={{ marginBottom: 20 }} /><SkeletonLoader height={52} count={5} /></>;

  return (
    <>
      <div className="flex items-center justify-between mb-6"><div /><Button onClick={() => setModalOpen(true)}><PlusIcon size={16} /> Issue Prescription</Button></div>
      <Table headers={['Patient', 'Medication', 'Dosage', 'Frequency', 'Start', 'End', 'Status']}>
        {list.map(rx => (
          <tr key={rx.id}><td>{rx.patient}</td><td><strong>{rx.medication}</strong></td><td>{rx.dosage}</td><td>{rx.frequency}</td><td>{rx.startDate}</td><td>{rx.endDate}</td><td><Badge status={rx.status} /></td></tr>
        ))}
      </Table>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Issue Prescription"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button loading={saving} onClick={handleAdd}>Issue</Button></>}>
        <Input label="Patient" options={patients.filter(p => p.assignedDoctor === 'Dr. Amina Odhiambo').map(p => ({ value: p.name, label: p.name }))} value={form.patient} onChange={e => setForm({...form, patient: e.target.value})} />
        <Input label="Medication" placeholder="e.g. Amlodipine" value={form.medication} onChange={e => setForm({...form, medication: e.target.value})} />
        <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
          <Input label="Dosage" placeholder="e.g. 5mg" value={form.dosage} onChange={e => setForm({...form, dosage: e.target.value})} />
          <Input label="Frequency" options={[{value:'Once daily',label:'Once daily'},{value:'Twice daily',label:'Twice daily'},{value:'Three times daily',label:'Three times daily'}]} value={form.frequency} onChange={e => setForm({...form, frequency: e.target.value})} />
        </div>
        <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
          <Input label="Start Date" type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} />
          <Input label="Duration (days)" placeholder="e.g. 14" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} />
        </div>
        <Input label="Instructions" isTextarea placeholder="Take with food..." value={form.instructions} onChange={e => setForm({...form, instructions: e.target.value})} />
      </Modal>
    </>
  );
}
