'use client';
import React, { useState, useEffect } from 'react';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { apiFetch } from '@/lib/api';

export default function NurseActivity() {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await apiFetch('/activities');
        if (res.status === 'success') {
          setActivities(res.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const colors: Record<string, string> = { 
    vitals: '#3b82f6', 
    meds: '#10b981', 
    task: '#f59e0b', 
    general: '#64748b' 
  };

  const grouped = activities.reduce<Record<string, any[]>>((acc, a) => {
    const date = a.timestamp ? new Date(a.timestamp).toLocaleDateString() : 'Recent';
    (acc[date] = acc[date] || []).push(a);
    return acc;
  }, {});

  if (loading) return (
    <div className="space-y-8">
      {[1,2].map(i => (
        <div key={i} className="space-y-4">
          <SkeletonLoader width={100} height={20} />
          <SkeletonLoader height={60} count={3} className="rounded-lg" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Sector Audit Protocol</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Chronological log of ward activities</p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-200">
            Real-time Monitoring
          </div>
        </div>
      </div>

      <div className="relative pl-8 border-l-2 border-slate-100 space-y-10">
        {Object.entries(grouped).map(([date, acts]) => (
          <div key={date} className="relative">
            <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-white border-4 border-blue-600 z-10" />
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">{date}</h4>
            
            <div className="space-y-4">
              {acts.map((a: any) => (
                <div key={a.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group">
                  <div 
                    className="w-2 h-10 rounded-full shrink-0" 
                    style={{ background: colors[a.icon] || colors.general }} 
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{a.description}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{a.patient || 'Sector Global'}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-200" />
                      <span className="text-[10px] font-bold text-blue-500 uppercase">{a.timestamp ? new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}</span>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                     <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Verified Log Entry</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <div className="p-20 text-center border-2 border-dashed border-slate-100 rounded-2xl opacity-30">
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">No audit entries identified in this cycle</div>
          </div>
        )}
      </div>
    </div>
  );
}
