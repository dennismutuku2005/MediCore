'use client';
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { apiFetch } from '@/lib/api';
import { EyeIcon } from '@/components/ui/Icons';

export default function LabtechCompleted() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await apiFetch('/labtech/queue');
        if (res.status === 'success') {
          setList((res.data || []).filter((t: any) => t.status === 'completed'));
        }
      } catch (error) {
        console.error("Failed to fetch completed tests:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return (
    <div className="space-y-3">
      <SkeletonLoader height={52} count={8} className="rounded" />
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6">
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Verified Diagnostic Registry</h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Archive of finalized investigations and results</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <Table headers={['Protocol Date', 'Accession ID', 'Patient Identity', 'Diagnostic Type', 'Physician', 'Validated Finding', 'Operational Audit']}>
          {list.map(t => (
            <tr key={t.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 font-medium">
              <td className="px-5 py-4 text-sm text-slate-400 font-mono italic">{t.dateRequested}</td>
              <td className="px-5 py-4 text-sm font-black text-slate-900 tracking-tighter">#{t.id}</td>
              <td className="px-5 py-4 text-sm font-bold text-slate-800">{t.patient}</td>
              <td className="px-5 py-4 text-sm text-blue-600 font-black">{t.testType}</td>
              <td className="px-5 py-4 text-sm text-slate-500 font-bold">{t.doctor}</td>
              <td className="px-5 py-4 text-sm text-slate-900 font-black truncate max-w-[200px] italic">{t.result}</td>
              <td className="px-5 py-4">
                <Button variant="secondary" className="h-8 px-3 text-[10px] font-black uppercase tracking-widest shadow-sm gap-1.5">
                  <EyeIcon size={12} /> View Report
                </Button>
              </td>
            </tr>
          ))}
        </Table>
        {list.length === 0 && (
          <div className="p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            No verified diagnostic artifacts identified
          </div>
        )}
      </div>
    </div>
  );
}
