'use client';
import React, { useState, useEffect } from 'react';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { doctorNotes } from '@/lib/mockData';

export default function PatientRecords() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  // Filter out private notes for safety
  const publicNotes = doctorNotes.filter(n => n.patientId === 'P001' && !n.isPrivate);

  if (loading) return (
    <div className="space-y-6">
      {[1,2,3].map(i => (
        <div key={i} className="flex gap-4">
          <SkeletonLoader height={16} width={16} className="rounded-full mt-1 shrink-0" />
          <div className="space-y-2 flex-1">
            <SkeletonLoader height={12} width={100} />
            <SkeletonLoader height={80} />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-5 py-3 animate-in fade-in duration-500">
      {publicNotes.map(n => (
        <div key={n.id} className="relative border-l-2 border-blue-100 pl-5 ml-2">
          <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white shadow-sm" />
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{n.date}</div>
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <div className="font-bold text-slate-800 mb-0.5">{n.doctor}</div>
            <div className="text-[11px] font-extrabold text-blue-600 uppercase tracking-widest mb-2">Clinical Note</div>
            <div className="text-sm text-slate-600 leading-relaxed">{n.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
