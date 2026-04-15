'use client';
import React, { useState, useEffect } from 'react';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { wards } from '@/lib/mockData';

export default function AdminWards() {
  const [loading, setLoading] = useState(true);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [hoveredBed, setHoveredBed] = useState<string | null>(null);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {[1,2,3,4].map(i => <SkeletonLoader key={i} height={140} />)}
    </div>
  );

  const activeWard = wards.find(w => w.name === selectedWard);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {wards.map(w => (
          <div 
            key={w.name} 
            className={`cursor-pointer transition-all border p-5 rounded shadow-sm ${selectedWard === w.name ? 'border-blue-600 bg-blue-50/30 ring-1 ring-blue-600' : 'bg-white border-slate-200 hover:border-slate-300'}`}
            onClick={() => setSelectedWard(w.name === selectedWard ? null : w.name)}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{w.name}</span>
              <div className={`h-2 w-2 rounded-full ${(w.occupied / w.totalBeds) > 0.9 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-medium">Capacitance</span>
                <span className="text-slate-800 font-bold">{w.totalBeds} Units</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-medium">Allotted</span>
                <span className="text-slate-800 font-bold">{w.occupied}</span>
              </div>
              <div className="pt-2">
                <div className="h-1.5 w-full bg-slate-100 rounded overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${(w.occupied / w.totalBeds) > 0.9 ? 'bg-rose-500' : 'bg-blue-600'}`}
                    style={{ width: `${(w.occupied / w.totalBeds) * 100}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeWard ? (
        <div className="bg-white border border-slate-200 rounded p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">{activeWard.name} Interior Configuration</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time occupancy monitoring</p>
            </div>
            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-emerald-50 border border-emerald-200" /> Available</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-rose-50 border border-rose-200" /> Occupied</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-amber-50 border border-amber-200" /> Reserved</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {activeWard.beds.map(bed => {
              const statusColor = bed.status === 'available' ? 'emerald' : bed.status === 'occupied' ? 'rose' : 'amber';
              return (
                <div 
                  key={bed.number}
                  className={`relative p-4 rounded border text-center transition-all group cursor-help
                    ${bed.status === 'available' ? 'bg-emerald-50/30 border-emerald-100' : 
                      bed.status === 'occupied' ? 'bg-rose-50/30 border-rose-100' : 
                      'bg-amber-50/30 border-amber-100'}`}
                  onMouseEnter={() => setHoveredBed(bed.number)} 
                  onMouseLeave={() => setHoveredBed(null)}
                >
                  <div className={`text-xs font-bold mb-1 text-${statusColor}-600`}>UNIT</div>
                  <div className="text-sm font-black text-slate-800">{bed.number.split(/(\d+)/)[1]}</div>
                  
                  {hoveredBed === bed.number && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-900 text-white p-2.5 rounded text-[10px] leading-tight z-10 shadow-xl pointer-events-none">
                      <div className="font-bold border-b border-slate-700 pb-1.5 mb-1.5 uppercase tracking-widest text-[9px] text-slate-400">Unit Metadata</div>
                      <div className="flex justify-between mb-1"><span>Identity:</span><span className="text-white font-bold">{bed.number}</span></div>
                      <div className="flex justify-between mb-1"><span>Status:</span><span className={`text-${statusColor}-400 font-bold uppercase`}>{bed.status}</span></div>
                      {bed.patient && <div className="flex justify-between"><span>Allotted to:</span><span className="text-blue-400 font-bold">{bed.patient}</span></div>}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-10 border border-dashed border-slate-200 rounded-lg text-center bg-slate-50/30">
          <div className="text-sm text-slate-400 font-bold uppercase tracking-[0.2em]">Select a ward above to visualize bed allotement</div>
        </div>
      )}
    </div>
  );
}
