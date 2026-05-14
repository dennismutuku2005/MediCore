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
  const [selectedAppt, setSelectedAppt] = useState<any>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
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
          <h2 className="text-xl font-medium text-slate-800">Clinical encounter history</h2>
          <p className="text-[10px] text-slate-400 mt-1">Timeline of your medical interactions</p>
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
                  <span className="text-sm font-medium text-slate-900">{a.doctor?.name || a.doctor || 'Assigned Physician'}</span>
                  <Badge status={a.status} />
                </div>
                <div className="text-xs text-slate-500 font-medium">{a.department || 'Clinical department'} • {a.reason || 'General consultation'}</div>
                <div className="text-[11px] text-blue-600 mt-2 bg-blue-50/50 inline-block px-2 py-0.5 rounded border border-blue-100">
                  {a.date || a.appointmentDate} at {a.time || a.appointmentTime}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {a.status === 'pending' && (
                  <button className="px-4 py-2 text-[10px] text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all rounded border border-slate-100">
                    Cancel request
                  </button>
                )}
                <button 
                  onClick={() => {
                    setSelectedAppt(a);
                    setDetailsModalOpen(true);
                  }}
                  className="px-4 py-2 text-[10px] text-blue-600 hover:bg-blue-600 hover:text-white transition-all rounded border border-blue-100"
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}

        {appts.length === 0 && (
          <div className="p-16 text-center bg-white border border-slate-200 border-dashed rounded-lg">
            <div className="text-sm text-slate-400">No scheduled encounters found</div>
            <p className="text-xs text-slate-400 mt-2">Request a consultation to begin your clinical journey.</p>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Request appointment"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button loading={saving} onClick={handleRequest}>Save</Button></>}>
        <div className="space-y-4 py-2">
          <Input label="Clinical department" options={[
            {value:'Internal Medicine',label:'Internal Medicine'},
            {value:'Pediatrics',label:'Pediatrics'},
            {value:'Surgery',label:'Surgery'},
            {value:'Cardiology',label:'Cardiology'}
          ]} value={form.department} onChange={e => setForm({...form, department: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Preferred date" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
            <Input label="Preferred time" type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
          </div>
          <Input label="Clinical reason" isTextarea placeholder="Briefly explain your medical concern..." value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} />
        </div>
      </Modal>

      <Modal open={detailsModalOpen} onClose={() => setDetailsModalOpen(false)} title="Appointment details"
        footer={<Button onClick={() => setDetailsModalOpen(false)}>Close</Button>}>
        {selectedAppt && (
          <div className="space-y-6 py-2">
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded">
              <div>
                <div className="text-[10px] text-slate-400 mb-1">Attending physician</div>
                <div className="text-sm font-medium text-slate-900">{selectedAppt.doctor?.name || selectedAppt.doctor || 'Unassigned'}</div>
              </div>
              <Badge status={selectedAppt.status} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded">
                <div className="text-[10px] text-slate-400 mb-1">Department</div>
                <div className="text-xs font-medium text-slate-800">{selectedAppt.department || 'N/A'}</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded">
                <div className="text-[10px] text-slate-400 mb-1">Schedule</div>
                <div className="text-xs font-medium text-slate-800">{selectedAppt.date || selectedAppt.appointmentDate} at {selectedAppt.time || selectedAppt.appointmentTime}</div>
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 mb-1">Reason for encounter</div>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded text-sm text-slate-700 font-medium leading-relaxed">
                {selectedAppt.reason || 'General consultation'}
              </div>
            </div>

            {selectedAppt.instructions && (
              <div>
                <div className="text-[10px] text-slate-400 mb-1">Provider instructions</div>
                <div className="p-4 bg-amber-50 border border-amber-100 rounded text-sm text-slate-700 font-medium leading-relaxed">
                  {selectedAppt.instructions}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
