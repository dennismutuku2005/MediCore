'use client';
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';

export default function NurseMedications() {
  const [loading, setLoading] = useState(true);
  const [meds, setMeds] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const res = await apiFetch('/prescriptions');
      if (res.status === 'success') {
        setMeds(res.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch prescriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const markAdmin = async (id: number) => {
    try {
      const res = await apiFetch('/prescriptions/administer', {
        method: 'POST',
        body: JSON.stringify({ id })
      });
      if (res.status === 'success') {
        toast.success('Medication protocol successfully administered');
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to commit medication administration');
    }
  };

  if (loading) return <SkeletonLoader height={52} count={8} />;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-slate-900 text-white rounded-xl p-6 mb-8 shadow-lg flex items-center justify-between border-b-4 border-blue-600">
        <div>
          <h2 className="text-lg font-black uppercase tracking-widest">Pharmaceutical Administration Protocol</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Authorized Nurse Dispensing Interface</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Sector Status</div>
          <div className="text-sm font-bold">ALPHA-7 ACTIVE</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <Table headers={['Patient Identity', 'Pharmaceutical', 'Dosage Matrix', 'Interval', 'Administrative Status', 'Action']}>
          {meds.map(m => (
            <tr key={m.id} className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 font-medium">
              <td className="px-6 py-4 text-sm font-bold text-slate-800">{m.patient?.name || 'Unknown'}</td>
              <td className="px-6 py-4 text-sm font-black text-blue-600 tracking-tight italic">{m.medication}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{m.dosage}</td>
              <td className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.frequency}</td>
              <td className="px-6 py-4">
                {m.status === 'administered' ? (
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    DISPENSED
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-500 font-bold text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    PENDING
                  </div>
                )}
              </td>
              <td className="px-6 py-4">
                {m.status !== 'administered' && (
                  <button 
                    onClick={() => markAdmin(m.id)}
                    className="h-8 px-4 bg-blue-600 text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm shadow-blue-200"
                  >
                    Administer
                  </button>
                )}
              </td>
            </tr>
          ))}
        </Table>
        {meds.length === 0 && (
          <div className="p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            Zero pending pharmaceutical protocols identified
          </div>
        )}
      </div>
    </div>
  );
}
