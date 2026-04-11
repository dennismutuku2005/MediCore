'use client';
import React, { useState, useEffect } from 'react';
import StatCard from '@/components/ui/StatCard';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import { FlaskIcon, HourglassIcon, CheckCircleIcon, CrossMedicalIcon } from '@/components/ui/Icons';
import { labTests } from '@/lib/mockData';

export default function LabtechDashboard() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  if (loading) return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">{[1,2,3,4].map(i => <SkeletonLoader key={i} height={100} />)}</div>
      <SkeletonLoader height={52} count={6} />
    </>
  );

  const pendingCount = labTests.filter(t => t.status === 'pending').length;
  const completedCount = labTests.filter(t => t.status === 'completed').length;
  const urgentCount = labTests.filter(t => t.urgency === 'STAT' && t.status === 'pending').length;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard icon={<FlaskIcon size={22} />} label="Total Tests Today" value={labTests.length} trend="+12% vs yesterday" trendUp />
        <StatCard icon={<HourglassIcon size={22} />} label="Pending" value={pendingCount} trend={`${urgentCount} STAT pending`} trendUp={false} iconBg="var(--warning-light)" iconColor="var(--warning)" />
        <StatCard icon={<CheckCircleIcon size={22} />} label="Completed" value={completedCount} trend="+8 completed today" trendUp iconBg="var(--success-light)" iconColor="var(--success)" />
        <StatCard icon={<CrossMedicalIcon size={22} />} label="Low Inventory" value={3} trend="Reorder alerts" trendUp={false} iconBg="var(--danger-light)" iconColor="var(--danger)" />
      </div>

      <div className="text-sm font-bold text-slate-800 uppercase tracking-tight mb-2">
        <h3 className="text-base font-bold text-slate-800 mb-4">High Priority Tests</h3>
      </div>
      
      <Table headers={['ID', 'Patient', 'Test Type', 'Urgency', 'Requested By', 'Status']}>
        {labTests.filter(t => t.urgency === 'STAT').map(t => (
          <tr key={t.id}>
            <td>{t.id}</td>
            <td><strong>{t.patient}</strong></td>
            <td>{t.testType}</td>
            <td><Badge status={t.urgency} /></td>
            <td>{t.doctor}</td>
            <td><Badge status={t.status} /></td>
          </tr>
        ))}
      </Table>
    </>
  );
}
