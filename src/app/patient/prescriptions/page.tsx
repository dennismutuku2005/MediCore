'use client';
import React, { useState, useEffect } from 'react';
import Badge from '@/components/ui/Badge';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { prescriptions } from '@/lib/mockData';

export default function PatientPrescriptions() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  const myMeds = prescriptions.filter(p => p.patient === 'Brian Mwangi');

  if (loading) return <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">{[1,2,3].map(i => <SkeletonLoader key={i} height={140} />)}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {myMeds.map(rx => (
        <div key={rx.id} className={`bg-white border border-slate-200 rounded-lg p-5 shadow-sm mb-4 ${rx.status === 'active' ? styles.prescActive : styles.prescInactive}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="relative">{rx.medication}</div>
            <Badge status={rx.status} />
          </div>
          <div className="text-sm text-slate-600 leading-relaxed"><strong>Dosage:</strong> {rx.dosage}</div>
          <div className="text-sm text-slate-600 leading-relaxed"><strong>Frequency:</strong> {rx.frequency}</div>
          <div className="text-sm text-slate-600 leading-relaxed"><strong>Instructions:</strong> {rx.instructions}</div>
          <div className="text-sm text-slate-600 leading-relaxed" style={{ marginTop: 12, borderTop: '1px solid var(--border)', paddingTop: 8 }}>
            Prescribed by {rx.doctor} on {rx.startDate}
          </div>
        </div>
      ))}
    </div>
  );
}
