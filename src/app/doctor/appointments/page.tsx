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
  const [editMode, setEditMode] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editForm, setEditForm] = useState({ reason: '', date: '', time: '', department: '', status: '' });
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

  // Quick status update using PATCH /appointments/{id}/status
  const updateStatus = async (id: number, status: string) => {
    setUpdating(true);
    try {
      await apiFetch(`/appointments/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      toast.success(`Appointment marked as ${status}`);
      await fetchAppts();
      setSelected(null);
    } catch (error) {
      toast.error("Failed to update appointment status.");
    } finally {
      setUpdating(false);
    }
  };

  // Open edit form with current appointment values
  const openEdit = (appt: any) => {
    setEditForm({
      reason: appt.reason || '',
      date: appt.date || appt.appointmentDate || '',
      time: appt.time || appt.appointmentTime || '',
      department: appt.department || '',
      status: appt.status || 'pending',
    });
    setEditMode(true);
  };

  // Save full appointment update using PATCH /appointments/{id}
  const saveEdit = async () => {
    if (!selected) return;
    setUpdating(true);
    try {
      await apiFetch(`/appointments/${selected.id}`, {
        method: 'PATCH',
        body: JSON.stringify(editForm)
      });
      toast.success("Appointment updated successfully.");
      await fetchAppts();
      setSelected(null);
      setEditMode(false);
    } catch (error) {
      toast.error("Failed to save appointment changes.");
    } finally {
      setUpdating(false);
    }
  };

  const closeModal = () => {
    setSelected(null);
    setEditMode(false);
  };

  // patient comes as a nested object {id, name, ...} from /api/doctor/appointments
  const patientName = (appt: any) =>
    typeof appt?.patient === 'object'
      ? appt.patient?.name || 'Unknown'
      : appt?.patient || 'Unknown';

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
        
        <Table headers={['Patient', 'Date', 'Time', 'Reason', 'Department', 'Status', 'Actions']}>
          {list.map(a => (
            <tr
              key={a.id}
              className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group select-none cursor-pointer"
              onClick={() => { setSelected(a); setEditMode(false); }}
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-xs uppercase">
                    {patientName(a).charAt(0)}
                  </div>
                  <span className="text-sm font-black text-slate-800 tracking-tight">{patientName(a)}</span>
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
              <td className="px-6 py-4 text-sm text-slate-500">{a.department || '—'}</td>
              <td className="px-6 py-4"><Badge status={a.status} /></td>
              <td className="px-6 py-4 text-right">
                <button
                  className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded transition-all opacity-0 group-hover:opacity-100"
                  onClick={e => { e.stopPropagation(); setSelected(a); openEdit(a); }}
                  title="Edit appointment"
                >
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

      {/* Appointment Detail / Edit Modal */}
      <Modal
        open={!!selected}
        onClose={closeModal}
        title={editMode ? `Edit Appointment — ${patientName(selected)}` : `Appointment — ${patientName(selected)}`}
        footer={
          editMode ? (
            <>
              <Button variant="secondary" onClick={() => setEditMode(false)} disabled={updating}>Cancel</Button>
              <Button onClick={saveEdit} disabled={updating}>{updating ? 'Saving...' : 'Save Changes'}</Button>
            </>
          ) : (
            <Button variant="secondary" onClick={closeModal}>Close</Button>
          )
        }
      >
        {selected && !editMode && (
          <div className="space-y-8 py-2">
            {/* Patient Header */}
            <div className="flex flex-col items-center pb-6 border-b border-slate-50">
              <div className="w-16 h-16 rounded bg-slate-100 flex items-center justify-center text-slate-400 font-black text-2xl mb-4 shadow-inner">
                {patientName(selected).charAt(0)}
              </div>
              <h4 className="text-lg font-black text-slate-900 tracking-tight">{patientName(selected)}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {selected.date || selected.appointmentDate} @ {selected.time || selected.appointmentTime}
              </p>
              <div className="mt-2"><Badge status={selected.status} /></div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Reason', value: selected.reason || '—' },
                { label: 'Department', value: selected.department || '—' },
                { label: 'Date', value: selected.date || selected.appointmentDate || '—' },
                { label: 'Time', value: selected.time || selected.appointmentTime || '—' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-50 p-3 rounded border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">{label}</div>
                  <div className="text-sm font-black text-slate-800 mt-0.5">{value}</div>
                </div>
              ))}
            </div>

            {/* Quick Status Actions */}
            <div className="space-y-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Quick Actions</div>
              <div className="grid grid-cols-1 gap-3">
                <button
                  disabled={updating || selected.status === 'completed'}
                  onClick={() => updateStatus(selected.id, 'completed')}
                  className="w-full flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded hover:bg-emerald-100 transition-colors disabled:opacity-40"
                >
                  <div className="flex items-center gap-3 text-emerald-700">
                    <CheckCircleIcon size={20} />
                    <span className="text-sm font-black uppercase tracking-tight">Mark as Completed</span>
                  </div>
                  <Badge status="completed">DONE</Badge>
                </button>

                <button
                  disabled={updating || selected.status === 'cancelled'}
                  onClick={() => updateStatus(selected.id, 'cancelled')}
                  className="w-full flex items-center justify-between p-4 bg-rose-50 border border-rose-100 rounded hover:bg-rose-100 transition-colors disabled:opacity-40"
                >
                  <div className="flex items-center gap-3 text-rose-700">
                    <CloseIcon size={20} />
                    <span className="text-sm font-black uppercase tracking-tight">Cancel Appointment</span>
                  </div>
                  <Badge status="cancelled">VOID</Badge>
                </button>

                <button
                  onClick={() => openEdit(selected)}
                  className="w-full flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center gap-3 text-blue-700">
                    <CalendarIcon size={20} />
                    <span className="text-sm font-black uppercase tracking-tight">Edit Appointment Details</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Edit</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {selected && editMode && (
          <div className="space-y-5 py-2 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reason / Indication</label>
                <input
                  className="w-full h-10 px-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all"
                  value={editForm.reason}
                  onChange={e => setEditForm(f => ({ ...f, reason: e.target.value }))}
                  placeholder="Clinical reason..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full h-10 px-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all"
                    value={editForm.date}
                    onChange={e => setEditForm(f => ({ ...f, date: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Time</label>
                  <input
                    type="time"
                    className="w-full h-10 px-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all"
                    value={editForm.time}
                    onChange={e => setEditForm(f => ({ ...f, time: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Department</label>
                <input
                  className="w-full h-10 px-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all"
                  value={editForm.department}
                  onChange={e => setEditForm(f => ({ ...f, department: e.target.value }))}
                  placeholder="e.g. General, Cardiology..."
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</label>
                <select
                  className="w-full h-10 px-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all"
                  value={editForm.status}
                  onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
