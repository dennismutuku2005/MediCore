'use client';
import React, { useState, useEffect } from 'react';
import StatCard from '@/components/ui/StatCard';
import BarChart from '@/components/charts/BarChart';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import { PersonIcon, CalendarIcon, BedIcon, ActivityIcon } from '@/components/ui/Icons';
import { appointments } from '@/lib/mockData';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1000); return () => clearTimeout(t); }, []);

  const monthlyAdmissions = [
    { label: 'Jan', value: 45 }, { label: 'Feb', value: 52 }, { label: 'Mar', value: 48 },
    { label: 'Apr', value: 61 }, { label: 'May', value: 55 }, { label: 'Jun', value: 67 }
  ];

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1,2,3,4].map(i => <SkeletonLoader key={i} height={100} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2"><SkeletonLoader height={300} /></div>
        <div className="bg-white border border-slate-200 rounded p-5 space-y-4">
          <SkeletonLoader height={20} width="60%" />
          {[1,2,3,4].map(i => <SkeletonLoader key={i} height={40} />)}
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded p-5 space-y-3">
        <SkeletonLoader height={24} width={200} />
        {[1,2,3,4,5].map(i => <SkeletonLoader key={i} height={42} />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={<PersonIcon size={20} />} label="Total Patients" value="1,284" trend="12% vs last month" trendUp />
        <StatCard icon={<CalendarIcon size={20} />} label="Appointments" value={appointments.length} trend="8 pending today" trendUp={false} iconBg="rgba(255, 171, 0, 0.1)" iconColor="#ffab00" />
        <StatCard icon={<BedIcon size={20} />} label="Ward Occupancy" value="84%" trend="4 beds available" trendUp iconBg="rgba(54, 179, 126, 0.1)" iconColor="#36b37e" />
        <StatCard icon={<ActivityIcon size={20} />} label="Weekly Revenue" value="KES 452K" trend="New record" trendUp iconBg="rgba(0, 82, 204, 0.1)" iconColor="#0052cc" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-800">Admissions Overview</h3>
            <span className="text-[11px] font-semibold text-slate-400">LAST 6 MONTHS</span>
          </div>
          <div style={{ height: 200 }}><BarChart data={monthlyAdmissions} /></div>
        </div>

        <div className="bg-white border border-slate-200 rounded p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { label: 'Dr. Odhiambo', sub: 'Updated record for Brian Mwangi', time: '10m ago' },
              { label: 'Nurse Jane', sub: 'Assigned Bed 04 to Sarah Juma', time: '25m ago' },
              { label: 'Lab System', sub: 'CBC Results ready for Patient P002', time: '1h ago' },
              { label: 'Admin', sub: 'Updated shift schedule for Pediatrics', time: '2h ago' },
            ].map((act, i) => (
              <div key={i} className="flex gap-3 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-bold text-slate-800 leading-none">{act.label}</div>
                  <div className="text-[12px] text-slate-500 mt-1">{act.sub}</div>
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">{act.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Department Summary</h3>
          <Badge status="active">LIVE</Badge>
        </div>
        <Table headers={['Patient Name', 'Doctor', 'Department', 'Status', 'Time']}>
          {appointments.slice(0, 5).map(app => (
            <tr key={app.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-5 py-3 text-sm font-bold text-slate-800">{app.patient}</td>
              <td className="px-5 py-3 text-sm text-slate-600">{app.doctor}</td>
              <td className="px-5 py-3 text-sm text-slate-600">{app.department}</td>
              <td className="px-5 py-3 text-sm"><Badge status={app.status} /></td>
              <td className="px-5 py-3 text-sm text-slate-400 font-medium">{app.time}</td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
}
