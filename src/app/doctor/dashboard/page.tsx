'use client';
import React, { useState, useEffect } from 'react';
import StatCard from '@/components/ui/StatCard';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import { PatientsIcon, CalendarIcon, ClipboardIcon, ActivityIcon } from '@/components/ui/Icons';
import { appointments } from '@/lib/mockData';

export default function DoctorDashboard() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1000); return () => clearTimeout(t); }, []);

  const todayAppts = appointments.filter(a => a.doctor === 'Dr. Amina Odhiambo');

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
        <StatCard icon={<PatientsIcon size={20} />} label="Patient Workload" value="42" trend="12 active" trendUp />
        <StatCard icon={<CalendarIcon size={20} />} label="Today's Sessions" value={todayAppts.length} trend="Next: 10:30 AM" trendUp iconBg="#fef3c7" iconColor="#d97706" />
        <StatCard icon={<ClipboardIcon size={20} />} label="Pending Notes" value="3" trend="Critical" trendUp={false} iconBg="#fee2e2" iconColor="#dc2626" />
        <StatCard icon={<ActivityIcon size={20} />} label="Lab Reviews" value="5" trend="New results" trendUp iconBg="#ecfdf5" iconColor="#059669" />
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Upcoming Clinical Schedule</h3>
          <Badge status="active">REAL-TIME</Badge>
        </div>
        <div className="overflow-x-auto">
          <Table headers={['Time', 'Patient Identity', 'Clinical Reason', 'Status', 'Action']}>
            {todayAppts.map(app => (
              <tr key={app.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 font-medium">
                <td className="px-5 py-3 text-sm font-bold text-blue-600 tracking-tight">{app.time}</td>
                <td className="px-5 py-3 text-sm font-bold text-slate-800">{app.patient}</td>
                <td className="px-5 py-3 text-sm text-slate-600 font-normal italic">{app.reason}</td>
                <td className="px-5 py-3 text-sm"><Badge status={app.status} /></td>
                <td className="px-5 py-3 text-sm">
                  <button className="px-3 h-8 bg-slate-100 border border-slate-200 rounded text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                    Access File
                  </button>
                </td>
              </tr>
            ))}
          </Table>
        </div>
      </div>
    </div>
  );
}
