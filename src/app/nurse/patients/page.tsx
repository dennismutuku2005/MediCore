'use client';
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { apiFetch } from '@/lib/api';

export default function NursePatients() {
  const [loading, setLoading] = useState(true);
  const [patientsList, setPatientsList] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await apiFetch('/patients');
        if (res.status === 'success') {
          setPatientsList(res.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch patients:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <SkeletonLoader height={52} count={6} />;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-blue-600 text-white rounded-xl p-5 mb-8 shadow-md flex items-center justify-between relative overflow-hidden">
        <div className="relative z-10 font-bold text-sm tracking-tight italic">
          ℹ️ READ-ONLY CENSUS: Patient registry management is restricted to administrative staff
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rotate-45 translate-x-16 -translate-y-16" />
      </div>
      
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <Table headers={['System ID', 'Patient Identity', 'Age/Gender', 'Primary Indication', 'Attending Clinician', 'Ward Sector', 'Status']}>
          {patientsList.map(p => (
            <tr key={p.id} className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 font-medium">
              <td className="px-6 py-4 text-[10px] font-mono text-slate-400 italic">#{p.id}</td>
              <td className="px-6 py-4 text-sm font-bold text-slate-800">{p.name}</td>
              <td className="px-6 py-4 text-xs text-slate-600">{p.age || 'N/A'}Y / {p.gender}</td>
              <td className="px-6 py-4 text-sm text-slate-600 font-normal italic">{p.diagnosis || 'Observation'}</td>
              <td className="px-6 py-4 text-sm text-slate-700 font-bold">{p.assignedDoctor?.name || 'Unassigned'}</td>
              <td className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.ward?.name || 'General'}</td>
              <td className="px-6 py-4"><Badge status={p.status} /></td>
            </tr>
          ))}
        </Table>
        {patientsList.length === 0 && (
          <div className="p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            Zero entities detected in ward census registry
          </div>
        )}
      </div>
    </div>
  );
}
