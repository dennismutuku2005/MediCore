'use client';
import React, { useState, useEffect } from 'react';
import StatCard from '@/components/ui/StatCard';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { PatientsIcon, CalendarIcon, ClipboardIcon, ActivityIcon, ClockIcon } from '@/components/ui/Icons';
import { apiFetch } from '@/lib/api';
import authService from '@/lib/auth';

export default function DoctorDashboard() {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    patientWorkload: 0,
    todaySessions: 0,
    pendingNotes: 0,
    labReviews: 0
  });

  // Patient file modal state
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [patientFile, setPatientFile] = useState<any>(null);
  const [fileLoading, setFileLoading] = useState(false);

  const user = authService.getUser();

  useEffect(() => {
    async function fetchData() {
      try {
        const docId = user?.id || '';
        const [apptsData, patientsData, notesData, labData] = await Promise.all([
          apiFetch(`/doctor/appointments?doctorId=${docId}`),
          apiFetch(`/doctor/patients?doctorId=${docId}`),
          apiFetch(`/doctor/notes?doctorId=${docId}`),
          apiFetch(`/doctor/lab-requests?doctorId=${docId}`)
        ]);

        if (apptsData.status === 'success') {
          setAppointments(apptsData.data || []);
          setStats(prev => ({ ...prev, todaySessions: (apptsData.data || []).length }));
        }
        if (patientsData.status === 'success') {
          setStats(prev => ({ ...prev, patientWorkload: (patientsData.data || []).length }));
        }
        if (notesData.status === 'success') {
          setStats(prev => ({ ...prev, pendingNotes: (notesData.data || []).length }));
        }
        if (labData.status === 'success') {
          setStats(prev => ({ ...prev, labReviews: (labData.data || []).filter((l: any) => l.status === 'pending').length }));
        }
      } catch (error) {
        console.error("Failed to fetch doctor dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user?.id]);

  // Open patient file modal and fetch patient + notes
  const handleAccessFile = async (app: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedApp(app);
    setPatientFile(null);
    setFileLoading(true);
    try {
      // patient is a nested object: { id, name, ... }
      const patientId = app.patient?.id || app.patientId;
      const notesRes = await apiFetch(`/doctor/notes?doctorId=${user?.id || ''}`);
      const notes = notesRes?.status === 'success' ? (notesRes.data || []) : [];

      // Match notes by nested patient.id
      const patientNotes = notes.filter(
        (n: any) => n.patient?.id === patientId
      );

      // patient object already comes from appointment — use it directly
      setPatientFile({ patient: app.patient, notes: patientNotes });
    } catch (err) {
      console.error('Failed to load patient file:', err);
      setPatientFile({ patient: null, notes: [] });
    } finally {
      setFileLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedApp(null);
    setPatientFile(null);
  };

  if (loading) return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-white border border-slate-200 rounded p-5 shadow-sm space-y-3">
             <div className="flex items-center justify-between">
               <SkeletonLoader variant="circular" width={32} height={32} />
               <SkeletonLoader width={60} height={16} />
             </div>
             <SkeletonLoader width="60%" height={24} />
             <SkeletonLoader width="40%" height={12} />
          </div>
        ))}
      </div>
      <div className="bg-white border border-slate-200 rounded p-6 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <SkeletonLoader width={200} height={24} />
          <SkeletonLoader width={80} height={24} />
        </div>
        <div className="space-y-4">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0">
               <SkeletonLoader variant="circular" width={40} height={40} />
               <div className="flex-1 space-y-2">
                 <SkeletonLoader width="30%" height={16} />
                 <SkeletonLoader width="50%" height={12} />
               </div>
               <SkeletonLoader width={80} height={32} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // patient is a nested object from the API
  const patientName = selectedApp?.patient?.name || 'Patient';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={<PatientsIcon size={20} />} label="Patient Workload" value={stats.patientWorkload} trend="active cases" trendUp />
        <StatCard icon={<CalendarIcon size={20} />} label="Today's Sessions" value={stats.todaySessions} trend="Clinical queue" trendUp iconBg="#fef3c7" iconColor="#d97706" />
        <StatCard icon={<ClipboardIcon size={20} />} label="Pending Notes" value={stats.pendingNotes} trend="Action required" trendUp={false} iconBg="#fee2e2" iconColor="#dc2626" />
        <StatCard icon={<ActivityIcon size={20} />} label="Lab Reviews" value={stats.labReviews} trend="New results" trendUp iconBg="#ecfdf5" iconColor="#059669" />
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Upcoming Clinical Schedule</h3>
          <Badge status="active">REAL-TIME</Badge>
        </div>
        <div className="overflow-x-auto">
          <Table headers={['Time-Slot', 'Patient Identity', 'Clinical Indication', 'Priority Status', 'Operational Action']}>
            {appointments.map((app: any) => (
              <tr key={app.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 font-medium">
                <td className="px-5 py-3 text-sm font-black text-blue-600 tracking-tight italic">{app.time || app.appointmentTime}</td>
                <td className="px-5 py-3 text-sm font-bold text-slate-800">{app.patient?.name || app.patient || 'Unknown'}</td>
                <td className="px-5 py-3 text-sm text-slate-600 font-normal italic">{app.reason}</td>
                <td className="px-5 py-3 text-sm"><Badge status={app.status} /></td>
                <td className="px-5 py-3 text-sm">
                  <button
                    onClick={(e) => handleAccessFile(app, e)}
                    className="px-3 h-8 bg-slate-100 border border-slate-200 rounded text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                  >
                    Access File
                  </button>
                </td>
              </tr>
            ))}
          </Table>
          {appointments.length === 0 && (
            <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              No appointments scheduled for this session
            </div>
          )}
        </div>
      </div>

      {/* Patient File Modal */}
      <Modal
        open={!!selectedApp}
        onClose={closeModal}
        title={`Clinical File — ${patientName}`}
        footer={<Button variant="secondary" onClick={closeModal}>Close File</Button>}
      >
        {fileLoading ? (
          <div className="space-y-4 py-4">
            <SkeletonLoader width="40%" height={20} />
            <SkeletonLoader height={60} />
            <SkeletonLoader width="60%" height={16} />
            <SkeletonLoader height={80} />
          </div>
        ) : (
          <div className="space-y-6 py-2 animate-in fade-in duration-300">

            {/* Appointment Info */}
            <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded">
              <div className="w-12 h-12 rounded bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow">
                {patientName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-base font-black text-slate-900 tracking-tight">{patientName}</div>
                <div className="flex items-center gap-2 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <ClockIcon size={12} />
                  <span>{selectedApp?.time || selectedApp?.appointmentTime || '—'}</span>
                  <span>•</span>
                  <span>{selectedApp?.reason || 'No indication recorded'}</span>
                </div>
              </div>
              <div className="ml-auto">
                <Badge status={selectedApp?.status} />
              </div>
            </div>

            {/* Patient Demographics */}
            {patientFile?.patient ? (
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-3">Patient Demographics</div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Gender', value: patientFile.patient.gender },
                    { label: 'Blood Type', value: patientFile.patient.bloodType || 'N/A' },
                    { label: 'Status', value: patientFile.patient.status },
                    { label: 'Patient ID', value: `#${patientFile.patient.id}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-slate-50 p-3 rounded border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">{label}</div>
                      <div className="text-sm font-black text-slate-800 mt-0.5">{value || '—'}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-100 rounded text-xs font-bold text-amber-600 uppercase tracking-widest text-center">
                Patient demographics not found in assigned roster
              </div>
            )}

            {/* Clinical Notes */}
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-3">
                Clinical Notes ({patientFile?.notes?.length || 0})
              </div>
              {patientFile?.notes?.length > 0 ? (
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {patientFile.notes.map((note: any) => (
                    <div key={note.id} className="bg-slate-50 border border-slate-100 rounded p-3">
                      <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">
                        {note.noteDate
                          ? new Date(note.noteDate).toLocaleDateString()
                          : new Date(note.createdAt || note.date || Date.now()).toLocaleDateString()
                        } — Note #{note.id}
                      </div>
                      <div className="text-sm text-slate-700 leading-relaxed font-medium">{note.content}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-slate-50/60 border border-dashed border-slate-200 rounded text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                  No clinical notes on record for this patient
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
