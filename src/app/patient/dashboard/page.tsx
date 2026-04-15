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
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Salutations, Brian 👋</h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Personal Health Records Terminal • {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard icon={<CalendarIcon size={20} />} label="Next Consultation" value="12 APR" trend="At 09:00 AM" trendUp />
        <StatCard icon={<PillIcon size={20} />} label="Active Protocols" value={2} trend="Refill in 5d" trendUp={false} iconBg="#ecfdf5" iconColor="#047857" />
        <StatCard icon={<FlaskIcon size={20} />} label="Pending Diagnostics" value={1} trend="Malaria RDT" trendUp={false} iconBg="#fffbeb" iconColor="#b45309" />
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Next Appointment Details</h3>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="font-bold text-slate-400 uppercase tracking-tighter">Attending Professional</span>
            <span className="font-black text-slate-800 uppercase">Dr. Amina Odhiambo</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-bold text-slate-400 uppercase tracking-tighter">Clinical Department</span>
            <span className="font-bold text-slate-800">Internal Medicine</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-bold text-slate-400 uppercase tracking-tighter">Reason for Encounter</span>
            <span className="font-bold text-slate-800">Follow-up Analysis</span>
          </div>
          <div className="pt-4 flex justify-end">
            <button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition underline underline-offset-4">Comprehensive Data Access →</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 rounded p-6 text-center shadow-sm">
          <div className="text-xl font-black text-slate-900">120/80</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Latest Pressure</div>
        </div>
        <div className="bg-white border border-slate-200 rounded p-6 text-center shadow-sm">
          <div className="text-xl font-black text-slate-900">70.4 KG</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Current Mass</div>
        </div>
        <div className="bg-white border border-slate-200 rounded p-6 text-center shadow-sm">
          <div className="text-xl font-black text-slate-900">72 BPM</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Pulse Rate</div>
        </div>
      </div>
    </div>
  );
}
