'use client';
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { apiFetch } from '@/lib/api';
import authService from '@/lib/auth';
import { ClockIcon, EditIcon, CheckCircleIcon, CloseIcon, CalendarIcon } from '@/components/ui/Icons';
import { toast } from 'sonner';

export default function DoctorAppointments() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [updating, setUpdating] = useState(false);
  const user = authService.getUser();

  const fetchAppts = async () => {
    try {
      const res = await apiFetch(`/doctor/appointments?doctorId=${user?.id || ''}`);
      if (res.status === 'success') {
        setList(res.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch doctor appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppts();
  }, [user?.id]);

  const updateStatus = async (id: number, status: string) => {
    setUpdating(true);
    try {
      // In a real app we'd have a specific endpoint for status updates
      // Here we assume the POST endpoint handles updates if ID is provided
      const appt = list.find(a => a.id === id);
      await apiFetch('/appointments', {
        method: 'POST',
        body: JSON.stringify({ ...appt, status })
      });
      await fetchAppts();
      setSelected(null);
    } catch (error) {
      toast.error("Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded p-6 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <SkeletonLoader width={200} height={24} />
          <SkeletonLoader width={80} height={24} />
        </div>
        <div className="space-y-4">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0">
               <SkeletonLoader variant="circular" width={32} height={32} />
               <div className="flex-1 space-y-2">
                 <SkeletonLoader width="40%" height={16} />
                 <SkeletonLoader width="20%" height={12} />
               </div>
               <SkeletonLoader width={60} height={24} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">Clinical Consultation Registry</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Real-time schedule synchronization</p>
          </div>
          <Badge status="active">{list.length} LIVE QUEUE</Badge>
        </div>
        
        <Table headers={['Identity', 'Temporal Epoch', 'Chronological Time', 'Justification', 'Clinical Status', 'Operational Matrix']}>
          {list.map(a => (
            <tr key={a.id} className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group select-none cursor-pointer" onClick={() => setSelected(a)}>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-xs uppercase">{(a.patient || 'P').charAt(0)}</div>
                  <span className="text-sm font-black text-slate-800 tracking-tight">{a.patient}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-500 font-medium">{a.date || a.appointmentDate}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5 text-blue-600">
                  <ClockIcon size={14} />
                  <span className="text-sm font-black italic">{a.time || a.appointmentTime}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600 font-medium italic">{a.reason}</td>
              <td className="px-6 py-4"><Badge status={a.status} /></td>
              <td className="px-6 py-4 text-right">
                <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded transition-all opacity-0 group-hover:opacity-100">
                  <EditIcon size={16} />
                </button>
              </td>
            </tr>
          ))}
        </Table>
        {list.length === 0 && (
          <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            No clinical consultations scheduled for today
          </div>
        )}
      </div>

      <Modal 
        open={!!selected} 
        onClose={() => setSelected(null)} 
        title="Consultation Protocol Hub"
        footer={<Button variant="secondary" onClick={() => setSelected(null)}>Abort Interface</Button>}
      >
        {selected && (
          <div className="space-y-8 py-2">
            <div className="flex flex-col items-center pb-6 border-b border-slate-50">
              <div className="w-16 h-16 rounded bg-slate-100 flex items-center justify-center text-slate-400 font-black text-2xl mb-4 shadow-inner">
                {(selected.patient || 'P').charAt(0)}
              </div>
              <h4 className="text-lg font-black text-slate-900 tracking-tight">{selected.patient}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Scheduled Encounter: {selected.date || selected.appointmentDate} @ {selected.time || selected.appointmentTime}</p>
            </div>

            <div className="space-y-4">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Functional Overrides</div>
              <div className="grid grid-cols-1 gap-3">
                <button 
                  disabled={updating}
                  onClick={() => updateStatus(selected.id, 'completed')}
                  className="w-full flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded hover:bg-emerald-100 transition-colors group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3 text-emerald-700">
                    <CheckCircleIcon size={20} />
                    <span className="text-sm font-black uppercase tracking-tight">Finalize Encounter</span>
                  </div>
                  <Badge status="completed">SUCCESS</Badge>
                </button>

                <button 
                  disabled={updating}
                  onClick={() => updateStatus(selected.id, 'cancelled')}
                  className="w-full flex items-center justify-between p-4 bg-rose-50 border border-rose-100 rounded hover:bg-rose-100 transition-colors group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3 text-rose-700">
                    <CloseIcon size={20} />
                    <span className="text-sm font-black uppercase tracking-tight">Void Appointment</span>
                  </div>
                  <Badge status="cancelled">REJECT</Badge>
                </button>

                <button 
                  className="w-full flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded hover:bg-blue-100 transition-colors group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3 text-blue-700">
                    <CalendarIcon size={20} />
                    <span className="text-sm font-black uppercase tracking-tight">Shift Chronology</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Reschedule</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
