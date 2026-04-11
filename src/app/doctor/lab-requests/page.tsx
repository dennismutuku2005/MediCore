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

  if (loading) return <><SkeletonLoader height={40} style={{ marginBottom: 20 }} /><SkeletonLoader height={52} count={5} /></>;

  return (
    <>
      <div className="flex items-center justify-between mb-6"><div /><Button onClick={() => setModalOpen(true)}><PlusIcon size={16} /> Request Lab Test</Button></div>
      <Table headers={['Patient', 'Test Type', 'Urgency', 'Date', 'Status', 'Result']}>
        {list.map(t => (
          <tr key={t.id}><td>{t.patient}</td><td><strong>{t.testType}</strong></td><td><Badge status={t.urgency} /></td><td>{t.dateRequested}</td><td><Badge status={t.status} /></td><td>{t.result || '—'}</td></tr>
        ))}
      </Table>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Request Lab Test"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button loading={saving} onClick={handleAdd}>Request</Button></>}>
        <Input label="Patient" options={patients.map(p => ({ value: p.name, label: p.name }))} value={form.patient} onChange={e => setForm({...form, patient: e.target.value})} />
        <Input label="Test Type" options={[{value:'CBC',label:'CBC'},{value:'Malaria RDT',label:'Malaria RDT'},{value:'Blood Glucose',label:'Blood Glucose'},{value:'Urinalysis',label:'Urinalysis'},{value:'Chest X-Ray',label:'Chest X-Ray'}]} value={form.testType} onChange={e => setForm({...form, testType: e.target.value})} />
        <Input label="Urgency" options={[{value:'STAT',label:'STAT'},{value:'Routine',label:'Routine'}]} value={form.urgency} onChange={e => setForm({...form, urgency: e.target.value})} />
        <Input label="Notes" isTextarea placeholder="Additional notes..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
      </Modal>
    </>
  );
}
