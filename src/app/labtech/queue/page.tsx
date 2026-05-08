'use client';
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { SearchIcon } from '@/components/ui/Icons';

export default function LabtechQueue() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await apiFetch('/labtech/queue');
        if (res.status === 'success') {
          setList((res.data || []).filter((t: any) => t.status === 'pending'));
        }
      } catch (error) {
        console.error("Failed to fetch lab queue:", error);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Accessioning Terminal</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Diagnostic investigations awaiting processing</p>
        </div>
        <div className="relative w-full sm:w-[320px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <SearchIcon size={14} />
          </span>
          <input 
            className="w-full h-9 pl-10 pr-4 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-all placeholder:text-slate-400"
            placeholder="Search queue by patient, ID or test..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <Table headers={['Protocol Date', 'Accession ID', 'Patient Identity', 'Diagnostic Type', 'Urgency', 'Ordering Physician', 'Operations']}>
          {list
            .filter(t => {
              const q = search.toLowerCase();
              return t.patient.toLowerCase().includes(q) || 
                     t.testType.toLowerCase().includes(q) || 
                     String(t.id).includes(q);
            })
            .map(t => (
            <tr key={t.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 font-medium">
              <td className="px-5 py-4 text-sm text-slate-400 font-mono italic">{t.dateRequested}</td>
              <td className="px-5 py-4 text-sm font-black text-slate-900 tracking-tighter">#{t.id}</td>
              <td className="px-5 py-4 text-sm font-bold text-slate-800">{t.patient}</td>
              <td className="px-5 py-4 text-sm text-blue-600 font-black">{t.testType}</td>
              <td className="px-5 py-4"><Badge status={t.urgency} /></td>
              <td className="px-5 py-4 text-sm text-slate-500 font-bold">{t.doctor}</td>
              <td className="px-5 py-4">
                <Button 
                  className="h-8 px-4 text-[10px] font-black uppercase tracking-widest shadow-sm"
                  onClick={() => router.push(`/labtech/upload?id=${t.id}`)}
                >
                  Process Sample
                </Button>
              </td>
            </tr>
          ))}
        </Table>
        {list.filter(t => {
          const q = search.toLowerCase();
          return t.patient.toLowerCase().includes(q) || t.testType.toLowerCase().includes(q) || String(t.id).includes(q);
        }).length === 0 && (
          <div className="p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            {search ? `No investigations match "${search}"` : 'The diagnostic queue is currently vacant'}
          </div>
        )}
      </div>
    </div>
  );
}
