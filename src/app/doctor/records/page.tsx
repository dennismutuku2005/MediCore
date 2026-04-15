'use client';
import React, { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import Badge from '@/components/ui/Badge';
import { SearchIcon } from '@/components/ui/Icons';
import { doctorNotes } from '@/lib/mockData';

export default function DoctorRecords() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  const filtered = doctorNotes.filter(n => n.patient.toLowerCase().includes(search.toLowerCase()));

  if (loading) return (
    <div className="space-y-6">
       <SkeletonLoader width={350} height={40} />
       <div className="space-y-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-white border border-slate-200 rounded p-6 shadow-sm space-y-4">
            <div className="flex justify-between">
              <SkeletonLoader width="30%" height={20} />
              <SkeletonLoader width="15%" height={14} />
            </div>
            <SkeletonLoader height={60} />
            <SkeletonLoader width="20%" height={12} />
          </div>
        ))}
       </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="relative w-full sm:w-[350px]">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <SearchIcon size={16} />
          </div>
          <input 
            className="w-full h-10 pl-10 pr-4 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-all" 
            placeholder="Search clinical archives by patient or date..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map(n => (
          <div key={n.id} className="bg-white border border-slate-200 rounded p-6 shadow-sm hover:border-slate-300 transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center font-black text-slate-400">
                  {n.patient.charAt(0)}
                </div>
                <div>
                   <div className="text-base font-black text-slate-900 tracking-tight">{n.patient}</div>
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{n.id}</div>
                </div>
              </div>
              <Badge status="info">{n.date}</Badge>
            </div>
            
            <div className="pl-13">
               <div className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50/50 p-4 rounded border border-slate-100">
                 {n.content}
               </div>
               <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Physician: <span className="text-blue-600">{n.doctor}</span>
               </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-20 bg-slate-50/30 border border-dashed border-slate-200 rounded font-black text-slate-300 uppercase tracking-widest text-xs">
            No clinical records identified matching the query
          </div>
        )}
      </div>
    </div>
  );
}
