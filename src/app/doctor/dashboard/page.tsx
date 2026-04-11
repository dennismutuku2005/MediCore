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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1,2,3,4].map(i => <SkeletonLoader key={i} height={100} />)}
      </div>
      <div className="bg-white border border-slate-200 rounded p-5 space-y-3">
        <SkeletonLoader height={24} width={200} />
        {[1,2,3,4,5].map(i => <SkeletonLoader key={i} height={42} />)}
      </div>
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard icon={<PatientsIcon size={20} />} label="Total Patients" value="42" trend="12 active cases" trendUp />
        <StatCard icon={<CalendarIcon size={20} />} label="Today Appointments" value={todayAppts.length} trend="Next: 10:30 AM" trendUp iconBg="var(--warning-light)" iconColor="var(--warning)" />
        <StatCard icon={<ClipboardIcon size={20} />} label="Pending Notes" value="3" trend="Finish by EOD" trendUp={false} iconBg="var(--danger-light)" iconColor="var(--danger)" />
        <StatCard icon={<ActivityIcon size={20} />} label="Lab Reviews" value="5" trend="New results ready" trendUp iconBg="var(--success-light)" iconColor="var(--success)" />
      </div>

      <div className="mb-6">
        <div className="text-base font-bold text-slate-800 mb-4">Upcoming Schedule <span style={{fontSize:12, fontWeight:400}}>Today, {new Date().toLocaleDateString()}</span></div>
        <Table headers={['Time', 'Patient', 'Reason', 'Status', 'Action']}>
          {todayAppts.map(app => (
            <tr key={app.id}>
              <td>{app.time}</td>
              <td><strong>{app.patient}</strong></td>
              <td>{app.reason}</td>
              <td><Badge status={app.status} /></td>
              <td>
                <button className="text-sm text-blue-600 font-bold hover:text-blue-800 transition-colors cursor-pointer">Open File</button>
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </>
  );
}
