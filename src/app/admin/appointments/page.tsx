'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import PatientCombobox from '@/components/ui/PatientCombobox';
import { apiFetch } from '@/lib/api';
import { PlusIcon, SearchIcon, ClockIcon } from '@/components/ui/Icons';
import { toast } from 'sonner';
import Combobox from '@/components/ui/Combobox';

const EMPTY_FORM = { patientId: '', patientName: '', doctorId: '', date: '', time: '', reason: '', department: '' };

export default function AdminAppointments() {
  const [loading, setLoading]     = useState(true);
  const [appts, setAppts]         = useState<any[]>([]);
  const [doctorsList, setDoctorsList] = useState<any[]>([]);
  const [search, setSearch]       = useState('');
  const [view, setView]           = useState<'week' | 'list'>('list');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);

  const fetchAll = useCallback(async () => {
    try {
      const [apptRes, docRes] = await Promise.all([
        apiFetch('/appointments'),
        apiFetch('/doctors'),
      ]);
      if (apptRes?.status === 'success') setAppts(apptRes.data || []);
      if (docRes?.status === 'success') setDoctorsList(docRes.data || []);
    } catch (error) {
      console.error('Failed to fetch appointment data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleAdd = async () => {
    if (!form.patientId || !form.doctorId || !form.date || !form.time) {
      toast.error('Patient, doctor, date and time are required.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        patient: { id: Number(form.patientId) },
        doctor: { id: Number(form.doctorId) },
        appointmentDate: form.date,
        appointmentTime: form.time,
        reason: form.reason,
        department: form.department,
        status: 'pending',
      };
      const res = await apiFetch('/appointments', { method: 'POST', body: JSON.stringify(payload) });
      if (res?.status === 'success') {
        await fetchAll();
        setModalOpen(false);
        setForm(EMPTY_FORM);
        toast.success('Appointment scheduled successfully.');
      } else {
        toast.error(res?.message || 'Failed to schedule appointment.');
      }
    } catch {
      toast.error('Failed to schedule appointment.');
    } finally {
      setSaving(false);
    }
  };

  // Safe name resolution — AppointmentController returns patient as string
  const patientName = (a: any) =>
    typeof a.patient === 'object' ? a.patient?.name || '—' : a.patient || '—';
  const doctorName = (a: any) =>
    typeof a.doctor === 'object' ? a.doctor?.name || '—' : a.doctor || '—';

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  const filtered = appts.filter(a =>
    patientName(a).toLowerCase().includes(search.toLowerCase()) ||
    doctorName(a).toLowerCase().includes(search.toLowerCase()) ||
    (a.department || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="space-y-6">
      <SkeletonLoader height={40} />
      <div className="bg-white border border-slate-200 rounded p-5 space-y-3 shadow-sm">
        <SkeletonLoader height={24} width={200} />
        <SkeletonLoader variant="row" count={6} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-slate-100 p-1 rounded border border-slate-200">
            {(['list', 'week'] as const).map(v => (
              <button
                key={v}
                className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${view === v ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                onClick={() => setView(v)}
              >
                {v === 'list' ? 'Audit List' : 'Schedule Matrix'}
              </button>
            ))}
          </div>

          {/* Search (list view only) */}
          {view === 'list' && (
            <div className="relative w-[260px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <SearchIcon size={14} />
              </span>
              <input
                className="w-full h-9 pl-9 pr-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors placeholder:text-slate-400"
                placeholder="Search patient, doctor, department..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          )}
        </div>

        <Button onClick={() => { setForm(EMPTY_FORM); setModalOpen(true); }}>
          <PlusIcon size={16} />
          <span className="ml-1.5">Schedule Appointment</span>
        </Button>
      </div>

      {/* Weekly Matrix View */}
      {view === 'week' ? (
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {days.map((day, i) => (
            <div key={day} className="space-y-2">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 flex justify-between items-center">
                <span>{day}</span>
                <span className="font-mono text-slate-300">{weekDates[i].slice(8)}</span>
              </div>
              <div className="space-y-2 min-h-[200px]">
                {appts.filter(a => (a.date || a.appointmentDate) === weekDates[i]).map(a => (
                  <div key={a.id} className="p-3 rounded border border-slate-200 bg-white shadow-sm hover:border-blue-300 hover:shadow transition-all">
                    <div className="flex items-center gap-1 text-[9px] font-bold text-blue-600 uppercase mb-1">
                      <ClockIcon size={9} />
                      <span>{a.time || a.appointmentTime}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 leading-tight truncate">{patientName(a)}</div>
                    <div className="text-[9px] text-slate-400 font-bold mt-1 uppercase truncate">{doctorName(a)}</div>
                    <div className="mt-1.5"><Badge status={a.status} /></div>
                  </div>
                ))}
                {appts.filter(a => (a.date || a.appointmentDate) === weekDates[i]).length === 0 && (
                  <div className="h-20 rounded border border-dashed border-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-200 uppercase tracking-widest">
                    Free
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Appointment Registry</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                {filtered.length} of {appts.length} records
              </p>
            </div>
            <Badge status="active">LIVE</Badge>
          </div>
          <Table headers={['Patient', 'Doctor', 'Department', 'Date', 'Time', 'Status']}>
            {filtered.map(a => (
              <tr key={a.id} className="hover:bg-slate-50 border-b border-slate-100 last:border-0 font-medium transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black text-xs">
                      {patientName(a).charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-bold text-slate-800">{patientName(a)}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm text-slate-600 font-medium">{doctorName(a)}</td>
                <td className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wide">{a.department || '—'}</td>
                <td className="px-5 py-3 text-sm text-slate-500 font-mono">{a.date || a.appointmentDate}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5 text-blue-600">
                    <ClockIcon size={12} />
                    <span className="text-sm font-black italic">{a.time || a.appointmentTime}</span>
                  </div>
                </td>
                <td className="px-5 py-3"><Badge status={a.status} /></td>
              </tr>
            ))}
          </Table>
          {filtered.length === 0 && (
            <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              {search ? `No appointments matching "${search}"` : 'No appointments scheduled'}
            </div>
          )}
        </div>
      )}

      {/* Schedule Modal */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setForm(EMPTY_FORM); }}
        title="Schedule Clinical Encounter"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setModalOpen(false); setForm(EMPTY_FORM); }}>Cancel</Button>
            <Button onClick={handleAdd} disabled={saving}>{saving ? 'Scheduling...' : 'Confirm Schedule'}</Button>
          </>
        }
      >
        <div className="space-y-4 py-2">

          {/* API patient search */}
          <PatientCombobox
            value={form.patientId}
            displayValue={form.patientName}
            onChange={(id, name) => setForm(f => ({ ...f, patientId: id, patientName: name }))}
          />

          {/* Doctor dropdown — small list, plain select is fine */}
          <Combobox 
            label="Assigned Doctor" 
            placeholder="Search Physician..."
            options={[
              { value: '', label: 'Select physician...' },
              ...doctorsList.map(d => ({ value: d.id, label: d.name, sublabel: d.specialization }))
            ]} 
            value={form.doctorId} 
            onChange={val => setForm(f => ({ ...f, doctorId: val }))} 
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</label>
              <input type="date" className="w-full h-9 px-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors"
                value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Time</label>
              <input type="time" className="w-full h-9 px-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors"
                value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Department</label>
            <input className="w-full h-9 px-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors placeholder:text-slate-400"
              placeholder="e.g. General, Cardiology..." value={form.department}
              onChange={e => setForm(f => ({ ...f, department: e.target.value }))} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Clinical Indication</label>
            <textarea className="w-full min-h-[68px] px-3 py-2 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors placeholder:text-slate-400 resize-none"
              placeholder="Reason for clinical encounter..." value={form.reason}
              onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} />
          </div>

        </div>
      </Modal>
    </div>
  );
}
