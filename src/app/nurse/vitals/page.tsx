'use client';
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import LineChart from '@/components/charts/LineChart';
import { toast } from 'sonner';
import Badge from '@/components/ui/Badge';
import { apiFetch } from '@/lib/api';

export default function NurseVitals() {
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [vitalsList, setVitalsList] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [form, setForm] = useState({ bp: '120/80', hr: '72', temp: '36.8', spo2: '98', rr: '16', weight: '70' });

  const fetchData = async () => {
    try {
      const [patRes, vitRes] = await Promise.all([
        apiFetch('/patients'),
        apiFetch('/vitals')
      ]);

      if (patRes.status === 'success') setPatients(patRes.data || []);
      if (vitRes.status === 'success') setVitalsList(vitRes.data || []);
    } catch (error) {
      console.error("Failed to fetch vitals data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRecord = async () => {
    if (!selectedPatientId) return;
    setSaving(true);
    try {
      const res = await apiFetch('/vitals', {
        method: 'POST',
        body: JSON.stringify({ ...form, patientId: selectedPatientId })
      });

      if (res.status === 'success') {
        await fetchData();
        setModalOpen(false);
        toast.success('Clinical telemetry recorded successfully');
      }
    } catch (error) {
      toast.error('Protocol failure: Could not record vitals');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="space-y-6">
      <SkeletonLoader height={300} className="rounded-xl shadow-sm" />
      <SkeletonLoader height={250} className="rounded-xl shadow-sm" />
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Active Ward Census Telemetry</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time vital signs monitoring</p>
          </div>
          <Badge status="active">LIVE SENSORS</Badge>
        </div>
        <Table headers={['Patient Identity', 'Room/Ward', 'BP (Sys/Dia)', 'HR (BPM)', 'Temp (°C)', 'Last Audit', 'Action']}>
          {patients.map(p => {
            const v = vitalsList.find(vt => vt.patientId === p.id);
            return (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 font-medium">
                <td className="px-6 py-4 text-sm font-bold text-slate-800">{p.name}</td>
                <td className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.ward || 'General'}</td>
                <td className="px-6 py-4 text-sm font-black text-blue-600">{v?.bp || '—'}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-700">{v?.hr || '—'}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-700">{v ? `${v.temp}°C` : '—'}</td>
                <td className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase italic">{v?.timestamp ? new Date(v.timestamp).toLocaleTimeString() : 'No Data'}</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => { setSelectedPatientId(p.id); setModalOpen(true); }}
                    className="h-8 px-4 bg-white border border-slate-200 rounded text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                  >
                    Record Vitals
                  </button>
                </td>
              </tr>
            );
          })}
        </Table>
        {patients.length === 0 && (
          <div className="p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            No patients identified in ward census
          </div>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Clinical Trend Analysis</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Institutional heart rate aggregate (7-day window)</p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-blue-600" />
               <span className="text-[9px] font-bold text-slate-400 uppercase">Current Session</span>
            </div>
          </div>
        </div>
        <div className="h-[220px]">
          <LineChart data={vitalsList.map(v => {
            const date = v.timestamp ? new Date(v.timestamp) : new Date();
            const hour = isNaN(date.getTime()) ? '--' : date.getHours() + ':00';
            return { value: v.hr || 0, label: hour };
          }).slice(-10)} color="#2563eb" />
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Commit Clinical Telemetry"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Abort interface</Button><Button loading={saving} onClick={handleRecord}>Commit to Record</Button></>}>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Blood Pressure (Systolic/Diastolic)" placeholder="120/80" value={form.bp} onChange={e => setForm({...form, bp: e.target.value})} />
            <Input label="Heart Rate (BPM)" placeholder="72" value={form.hr} onChange={e => setForm({...form, hr: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Body Temperature (°C)" placeholder="36.8" value={form.temp} onChange={e => setForm({...form, temp: e.target.value})} />
            <Input label="SpO2 Oxygen Saturation (%)" placeholder="98" value={form.spo2} onChange={e => setForm({...form, spo2: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Respiratory Rate (BPM)" placeholder="16" value={form.rr} onChange={e => setForm({...form, rr: e.target.value})} />
            <Input label="Patient Mass (KG)" placeholder="70" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} />
          </div>
          <div className="pt-2">
            <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Telemetry Origin Timestamp</div>
            <div className="text-xs font-bold text-slate-400 bg-slate-50 p-3 rounded border border-slate-100">{new Date().toLocaleString()}</div>
          </div>
        </div>
      </Modal>

    </div>
  );
}
