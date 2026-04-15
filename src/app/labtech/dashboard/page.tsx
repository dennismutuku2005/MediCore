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
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1,2,3,4].map(i => <SkeletonLoader key={i} height={100} />)}
      </div>
      <div className="bg-white border border-slate-200 rounded p-5 space-y-3 shadow-sm">
        <SkeletonLoader variant="row" count={6} />
      </div>
    </div>
  );

  const pendingCount = labTests.filter(t => t.status === 'pending').length;
  const completedCount = labTests.filter(t => t.status === 'completed').length;
  const urgentCount = labTests.filter(t => t.urgency === 'STAT' && t.status === 'pending').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={<FlaskIcon size={20} />} label="Total Diagnostic Volume" value={labTests.length} trend="+12% yield" trendUp />
        <StatCard icon={<HourglassIcon size={20} />} label="Pending Analysis" value={pendingCount} trend={`${urgentCount} STAT pending`} trendUp={false} iconBg="#fffbeb" iconColor="#b45309" />
        <StatCard icon={<CheckCircleIcon size={20} />} label="Verified Results" value={completedCount} trend="+8 completed" trendUp iconBg="#ecfdf5" iconColor="#047857" />
        <StatCard icon={<CrossMedicalIcon size={20} />} label="Reagent Inventory" value="Stable" trend="No alerts" trendUp iconBg="#f0f9ff" iconColor="#0369a1" />
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">High-Urgency Diagnostic Queue</h3>
        </div>
        <Table headers={['Accession ID', 'Patient Identity', 'Protocol Type', 'Priority', 'Ordering Physician', 'Process Status']}>
          {labTests.filter(t => t.urgency === 'STAT').map(t => (
            <tr key={t.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 font-medium">
              <td className="px-5 py-3 text-sm font-mono text-slate-400">{t.id}</td>
              <td className="px-5 py-3 text-sm font-bold text-slate-800">{t.patient}</td>
              <td className="px-5 py-3 text-sm text-slate-800 font-black">{t.testType}</td>
              <td className="px-5 py-3 text-sm"><Badge status={t.urgency} /></td>
              <td className="px-5 py-3 text-sm text-slate-600 font-bold">{t.doctor}</td>
              <td className="px-5 py-3 text-sm"><Badge status={t.status} /></td>
            </tr>
          ))}
        </Table>
        {labTests.filter(t => t.urgency === 'STAT').length === 0 && (
          <div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            No STAT requests in queue
          </div>
        )}
      </div>
    </div>
  );
}
