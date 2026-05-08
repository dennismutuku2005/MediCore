'use client';
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { apiFetch } from '@/lib/api';
import Modal from '@/components/ui/Modal';
import { EyeIcon, SearchIcon, FileTextIcon, CalendarIcon, PersonIcon, ActivityIcon } from '@/components/ui/Icons';

export default function LabtechCompleted() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedReport, setSelectedReport] = useState<any>(null);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Verified Diagnostic Registry</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Archive of finalized investigations and results</p>
        </div>
        <div className="relative w-full sm:w-[320px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <SearchIcon size={14} />
          </span>
          <input 
            className="w-full h-9 pl-10 pr-4 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-all placeholder:text-slate-400"
            placeholder="Search by patient, ID or test..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <Table headers={['Protocol Date', 'Accession ID', 'Patient Identity', 'Diagnostic Type', 'Physician', 'Validated Finding', 'Operational Audit']}>
          {list
            .filter(t => {
              const q = search.toLowerCase();
              return t.patient.toLowerCase().includes(q) || 
                     t.testType.toLowerCase().includes(q) || 
                     String(t.id).includes(q);
            })
            .map(t => (
            <tr key={t.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 font-medium group">
              <td className="px-5 py-4 text-sm text-slate-400 font-mono italic">{t.dateRequested}</td>
              <td className="px-5 py-4 text-sm font-black text-slate-900 tracking-tighter">#{t.id}</td>
              <td className="px-5 py-4 text-sm font-bold text-slate-800">{t.patient}</td>
              <td className="px-5 py-4 text-sm text-blue-600 font-black">{t.testType}</td>
              <td className="px-5 py-4 text-sm text-slate-500 font-bold">{t.doctor}</td>
              <td className="px-5 py-4 text-sm text-slate-900 font-black truncate max-w-[200px] italic">{t.result}</td>
              <td className="px-5 py-4">
                <Button 
                  variant="secondary" 
                  className="h-8 px-3 text-[10px] font-black uppercase tracking-widest shadow-sm gap-1.5"
                  onClick={() => setSelectedReport(t)}
                >
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

      <Modal
        open={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title="Diagnostic Laboratory Report"
        footer={<Button onClick={() => setSelectedReport(null)}>Acknowledge & Close</Button>}
      >
        {selectedReport && (
          <div className="space-y-6 py-2">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <FileTextIcon size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{selectedReport.testType}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Accession: #{selectedReport.id}</p>
                </div>
              </div>
              <Badge status="success">VALIDATED</Badge>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <PersonIcon size={10} /> Patient Identity
                </p>
                <p className="text-sm font-bold text-slate-800">{selectedReport.patient}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <CalendarIcon size={10} /> Protocol Date
                </p>
                <p className="text-sm font-bold text-slate-800">{selectedReport.dateRequested}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <ActivityIcon size={10} /> Clinical Origin
                </p>
                <p className="text-sm font-bold text-slate-800">OPD Services</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <PersonIcon size={10} /> Attending Physician
                </p>
                <p className="text-sm font-bold text-slate-800">{selectedReport.doctor}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-5 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Validated Clinical Finding</p>
              <div className="text-sm text-slate-900 font-black italic leading-relaxed bg-white p-4 rounded border border-slate-200 shadow-inner">
                {selectedReport.result}
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 opacity-30 mt-4">
              <div className="h-px bg-slate-200 flex-1" />
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">End of Diagnostic Registry Entry</span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
