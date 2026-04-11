'use client';
import React, { useState, useEffect } from 'react';
import StatCard from '@/components/ui/StatCard';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { CalendarIcon, PillIcon, FlaskIcon } from '@/components/ui/Icons';
import { appointments } from '@/lib/mockData';

export default function PatientDashboard() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  if (loading) return (
    <div className="space-y-6">
      <SkeletonLoader height={120} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1,2,3].map(i => <SkeletonLoader key={i} height={100} />)}
      </div>
      <div className="grid grid-cols-3 gap-5">
        {[1,2,3].map(i => <SkeletonLoader key={i} height={120} />)}
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Good morning, Brian 👋</h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        <StatCard icon={<CalendarIcon size={22} />} label="Next Appointment" value="12 Apr" trend="at 09:00 AM" trendUp />
        <StatCard icon={<PillIcon size={22} />} label="Active Prescriptions" value={2} trend="Refill in 5 days" trendUp={false} iconBg="var(--success-light)" iconColor="var(--success)" />
        <StatCard icon={<FlaskIcon size={22} />} label="Pending Lab Results" value={1} trend="Malaria RDT" trendUp={false} iconBg="var(--warning-light)" iconColor="var(--warning)" />
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight mb-4">Next Appointment Details</h3>
        <div className="flex justify-between py-2 border-b border-slate-50 text-sm">
          <span className="font-semibold text-slate-400">Doctor</span>
          <span className="font-bold text-slate-800">Dr. Amina Odhiambo</span>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-50 text-sm">
          <span className="font-semibold text-slate-400">Department</span>
          <span className="font-bold text-slate-800">Internal Medicine</span>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-50 text-sm">
          <span className="font-semibold text-slate-400">Reason</span>
          <span className="font-bold text-slate-800">Follow-up</span>
        </div>
        <div className="mt-4 text-[13px] text-blue-600 font-bold cursor-pointer hover:text-blue-700 transition">View Details →</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="text-2xl font-extrabold text-slate-800">120/80</div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Last BP</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="text-2xl font-extrabold text-slate-800">70kg</div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Weight</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="text-2xl font-extrabold text-slate-800">72bpm</div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Heart Rate</div>
        </div>
      </div>
    </div>
  );
}
