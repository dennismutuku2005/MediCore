'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import PatientCombobox from '@/components/ui/PatientCombobox';
import { apiFetch } from '@/lib/api';
import authService from '@/lib/auth';
import { PlusIcon } from '@/components/ui/Icons';
import { toast } from 'sonner';

const EMPTY_FORM = {
  patientId: '',
  patientName: '',   // display label only — not sent to API
  medication: '',
  dosage: '',
  frequency: '',
  startDate: '',
  duration: '',
  instructions: '',
};

/** Safely resolves patient field (nested object or string) to a display name */
const resolveName = (field: any): string => {
  if (!field) return '—';
  if (typeof field === 'object') return field.name || `#${field.id}`;
  return String(field);
};

export default function DoctorPrescriptions() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const user = authService.getUser();

  const fetchData = useCallback(async () => {
    try {
      const res = await apiFetch(`/doctor/prescriptions?doctorId=${user?.id || ''}`);
      if (res?.status === 'success') setList(res.data || []);
    } catch (error) {
      console.error('Failed to fetch prescription data:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openModal = () => { setForm(EMPTY_FORM); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setForm(EMPTY_FORM); };

  const handleAdd = async () => {
    if (!form.patientId || !form.medication) {
      toast.error('Patient and medication are required.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        patient: { id: Number(form.patientId) },
        doctor: { id: user?.id },
        medication: form.medication,
        dosage: form.dosage,
        frequency: form.frequency,
        startDate: form.startDate || null,
        instructions: form.instructions,
        status: 'active',
      };
      const res = await apiFetch('/doctor/prescriptions', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res?.status === 'success') {
        toast.success('Prescription issued successfully.');
        await fetchData();
        closeModal();
      } else {
        toast.error(res?.message || 'Failed to issue prescription.');
      }
    } catch {
      toast.error('Failed to issue clinical prescription.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="space-y-6">
      <div className="flex justify-end"><SkeletonLoader width={180} height={40} /></div>
      <div className="bg-white border border-slate-200 rounded p-6 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <SkeletonLoader width={150} height={20} /><SkeletonLoader width={80} height={20} />
        </div>
        <div className="space-y-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="flex items-center gap-6 py-4 border-b border-slate-50 last:border-0">
              <div className="flex-1 space-y-2">
                <SkeletonLoader width="60%" height={16} /><SkeletonLoader width="30%" height={12} />
              </div>
              <SkeletonLoader width="15%" height={14} />
              <SkeletonLoader width="15%" height={14} />
              <SkeletonLoader width={70} height={24} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-black text-slate-900 tracking-tight">Pharmaceutical Registry</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Active and historical prescriptions</p>
        </div>
        <Button onClick={openModal}>
          <PlusIcon size={14} />
          <span className="ml-2">Issue Prescription</span>
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <Table headers={['Patient', 'Medication', 'Dosage', 'Frequency', 'Start Date', 'Status']}>
          {list.map(rx => (
            <tr key={rx.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 font-medium">
              <td className="px-5 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black text-xs">
                    {resolveName(rx.patient).charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-slate-800">{resolveName(rx.patient)}</span>
                </div>
              </td>
              <td className="px-5 py-3 text-sm text-blue-600 font-black tracking-tight">{rx.medication}</td>
              <td className="px-5 py-3 text-sm text-slate-600">{rx.dosage || '—'}</td>
              <td className="px-5 py-3 text-sm text-slate-500">{rx.frequency || '—'}</td>
              <td className="px-5 py-3 text-sm text-slate-400 font-mono italic">{rx.startDate || '—'}</td>
              <td className="px-5 py-3 text-sm"><Badge status={rx.status} /></td>
            </tr>
          ))}
        </Table>
        {list.length === 0 && (
          <div className="p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            No prescriptions issued under your clinical ID
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title="Issue Clinical Prescription"
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button onClick={handleAdd} disabled={saving}>{saving ? 'Issuing...' : 'Confirm Prescription'}</Button>
          </>
        }
      >
        <div className="space-y-4 py-2">

          {/* API-backed searchable patient combobox */}
          <PatientCombobox
            value={form.patientId}
            displayValue={form.patientName}
            onChange={(id, name) => setForm(f => ({ ...f, patientId: id, patientName: name }))}
          />

          {/* Medication */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Medication</label>
            <input
              className="w-full h-9 px-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors placeholder:text-slate-400"
              placeholder="e.g. Amoxicillin 500mg"
              value={form.medication}
              onChange={e => setForm(f => ({ ...f, medication: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Dosage</label>
              <input
                className="w-full h-9 px-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors placeholder:text-slate-400"
                placeholder="e.g. 1 Tablet"
                value={form.dosage}
                onChange={e => setForm(f => ({ ...f, dosage: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Frequency</label>
              <select
                className="w-full h-9 px-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors"
                value={form.frequency}
                onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}
              >
                <option value="">— Select —</option>
                <option value="Once daily">Once daily (OD)</option>
                <option value="Twice daily (BD)">Twice daily (BD)</option>
                <option value="Three times daily (TDS)">Three times daily (TDS)</option>
                <option value="Four times daily (QDS)">Four times daily (QDS)</option>
                <option value="When required (PRN)">When required (PRN)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Start Date</label>
              <input
                type="date"
                className="w-full h-9 px-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors"
                value={form.startDate}
                onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Duration (Days)</label>
              <input
                className="w-full h-9 px-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors placeholder:text-slate-400"
                placeholder="e.g. 7"
                value={form.duration}
                onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Provider Instructions</label>
            <textarea
              className="w-full min-h-[72px] px-3 py-2 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors placeholder:text-slate-400 resize-none"
              placeholder="Clinical guidance for the patient..."
              value={form.instructions}
              onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))}
            />
          </div>

        </div>
      </Modal>
    </div>
  );
}
