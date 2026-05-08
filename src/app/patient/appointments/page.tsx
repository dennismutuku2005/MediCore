'use client';
import React, { useState, useEffect } from 'react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { apiFetch } from '@/lib/api';
import authService from '@/lib/auth';
import { PlusIcon } from '@/components/ui/Icons';
import { toast } from 'sonner';

export default function PatientAppointments() {
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ department: 'Internal Medicine', date: '', time: '', reason: '' });
  const [saving, setSaving] = useState(false);
  const [appts, setAppts] = useState<any[]>([]);
  const user = authService.getUser();

  const fetchAppts = async () => {
    try {
      // Find the patient record that matches this user's username
      const patientsRes = await apiFetch('/patients');
      const currentPatient = patientsRes.data?.find((p: any) => p.user?.username === user?.username);
      
      if (currentPatient) {
        const res = await apiFetch(`/appointments?patientId=${currentPatient.id}`);
        if (res.status === 'success') {
          setAppts(res.data || []);
        }
      }
    } catch (error) {
      console.error("Failed to fetch patient appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppts();
  }, [user?.id]);

  const handleRequest = async () => {
    if (!form.date?.trim() || !form.time?.trim() || !form.reason?.trim()) {
      toast.error("Protocol Error: Please provide all mandatory clinical parameters (Date, Time, and Reason)");
      return;
    }
    setSaving(true);
    try {
      const patientsRes = await apiFetch('/patients');
      const currentPatient = patientsRes.data?.find((p: any) => p.user?.username === user?.username);

      if (!currentPatient) {
        toast.error("Clinical profile not identified.");
        return;
      }

      console.log("[DEBUG] Dispatching appointment payload:", { ...form, patientId: currentPatient.id, status: 'pending' });
      const res = await apiFetch('/appointments', {
        method: 'POST',
        body: JSON.stringify({ ...form, patientId: currentPatient.id, status: 'pending' })
      });

      if (res.status === 'success') {
        toast.success("Encounter request dispatched to clinical triage");
        setModalOpen(false);
        await fetchAppts();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to dispatch encounter request.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="space-y-4">
      <SkeletonLoader height={120} count={3} className="rounded-lg" />
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Clinical Encounter History</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Timeline of your medical interactions</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="h-10">
          <PlusIcon size={16} /> 
          <span className="ml-1">Request Appointment</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {appts.map(a => (
          <div key={a.id} className="bg-white border border-slate-200 rounded p-6 shadow-sm hover:border-blue-200 transition-all group">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-slate-900 tracking-tight">{a.doctor?.name || a.doctor || 'Assigned Physician'}</span>
                  <Badge status={a.status} />
                </div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{a.department || 'Clinical Department'} • {a.reason || 'General Consultation'}</div>
                <div className="text-[11px] font-bold text-blue-600 mt-2 bg-blue-50/50 inline-block px-2 py-0.5 rounded border border-blue-100">
                  {a.date || a.appointmentDate} at {a.time || a.appointmentTime}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {a.status === 'pending' && (
                  <button className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-600 hover:bg-rose-50 transition-all rounded border border-slate-100">
                    Cancel Request
                  </button>
                )}
                <button className="px-4 py-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all rounded border border-blue-100">
                  View Instructions
                </button>
              </div>
            </div>
          </div>
        ))}

        {appts.length === 0 && (
          <div className="p-16 text-center bg-white border border-slate-200 border-dashed rounded-lg">
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">No scheduled encounters found</div>
            <p className="text-xs text-slate-400 mt-2">Request a consultation to begin your clinical journey.</p>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Request Clinical Encounter"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Abort Request</Button><Button loading={saving} onClick={handleRequest}>Dispatch Signal</Button></>}>
        <div className="space-y-4 py-2">
          <Input label="Clinical Department" options={[
            {value:'Internal Medicine',label:'Internal Medicine'},
            {value:'Pediatrics',label:'Pediatrics'},
            {value:'Surgery',label:'Surgery'},
            {value:'Cardiology',label:'Cardiology'}
          ]} value={form.department} onChange={e => setForm({...form, department: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Preferred Date" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
            <Input label="Preferred Time" type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
          </div>
          <Input label="Clinical Reason" isTextarea placeholder="Briefly explain your medical concern..." value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} />
        </div>
      </Modal>
    </div>
  );
}
