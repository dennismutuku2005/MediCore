'use client';
import React, { useState, useEffect } from 'react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { appointments as initial } from '@/lib/mockData';
import { PlusIcon } from '@/components/ui/Icons';

export default function PatientAppointments() {
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  const myAppts = initial.filter(a => a.patient === 'Brian Mwangi');

  if (loading) return <SkeletonLoader height={100} count={3} />;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div />
        <Button onClick={() => setModalOpen(true)}><PlusIcon size={16} /> Request Appointment</Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {myAppts.map(a => (
          <div key={a.id} className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm mb-4">
            <div className="text-sm text-slate-600 leading-relaxed">
              <div className="relative">{a.doctor}</div>
              <div className="text-sm text-slate-600 leading-relaxed">{a.department} • {a.reason}</div>
              <div className="text-sm text-slate-600 leading-relaxed" style={{ marginTop: 4, fontWeight: 500 }}>{a.date} at {a.time}</div>
            </div>
            <div className="text-sm text-blue-600 font-bold hover:text-blue-800 transition-colors cursor-pointer">
              <Badge status={a.status} />
              {a.status === 'confirmed' && <Button variant="secondary" style={{ padding: '6px 12px', fontSize: 12, color: 'var(--danger)' }}>Cancel</Button>}
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Request Appointment"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={() => setModalOpen(false)}>Send Request</Button></>}>
        <Input label="Department" options={[{value:'Internal Medicine',label:'Internal Medicine'},{value:'Pediatrics',label:'Pediatrics'},{value:'Surgery',label:'Surgery'}]} />
        <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
          <Input label="Preferred Date" type="date" />
          <Input label="Preferred Time" type="time" />
        </div>
        <Input label="Reason" isTextarea placeholder="Explain your concern..." />
      </Modal>
    </>
  );
}
