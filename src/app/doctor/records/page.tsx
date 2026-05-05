'use client';
import React, { useState, useEffect } from 'react';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import Badge from '@/components/ui/Badge';
import { SearchIcon } from '@/components/ui/Icons';
import { apiFetch } from '@/lib/api';
import authService from '@/lib/auth';

export default function DoctorRecords() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [records, setRecords] = useState<any[]>([]);
  const user = authService.getUser();

  const fetchRecords = async () => {
    try {
      const res = await apiFetch(`/doctor/notes?doctorId=${user?.id || ''}`);
      if (res.status === 'success') {
        setRecords(res.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch medical records:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user?.id]);

  const filtered = records.filter(n => 
    (n.patientName || n.patient || '').toLowerCase().includes(search.toLowerCase()) ||
    (n.content || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="space-y-6">
       <SkeletonLoader width={350} height={40} className="rounded" />
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
        <div>
          <h3 className="text-base font-black text-slate-900 tracking-tight">Clinical Archive Registry</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Audit trail of historical patient encounters</p>
        </div>
        <div className="relative w-full sm:w-[350px]">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <SearchIcon size={16} />
          </div>
          <input 
            className="w-full h-10 pl-10 pr-4 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-all shadow-sm" 
            placeholder="Search clinical archives by patient or date..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map(n => (
          <div key={n.id} className="bg-white border border-slate-200 rounded p-6 shadow-sm hover:border-blue-200 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 opacity-10 rotate-45 translate-x-12 -translate-y-12" />
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-blue-600 shadow-inner">
                  {(n.patientName || n.patient || 'P').charAt(0)}
                </div>
                <div>
                   <div className="text-base font-black text-slate-900 tracking-tight">{n.patientName || n.patient}</div>
                   <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Archive ID: #{n.id}</div>
                </div>
              </div>
              <Badge status="info">{new Date(n.createdAt || n.date).toLocaleDateString()}</Badge>
            </div>
            
            <div className="pl-13">
               <div className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50/50 p-4 rounded border border-slate-100 group-hover:bg-white transition-all">
                 {n.content}
               </div>
               <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Authentication Source: <span className="text-blue-600 font-black">{n.doctorName || n.doctor || 'Clinical Provider'}</span>
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
