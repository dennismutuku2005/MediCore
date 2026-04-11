'use client';
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import Toast from '@/components/ui/Toast';
import { medicationAdmin as initial } from '@/lib/mockData';
import { MedicationAdmin } from '@/lib/types';

export default function NurseMedications() {
  const [loading, setLoading] = useState(true);
  const [meds, setMeds] = useState<MedicationAdmin[]>(initial);
  const [toast, setToast] = useState('');

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  const markAdmin = (id: string) => {
    setMeds(prev => prev.map(m => m.id === id ? { ...m, administered: true, administeredAt: new Date().toLocaleString(), administeredBy: 'Patricia Wanjiku' } : m));
    setToast('Medication marked as administered');
  };

  if (loading) return <SkeletonLoader height={52} count={8} />;

  return (
    <>
      <Table headers={['Patient', 'Medication', 'Dose', 'Time Due', 'Administered', 'Administered At', 'Notes']}>
        {meds.map(m => (
          <tr key={m.id}>
            <td>{m.patient}</td><td><strong>{m.medication}</strong></td><td>{m.dose}</td><td>{m.timeDue}</td>
            <td>{m.administered ? <span style={{ color: 'var(--success)', fontWeight: 600 }}>✓ Yes</span> :
              <Button variant="secondary" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => markAdmin(m.id)}>Mark</Button>
            }</td>
            <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.administeredAt || '—'}</td>
            <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.notes || '—'}</td>
          </tr>
        ))}
      </Table>
      {toast && <Toast message={toast} onDone={() => setToast('')} />}
    </>
  );
}
