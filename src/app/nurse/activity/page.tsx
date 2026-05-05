'use client';
import React, { useState, useEffect } from 'react';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { nurseActivities } from '@/lib/mockData';

export default function NurseActivity() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  const colors: Record<string, string> = { vitals: 'var(--warning)', meds: 'var(--success)', task: 'var(--info)', general: 'var(--primary)' };
  const grouped = nurseActivities.reduce<Record<string, typeof nurseActivities>>((acc, a) => {
    (acc[a.date] = acc[a.date] || []).push(a);
    return acc;
  }, {});

  if (loading) return <SkeletonLoader height={52} count={10} />;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0" style={{ width: 400 }}>
          <input type="date" className="w-full h-9 px-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none" style={{ width: '100%' }} />
          <input type="date" className="w-full h-9 px-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none" style={{ width: '100%' }} />
        </div>
      </div>
      {Object.entries(grouped).map(([date, acts]) => (
        <div key={date} style={{ marginBottom: 24 }}>
          <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>{date}</h4>
          <div className="relative">
            {acts.map(a => (
              <div key={a.id} className="flex gap-3 py-3 border-b border-slate-100 last:border-0">
                <div className="relative" style={{ background: colors[a.icon] }} />
                <span className="text-sm text-slate-600 leading-relaxed">{a.description}</span>
                <span className="relative">{a.timestamp.split(' ')[1]}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
