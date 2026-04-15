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

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <SkeletonLoader height={40} style={{ marginBottom: 20 }} />
      <div className="bg-white border border-slate-200 rounded p-5 space-y-3 shadow-sm">
        <SkeletonLoader height={24} width={200} />
        <SkeletonLoader variant="row" count={6} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex bg-slate-100 p-1 rounded border border-slate-200">
          <button 
            className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${view === 'week' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`} 
            onClick={() => setView('week')}
          >
            Week View
          </button>
          <button 
            className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${view === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`} 
            onClick={() => setView('list')}
          >
            List View
          </button>
        </div>
        <Button onClick={() => setModalOpen(true)}><PlusIcon size={16} /> Schedule Appointment</Button>
      </div>

      {view === 'week' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {days.map((day, i) => (
            <div key={day} className="space-y-3">
              <div className="text-sm font-bold text-slate-800 uppercase tracking-tight mb-2">{day}<br /><small className="text-slate-400 font-normal">{weekDates[i]}</small></div>
              <div className="space-y-2">
                {appts.filter(a => a.date === weekDates[i]).map(a => (
                  <div key={a.id} className={`p-3 rounded border shadow-sm ${
                    a.status === 'confirmed' ? 'bg-emerald-50 border-emerald-100' : 
                    a.status === 'cancelled' ? 'bg-rose-50 border-rose-100' : 
                    'bg-white border-slate-200'
                  }`}>
                    <div className="text-[11px] font-bold text-slate-400 mb-1">{a.time}</div>
                    <div className="text-sm font-bold text-slate-800 leading-tight">{a.patient}</div>
                    <div className="text-[10px] text-slate-500 mt-1">{a.doctor}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
          <Table headers={['Patient', 'Doctor', 'Date', 'Time', 'Reason', 'Status']}>
            {appts.map(a => (
              <tr key={a.id} className="hover:bg-slate-50 border-b border-slate-100 last:border-0">
                <td className="px-5 py-3 text-sm font-bold text-slate-800">{a.patient}</td>
                <td className="px-5 py-3 text-sm text-slate-600 font-medium">{a.doctor}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{a.date}</td>
                <td className="px-5 py-3 text-sm text-blue-600 font-bold">{a.time}</td>
                <td className="px-5 py-3 text-sm text-slate-500 truncate max-w-[150px]">{a.reason}</td>
                <td className="px-5 py-3 text-sm"><Badge status={a.status} /></td>
              </tr>
            ))}
          </Table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Schedule Appointment"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button loading={saving} onClick={handleAdd}>Schedule</Button></>}>
        <div className="space-y-4">
          <Input label="Patient" options={patients.map(p => ({ value: p.name, label: p.name }))} value={form.patient} onChange={e => setForm({...form, patient: e.target.value})} />
          <Input label="Doctor" options={doctors.map(d => ({ value: d.name, label: d.name }))} value={form.doctor} onChange={e => setForm({...form, doctor: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
            <Input label="Time" type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
          </div>
          <Input label="Reason" isTextarea placeholder="Briefly describe the clinical reason..." value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} />
        </div>
      </Modal>
    </div>
  );
}
