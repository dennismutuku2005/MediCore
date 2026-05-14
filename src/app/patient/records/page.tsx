'use client';
import React, { useState, useEffect } from 'react';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { apiFetch } from '@/lib/api';
import authService from '@/lib/auth';

export default function PatientRecords() {
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<any[]>([]);
  const user = authService.getUser();

  useEffect(() => {
    async function fetchNotes() {
      try {
        const patientsRes = await apiFetch('/patients');
        const currentPatient = patientsRes.data?.find((p: any) => p.user?.username === user?.username);
        
        if (currentPatient) {
          const res = await apiFetch(`/doctor/notes?patientId=${currentPatient.id}`);
          if (res.status === 'success') {
            // Filter out private notes for safety
            const publicNotes = (res.data || []).filter((n: any) => !n.isPrivate);
            setNotes(publicNotes);
          }
        }
      } catch (error) {
        console.error("Failed to fetch clinical records:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNotes();
  }, [user?.username]);

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
    <div className="flex flex-col gap-6 py-3 animate-in fade-in duration-500">
      <div>
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Clinical Chronology</h2>
        <p className="text-[10px] text-slate-400 mt-1">Audit of medical progression and provider notes</p>
      </div>

      {notes.map(n => (
        <div key={n.id} className="relative border-l-2 border-blue-100 pl-5 ml-2">
          <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white shadow-sm" />
          <div className="text-[10px] text-slate-400 mb-2">{new Date(n.createdAt || n.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          <div className="bg-white border border-slate-200 rounded p-5 shadow-sm hover:border-blue-200 transition-all">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-black text-slate-800 text-sm tracking-tight">{n.doctorName || n.doctor || 'Clinical Provider'}</div>
                <div className="text-[10px] text-blue-600 mt-0.5">Clinical progress note</div>
              </div>
              <div className="text-[9px] text-slate-300">Verified record</div>
            </div>
            <div className="text-sm text-slate-600 leading-relaxed font-medium">{n.content}</div>
          </div>
        </div>
      ))}

      {notes.length === 0 && (
        <div className="p-16 text-center bg-white border border-slate-200 border-dashed rounded-lg">
          <div className="text-sm text-slate-400">No clinical notes recorded</div>
          <p className="text-xs text-slate-400 mt-2">Your clinical history will populate here as providers update your file.</p>
        </div>
      )}
    </div>
  );
}
