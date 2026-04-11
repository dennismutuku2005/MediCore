'use client';
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { PlusIcon } from '@/components/ui/Icons';
import { appointments as initialAppts, doctors, patients } from '@/lib/mockData';
import { Appointment } from '@/lib/types';

export default function AdminAppointments() {
  const [loading, setLoading] = useState(true);
  const [appts, setAppts] = useState<Appointment[]>(initialAppts);
  const [view, setView] = useState<'week' | 'list'>('list');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ patient: '', doctor: '', date: '', time: '', reason: '' });

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  const handleAdd = () => {
    setSaving(true);
    setTimeout(() => {
      setAppts([...appts, { id: `A${String(appts.length+1).padStart(3,'0')}`, patient: form.patient, doctor: form.doctor, date: form.date, time: form.time, reason: form.reason, department: '', status: 'pending' }]);
      setSaving(false); setModalOpen(false); setForm({ patient:'', doctor:'', date:'', time:'', reason:'' });
    }, 1000);
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekDates = ['2025-04-12', '2025-04-13', '2025-04-14', '2025-04-15', '2025-04-16', '2025-04-17', '2025-04-18'];

  if (loading) return <><SkeletonLoader height={40} style={{ marginBottom: 20 }} /><SkeletonLoader height={52} count={6} /></>;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="relative">
          <button className={`text-sm text-blue-600 font-bold hover:text-blue-800 transition-colors cursor-pointer ${view === 'week' ? styles.toggleBtnActive : ''}`} onClick={() => setView('week')}>Week View</button>
          <button className={`text-sm text-blue-600 font-bold hover:text-blue-800 transition-colors cursor-pointer ${view === 'list' ? styles.toggleBtnActive : ''}`} onClick={() => setView('list')}>List View</button>
        </div>
        <Button onClick={() => setModalOpen(true)}><PlusIcon size={16} /> Schedule Appointment</Button>
      </div>

      {view === 'week' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {days.map((day, i) => (
            <div key={day} className="relative">
              <div className="text-sm font-bold text-slate-800 uppercase tracking-tight mb-2">{day}<br /><small>{weekDates[i]}</small></div>
              {appts.filter(a => a.date === weekDates[i]).map(a => (
                <div key={a.id} className={`relative ${styles[`appointmentBlock${a.status.charAt(0).toUpperCase() + a.status.slice(1)}` as keyof typeof styles] || styles.appointmentBlockPending}`}>
                  <div className="relative">{a.time}</div>
                  <div className="relative">{a.patient}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.doctor}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <Table headers={['Patient', 'Doctor', 'Date', 'Time', 'Reason', 'Status']}>
          {appts.map(a => (
            <tr key={a.id}><td>{a.patient}</td><td>{a.doctor}</td><td>{a.date}</td><td>{a.time}</td><td>{a.reason}</td><td><Badge status={a.status} /></td></tr>
          ))}
        </Table>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Schedule Appointment"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button loading={saving} onClick={handleAdd}>Schedule</Button></>}>
        <Input label="Patient" options={patients.map(p => ({ value: p.name, label: p.name }))} value={form.patient} onChange={e => setForm({...form, patient: e.target.value})} />
        <Input label="Doctor" options={doctors.map(d => ({ value: d.name, label: d.name }))} value={form.doctor} onChange={e => setForm({...form, doctor: e.target.value})} />
        <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
          <Input label="Date" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
          <Input label="Time" type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
        </div>
        <Input label="Reason" isTextarea placeholder="Reason for appointment..." value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} />
      </Modal>
    </>
  );
}
