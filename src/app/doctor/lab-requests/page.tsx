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

const EMPTY_FORM = { patientId: '', patientName: '', testType: '', urgency: 'Routine', notes: '' };

const resolveName = (field: any): string => {
  if (!field) return '—';
  if (typeof field === 'object') return field.name || `#${field.id}`;
  return String(field);
};

export default function DoctorLabRequests() {
  const [loading, setLoading] = useState(true);
  const [list, setList]       = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [form, setForm]       = useState(EMPTY_FORM);
  const user = authService.getUser();

  const fetchData = useCallback(async () => {
    try {
      const res = await apiFetch(`/doctor/lab-requests?doctorId=${user?.id || ''}`);
      if (res?.status === 'success') setList(res.data || []);
    } catch (error) {
      console.error('Failed to fetch lab request data:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openModal  = () => { setForm(EMPTY_FORM); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setForm(EMPTY_FORM); };

  const handleAdd = async () => {
    if (!form.patientId || !form.testType) {
      toast.error('Patient and test type are required.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        patient: { id: Number(form.patientId) },
        doctor: { id: user?.id },
        testType: form.testType,
        urgency: form.urgency,
        notes: form.notes,
        status: 'pending',
      };
      const res = await apiFetch('/doctor/lab-requests', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res?.status === 'success') {
        toast.success('Lab request submitted.');
        await fetchData();
        closeModal();
      } else {
        toast.error(res?.message || 'Failed to submit lab request.');
      }
    } catch {
      toast.error('Failed to initiate diagnostic request.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="space-y-6">
      <div className="flex justify-end"><SkeletonLoader width={180} height={40} /></div>
      <div className="bg-white border border-slate-200 rounded p-6 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <SkeletonLoader width={220} height={20} /><SkeletonLoader width={80} height={20} />
        </div>
        <div className="space-y-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="flex items-center gap-6 py-4 border-b border-slate-50 last:border-0">
              <div className="flex-1 space-y-2">
                <SkeletonLoader width="50%" height={16} /><SkeletonLoader width="25%" height={12} />
              </div>
              <SkeletonLoader width="10%" height={24} />
              <SkeletonLoader width="15%" height={12} />
              <SkeletonLoader width="10%" height={24} />
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
          <h3 className="text-base font-black text-slate-900 tracking-tight">Diagnostic Analysis Queue</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time tracking of clinical investigations</p>
        </div>
        <Button onClick={openModal}>
          <PlusIcon size={14} />
          <span className="ml-2">Initiate Lab Request</span>
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <Table headers={['Patient', 'Test Type', 'Priority', 'Date Requested', 'Status', 'Result']}>
          {list.map(t => (
            <tr key={t.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 font-medium">
              <td className="px-5 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black text-xs">
                    {resolveName(t.patient).charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-slate-800">{resolveName(t.patient)}</span>
                </div>
              </td>
              <td className="px-5 py-3 text-sm text-blue-600 font-black tracking-tight">{t.testType}</td>
              <td className="px-5 py-3 text-sm"><Badge status={t.urgency?.toLowerCase()} /></td>
              <td className="px-5 py-3 text-sm text-slate-400 font-mono italic">{t.dateRequested || '—'}</td>
              <td className="px-5 py-3 text-sm"><Badge status={t.status} /></td>
              <td className="px-5 py-3 text-sm text-slate-800 font-black italic">{t.result || 'Analysis in progress...'}</td>
            </tr>
          ))}
        </Table>
        {list.length === 0 && (
          <div className="p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            No diagnostic orders found for your clinical ID
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title="Initialize Diagnostic Request"
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button onClick={handleAdd} disabled={saving}>{saving ? 'Submitting...' : 'Confirm Request'}</Button>
          </>
        }
      >
        <div className="space-y-4 py-2">

          {/* API-backed patient search */}
          <PatientCombobox
            value={form.patientId}
            displayValue={form.patientName}
            onChange={(id, name) => setForm(f => ({ ...f, patientId: id, patientName: name }))}
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Test Type */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Diagnostic Protocol</label>
              <select
                className="w-full h-9 px-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors"
                value={form.testType}
                onChange={e => setForm(f => ({ ...f, testType: e.target.value }))}
              >
                <option value="">— Select test —</option>
                <option value="CBC">Full Blood Count (CBC)</option>
                <option value="Malaria RDT">Malaria RDT</option>
                <option value="Blood Glucose">Blood Glucose (FBG)</option>
                <option value="Urinalysis">Urinalysis</option>
                <option value="Chest X-Ray">Radiology (Chest X-Ray)</option>
                <option value="LFT">Liver Function Tests (LFT)</option>
                <option value="RFT">Renal Function Tests (RFT)</option>
                <option value="ECG">Electrocardiogram (ECG)</option>
              </select>
            </div>

            {/* Urgency */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Clinical Urgency</label>
              <select
                className="w-full h-9 px-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors"
                value={form.urgency}
                onChange={e => setForm(f => ({ ...f, urgency: e.target.value }))}
              >
                <option value="Routine">Routine</option>
                <option value="STAT">High Priority (STAT)</option>
              </select>
            </div>
          </div>

          {/* Clinical notes */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Clinical Justification</label>
            <textarea
              className="w-full min-h-[72px] px-3 py-2 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors placeholder:text-slate-400 resize-none"
              placeholder="Specific symptoms or findings justifying the request..."
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            />
          </div>

        </div>
      </Modal>
    </div>
  );
}
