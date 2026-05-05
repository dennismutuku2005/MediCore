'use client';
import React, { useState, useEffect } from 'react';
import Badge from '@/components/ui/Badge';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { apiFetch } from '@/lib/api';
import authService from '@/lib/auth';

export default function PatientPrescriptions() {
  const [loading, setLoading] = useState(true);
  const [meds, setMeds] = useState<any[]>([]);
  const user = authService.getUser();

  useEffect(() => {
    async function fetchMeds() {
      try {
        if (!user?.id) return;
        const res = await apiFetch(`/patient/prescriptions?patientId=${user.id}`);
        if (res.status === 'success') {
          setMeds(res.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch prescriptions:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMeds();
  }, [user?.id]);

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1,2,3].map(i => <SkeletonLoader key={i} height={180} className="rounded-xl" />)}
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Pharmacological Registry</h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Active medications and prescription protocols</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meds.map(rx => (
          <div key={rx.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-blue-300 transition-all group relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${rx.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            
            <div className="flex justify-between items-start mb-4">
              <div className="font-black text-slate-900 tracking-tight text-lg">{rx.medication}</div>
              <Badge status={rx.status} />
            </div>

            <div className="space-y-3">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Dosage Protocol</span>
                <span className="text-sm font-bold text-slate-700">{rx.dosage}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Temporal Frequency</span>
                <span className="text-sm font-bold text-slate-700">{rx.frequency}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Clinical Instructions</span>
                <span className="text-xs text-slate-500 italic font-medium leading-relaxed">{rx.instructions}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
              <div className="text-[10px] text-slate-400 font-bold">
                DR. {rx.doctorName || rx.doctor || 'UNSPECIFIED'}
              </div>
              <div className="text-[10px] text-slate-300 font-mono italic">
                {rx.startDate}
              </div>
            </div>
          </div>
        ))}
        
        {meds.length === 0 && (
          <div className="col-span-full p-20 text-center bg-white border border-slate-200 border-dashed rounded-xl">
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">No active pharmacological protocols found</div>
            <p className="text-xs text-slate-400 mt-2">Any prescribed medications will appear in this registry.</p>
          </div>
        )}
      </div>
    </div>
  );
}
