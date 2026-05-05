'use client';
import React, { useState, useEffect } from 'react';
import StatCard from '@/components/ui/StatCard';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import { PatientsIcon, CalendarIcon, ClipboardIcon, ActivityIcon } from '@/components/ui/Icons';
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
                <td className="px-5 py-3 text-sm font-bold text-slate-800">{app.patient}</td>
                <td className="px-5 py-3 text-sm text-slate-600 font-normal italic">{app.reason}</td>
                <td className="px-5 py-3 text-sm"><Badge status={app.status} /></td>
                <td className="px-5 py-3 text-sm">
                  <button className="px-3 h-8 bg-slate-100 border border-slate-200 rounded text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm">
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
    </div>
  );
}
