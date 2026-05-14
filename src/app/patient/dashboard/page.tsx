'use client';
import React, { useState, useEffect } from 'react';
import StatCard from '@/components/ui/StatCard';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { CalendarIcon, PillIcon, FlaskIcon } from '@/components/ui/Icons';
import { apiFetch } from '@/lib/api';
import authService from '@/lib/auth';

export default function PatientDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const user = authService.getUser();

  useEffect(() => {
    async function fetchData() {
      try {
        const patientsRes = await apiFetch('/patients');
        const currentPatient = patientsRes.data?.find((p: any) => p.user?.username === user?.username);
        
        if (currentPatient) {
          const res = await apiFetch(`/patient/dashboard?patientId=${currentPatient.id}`);
          if (res.status === 'success') {
            setData(res.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch patient dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user?.username]);

  if (loading) return (
    <div className="space-y-6">
      <SkeletonLoader height={100} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[1,2,3].map(i => <SkeletonLoader key={i} height={100} />)}
      </div>
      <div className="bg-white border border-slate-200 rounded p-5 space-y-3 shadow-sm">
        <SkeletonLoader height={20} width={150} />
        <SkeletonLoader variant="row" count={3} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white border border-slate-200 rounded p-6 shadow-sm">
        <h1 className="text-xl font-medium text-slate-900">Salutations, {user?.name || 'Patient'} 👋</h1>
        <p className="text-xs text-slate-400 mt-1">Personal health records terminal • {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard 
          icon={<CalendarIcon size={20} />} 
          label="Next Consultation" 
          value={data?.nextAppointment ? new Date(data.nextAppointment.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'None'} 
          trend={data?.nextAppointment ? `At ${data.nextAppointment.time}` : 'Schedule now'} 
          trendUp 
        />
        <StatCard icon={<PillIcon size={20} />} label="Active Protocols" value={data?.activePrescriptions || 0} trend="Refill required" trendUp={false} iconBg="#ecfdf5" iconColor="#047857" />
        <StatCard icon={<FlaskIcon size={20} />} label="Pending Diagnostics" value={data?.pendingLabs || 0} trend="Clinical reviews" trendUp={false} iconBg="#fffbeb" iconColor="#b45309" />
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-sm font-medium text-slate-800">Next Appointment Details</h3>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Attending Professional</span>
            <span className="text-slate-800">{data?.nextAppointment?.doctor || 'Unassigned'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Clinical Department</span>
            <span className="text-slate-800">{data?.nextAppointment?.department || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Reason for Encounter</span>
            <span className="text-slate-800">{data?.nextAppointment?.reason || 'Routine Checkup'}</span>
          </div>
          <div className="pt-4 flex justify-end">
            <button className="text-xs text-blue-600 hover:text-blue-700 transition underline underline-offset-4">Comprehensive Data Access →</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 rounded p-6 text-center shadow-sm">
          <div className="text-xl font-medium text-slate-900">{data?.bloodPressure || '120/80'}</div>
          <div className="text-[10px] text-slate-400 mt-2">Latest pressure</div>
        </div>
        <div className="bg-white border border-slate-200 rounded p-6 text-center shadow-sm">
          <div className="text-xl font-medium text-slate-900">{data?.weight || '0'} kg</div>
          <div className="text-[10px] text-slate-400 mt-2">Current mass</div>
        </div>
        <div className="bg-white border border-slate-200 rounded p-6 text-center shadow-sm">
          <div className="text-xl font-medium text-slate-900">{data?.heartRate || '0'} bpm</div>
          <div className="text-[10px] text-slate-400 mt-2">Pulse rate</div>
        </div>
      </div>
    </div>
  );
}
