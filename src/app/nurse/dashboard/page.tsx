'use client';
import React, { useState, useEffect } from 'react';
import StatCard from '@/components/ui/StatCard';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import Badge from '@/components/ui/Badge';
import { BedIcon, PatientsIcon, ClipboardIcon, PillIcon } from '@/components/ui/Icons';

export default function NurseDashboard() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1000); return () => clearTimeout(t); }, []);

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">{[1,2,3,4].map(i => <SkeletonLoader key={i} height={100} />)}</div>
      <SkeletonLoader height={300} />
    </div>
  );

  return (
    <>
      <div className="bg-blue-600 text-white rounded-lg p-5 mb-6 shadow-md flex items-center justify-between" style={{ background: 'var(--primary)', color: '#fff', padding: '16px 20px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Maternity Ward A</h2>
          <p style={{ opacity: 0.8, fontSize: '13px' }}>Current Shift: Morning (07:00 - 15:00)</p>
        </div>
        <Badge status="completed">ACTIVE SHIFT</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard icon={<PatientsIcon size={20} />} label="Total Assigned" value="8" trend="Patients under care" trendUp />
        <StatCard icon={<BedIcon size={20} />} label="Available Beds" value="2" trend="Ward Capacity 10" trendUp={false} iconBg="var(--success-light)" iconColor="var(--success)" />
        <StatCard icon={<ClipboardIcon size={20} />} label="Pending Tasks" value="12" trend="4 High Priority" trendUp={false} iconBg="var(--warning-light)" iconColor="var(--warning)" />
        <StatCard icon={<PillIcon size={20} />} label="Medications Due" value="6" trend="1 overdue" trendUp={false} iconBg="var(--danger-light)" iconColor="var(--danger)" />
      </div>

      <div className="mb-6">
        <div className="text-base font-bold text-slate-800 mb-4">Shift Summary</div>
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            All vitals for Bed 01-08 have been recorded. Patient in Bed 04 reports slight discomfort; monitoring started. 
            Medication rounds for 10:00 AM are complete. Next handover in 4 hours.
          </p>
        </div>
      </div>
    </>
  );
}
