'use client';
import React, { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { SearchIcon } from '@/components/ui/Icons';
import { doctorNotes } from '@/lib/mockData';

export default function DoctorRecords() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  const filtered = doctorNotes.filter(n => n.patient.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <><SkeletonLoader height={40} style={{ marginBottom: 20 }} /><SkeletonLoader height={100} count={5} /></>;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="w-full h-9 px-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none">
          <span className="w-full h-9 px-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none"><SearchIcon size={15} /></span>
          <input className="w-full h-9 px-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none" placeholder="Search records..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="relative">
        {filtered.map(n => (
          <div key={n.id} className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm mb-4">
            <div className="relative" />
            <div className="relative">{n.date}</div>
            <div className="relative">
              <div className="relative">{n.doctor}</div>
              <div className="relative">{n.patient}</div>
              <div className="text-sm text-slate-600 leading-relaxed">{n.content}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
