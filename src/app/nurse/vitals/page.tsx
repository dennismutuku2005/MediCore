'use client';
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import LineChart from '@/components/charts/LineChart';
import Toast from '@/components/ui/Toast';
import { patients, vitals, vitalsHistory } from '@/lib/mockData';

export default function NurseVitals() {
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  const wardPatients = patients.filter(p => p.ward === 'Ward A');

  const handleRecord = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setModalOpen(false); setToast('Vitals recorded successfully'); }, 1000);
  };

  if (loading) return <><SkeletonLoader height={52} count={6} /><SkeletonLoader height={220} style={{ marginTop: 24 }} /></>;

  return (
    <>
      <Table headers={['Name', 'Room', 'BP', 'HR', 'Temp', 'Last Updated', 'Action']}>
        {wardPatients.map(p => {
          const v = vitals.find(vt => vt.patientId === p.id);
          return (
            <tr key={p.id}>
              <td><strong>{p.name}</strong></td><td>{p.ward}</td>
              <td>{v?.bp || '—'}</td><td>{v?.hr || '—'}</td><td>{v ? `${v.temp}°C` : '—'}</td>
              <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{v?.timestamp || '—'}</td>
              <td>
                <Button variant="secondary" style={{ padding: '6px 12px', fontSize: 12 }}
                  onClick={() => { setSelectedPatient(p.id); setModalOpen(true); }}>Record Vitals</Button>
              </td>
            </tr>
          );
        })}
      </Table>

      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm mb-4" style={{ marginTop: 24 }}>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight mb-2">Heart Rate Trend — Brian Mwangi (7 days)</h3>
        <LineChart data={vitalsHistory} color="var(--danger)" />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Record Vitals"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button loading={saving} onClick={handleRecord}>Save Vitals</Button></>}>
        <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
          <Input label="BP Systolic" placeholder="120" />
          <Input label="BP Diastolic" placeholder="80" />
        </div>
        <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
          <Input label="Heart Rate (bpm)" placeholder="72" />
          <Input label="Temperature (°C)" placeholder="36.8" />
        </div>
        <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
          <Input label="SpO2 (%)" placeholder="98" />
          <Input label="Respiratory Rate" placeholder="16" />
        </div>
        <Input label="Weight (kg)" placeholder="70" />
        <Input label="Timestamp" value={new Date().toLocaleString()} readOnly />
      </Modal>

      {toast && <Toast message={toast} onDone={() => setToast('')} />}
    </>
  );
}
