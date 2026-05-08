'use client';
import React, { useState, useEffect } from 'react';
import StatCard from '@/components/ui/StatCard';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import Badge from '@/components/ui/Badge';
import { BedIcon, PatientsIcon, ClipboardIcon, PillIcon } from '@/components/ui/Icons';
import { apiFetch } from '@/lib/api';
import authService from '@/lib/auth';

export default function NurseDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAssigned: 0,
    availableBeds: 0,
    pendingTasks: 0,
    medsDue: 0
  });
  const user = authService.getUser();

  useEffect(() => {
    async function fetchData() {
      try {
        const [patientsRes, tasksRes, wardsRes] = await Promise.all([
          apiFetch('/patients'),
          apiFetch(`/nurse-tasks?nurseId=${user?.id || ''}`),
          apiFetch('/wards')
        ]);

        if (patientsRes.status === 'success' && tasksRes.status === 'success' && wardsRes.status === 'success') {
          const patients = patientsRes.data || [];
          const tasks = tasksRes.data || [];
          const wards = wardsRes.data || [];
          
          setStats({
            totalAssigned: patients.length,
            pendingTasks: tasks.filter((t: any) => t.column !== 'Completed').length,
            medsDue: tasks.filter((t: any) => t.description.toLowerCase().includes('med') || t.description.toLowerCase().includes('pill')).length,
            availableBeds: wards.reduce((acc: number, w: any) => acc + (Number(w.available) || (Number(w.capacity) - Number(w.occupied)) || 0), 0)
          });
        }
      } catch (error) {
        console.error("Failed to fetch nurse dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user?.id]);

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {[1,2,3,4].map(i => <SkeletonLoader key={i} height={120} className="rounded-xl shadow-sm" />)}
      </div>
      <SkeletonLoader height={200} className="rounded-xl shadow-sm" />
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 text-white rounded-xl p-10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rotate-12 translate-x-32 -translate-y-32" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.4em] mb-3 opacity-70">Operational Clinical Sector</div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">{user?.ward?.name || 'General Clinical Ward'}</h2>
            <div className="flex items-center gap-4">
               <p className="text-sm font-semibold text-blue-50">Provider: {user?.name || 'Assigned Nurse'}</p>
               <span className="w-1 h-1 rounded-full bg-blue-300 opacity-50" />
               <p className="text-sm font-semibold text-blue-50">Shift: ALPHA-ACTIVE</p>
            </div>
          </div>
          <Badge status="completed" className="bg-white/20 text-white border-white/40 border-2 backdrop-blur-md px-4 py-2 font-black tracking-widest">STATION ONLINE</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon={<PatientsIcon size={20} />} label="Assigned Census" value={stats.totalAssigned} trend="Patients under care" trendUp />
        <StatCard icon={<BedIcon size={20} />} label="Available Units" value={stats.availableBeds} trend="Sector Capacity 24" trendUp={false} iconBg="#ecfdf5" iconColor="#059669" />
        <StatCard icon={<ClipboardIcon size={20} />} label="Pending Protocols" value={stats.pendingTasks} trend="Action required" trendUp={false} iconBg="#fffbeb" iconColor="#d97706" />
        <StatCard icon={<PillIcon size={20} />} label="Medications Due" value={stats.medsDue} trend="Current window" trendUp={false} iconBg="#fee2e2" iconColor="#dc2626" />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <div className="mb-4 border-b border-slate-50 pb-4">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Shift Intelligence Summary</h3>
        </div>
        <div className="relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-600/20 rounded" />
          <p className="text-sm font-medium text-slate-600 leading-relaxed pl-6 italic">
            The clinical census is stable. Pulse checks for Bed 01-12 are serialized in the registry. 
            Patient in Bed 07 requires focused titration for neonatal monitoring. 
            Pharmaceutical distributions for the 10:00 protocol are verified. Next hand-over matrix generates in T-minus 120 minutes.
          </p>
        </div>
      </div>
    </div>
  );
}
