'use client';
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { apiFetch } from '@/lib/api';
import { PlusIcon } from '@/components/ui/Icons';
import { toast } from 'sonner';

export default function AdminAppointments() {
  const [loading, setLoading] = useState(true);
  const [appts, setAppts] = useState<any[]>([]);
  const [doctorsList, setDoctorsList] = useState<any[]>([]);
  const [patientsList, setPatientsList] = useState<any[]>([]);
  const [view, setView] = useState<'week' | 'list'>('list');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ patient_id: '', doctor_id: '', date: '', time: '', reason: '' });

  const fetchAll = async () => {
    try {
      const [apptRes, docRes, patRes] = await Promise.all([
        apiFetch('/appointments'),
        apiFetch('/doctors'),
        apiFetch('/patients')
      ]);

      if (apptRes.status === 'success') setAppts(apptRes.data || []);
      if (docRes.status === 'success') setDoctorsList(docRes.data || []);
      if (patRes.status === 'success') setPatientsList(patRes.data || []);
    } catch (error) {
      console.error("Failed to fetch appointment data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAdd = async () => {
    setSaving(true);
    try {
      const payload = {
        patient: { id: form.patient_id },
        doctor: { id: form.doctor_id },
        appointmentDate: form.date,
        appointmentTime: form.time,
        reason: form.reason,
        status: 'pending'
      };

      const res = await apiFetch('/appointments', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res.status === 'success') {
        await fetchAll();
        setModalOpen(false);
        setForm({ patient_id: '', doctor_id: '', date: '', time: '', reason: '' });
        toast.success("Clinical encounter scheduled successfully");
      }
    } catch (error) {
      toast.error("Failed to schedule appointment.");
    } finally {
      setSaving(false);
    }
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  if (loading) return (
    <div className="space-y-6">
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
            Schedule Matrix
          </button>
          <button 
            className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${view === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`} 
            onClick={() => setView('list')}
          >
            Audit List
          </button>
        </div>
        <Button onClick={() => setModalOpen(true)} className="h-10">
          <PlusIcon size={16} /> Schedule Appointment
        </Button>
      </div>

      {view === 'week' ? (
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {days.map((day, i) => (
            <div key={day} className="space-y-3">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 flex justify-between items-center">
                <span>{day}</span>
                <span className="font-mono">{weekDates[i].slice(8)}</span>
              </div>
              <div className="space-y-2 min-h-[200px]">
                {appts.filter(a => (a.date || a.appointmentDate) === weekDates[i]).map(a => (
                  <div key={a.id} className="p-3 rounded border border-slate-200 bg-white shadow-sm hover:border-blue-300 transition-colors">
                    <div className="text-[9px] font-bold text-blue-600 uppercase mb-1">{a.time || a.appointmentTime}</div>
                    <div className="text-xs font-bold text-slate-800 leading-tight">{a.patient?.name || a.patient}</div>
                    <div className="text-[9px] text-slate-400 font-bold mt-1 uppercase">{a.doctor?.name || a.doctor}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Appointment Registry</h3>
          </div>
          <Table headers={['Patient Identity', 'Attending Physician', 'Date', 'Time', 'Status']}>
            {appts.map(a => (
              <tr key={a.id} className="hover:bg-slate-50 border-b border-slate-100 last:border-0 font-medium">
                <td className="px-5 py-3 text-sm font-bold text-slate-800">{a.patient?.name || a.patient || 'Unknown'}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{a.doctor?.name || a.doctor || 'Unassigned'}</td>
                <td className="px-5 py-3 text-sm text-slate-500 font-mono italic">{a.date || a.appointmentDate}</td>
                <td className="px-5 py-3 text-sm text-blue-600 font-black">{a.time || a.appointmentTime}</td>
                <td className="px-5 py-3 text-sm"><Badge status={a.status} /></td>
              </tr>
            ))}
          </Table>
          {appts.length === 0 && (
            <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              No active appointments scheduled
            </div>
          )}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Schedule Clinical Encounter"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Dismiss</Button><Button loading={saving} onClick={handleAdd}>Confirm Schedule</Button></>}>
        <div className="space-y-4 py-2">
          <Input 
            label="Patient Identity" 
            options={[
              { value: '', label: '— Select Patient —' },
              ...patientsList.map(p => ({ value: p.id, label: p.name }))
            ]} 
            value={form.patient_id} 
            onChange={e => setForm({...form, patient_id: e.target.value})} 
          />
          <Input 
            label="Assigned Doctor" 
            options={[
              { value: '', label: '— Select Physician —' },
              ...doctorsList.map(d => ({ value: d.id, label: d.name }))
            ]} 
            value={form.doctor_id} 
            onChange={e => setForm({...form, doctor_id: e.target.value})} 
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Scheduled Date" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
            <Input label="Scheduled Time" type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
          </div>
          <Input label="Clinical Indication" isTextarea placeholder="Reason for clinical encounter..." value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} />
        </div>
      </Modal>
    </div>
  );
}
