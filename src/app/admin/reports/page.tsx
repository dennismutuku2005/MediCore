'use client';
import React, { useState, useEffect } from 'react';
import StatCard from '@/components/ui/StatCard';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { DollarIcon, PatientsIcon, CheckCircleIcon, FlaskIcon, DownloadIcon } from '@/components/ui/Icons';

export default function AdminReports() {
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  const reports = [
    { name: 'Monthly Patient Report', type: 'Patients', date: '2025-04-01', by: 'Admin' },
    { name: 'Revenue Summary Q1', type: 'Financial', date: '2025-03-31', by: 'Admin' },
    { name: 'Lab Utilization Report', type: 'Laboratory', date: '2025-04-05', by: 'Admin' },
    { name: 'Staff Attendance March', type: 'HR', date: '2025-04-02', by: 'Admin' },
  ];

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1,2,3,4].map(i => <SkeletonLoader key={i} height={100} />)}
      </div>
      <div className="bg-white border border-slate-200 rounded p-5 space-y-3 shadow-sm">
        <SkeletonLoader variant="row" count={4} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={<DollarIcon size={20} />} label="Gross Turnover" value="KES 840.5K" trend="+12.4% vs prev" trendUp />
        <StatCard icon={<PatientsIcon size={20} />} label="In-Patient Allotment" value={32} trend="+5.2% yield" trendUp iconBg="#f0f9ff" iconColor="#0369a1" />
        <StatCard icon={<CheckCircleIcon size={20} />} label="Resolved Cases" value={18} trend="+3.1% resolution" trendUp iconBg="#ecfdf5" iconColor="#047857" />
        <StatCard icon={<FlaskIcon size={20} />} label="Pending Diagnostics" value={7} trend="-2.4% duration" trendUp iconBg="#fffbeb" iconColor="#b45309" />
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-800">Generated Insights & Artifacts</h3>
          <Button onClick={() => setModalOpen(true)} className="h-9">Generate New Artifact</Button>
        </div>
        <Table headers={['Artifact Name', 'Domain', 'Timestamp', 'Originator', 'Action']}>
          {reports.map((r, i) => (
            <tr key={i} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 font-medium">
              <td className="px-5 py-3 text-sm font-bold text-slate-800">{r.name}</td>
              <td className="px-5 py-3 text-sm text-slate-500 font-bold uppercase tracking-widest text-[10px]">{r.type}</td>
              <td className="px-5 py-3 text-sm text-slate-600 font-mono">{r.date}</td>
              <td className="px-5 py-3 text-sm text-slate-400">{r.by}</td>
              <td className="px-5 py-3 text-sm text-right">
                <Button variant="secondary" className="h-8 px-3 text-[11px] font-bold">
                  <DownloadIcon size={12} /> 
                  <span className="ml-1">RETRIEVE</span>
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Generate Clinical Report"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Abort</Button><Button onClick={() => setModalOpen(false)}>Initialize Generation</Button></>}>
        <div className="space-y-4 py-2">
          <Input label="Domain Classification" options={[{value:'patients',label:'Patient Logistics'},{value:'financial',label:'Financial Audit'},{value:'lab',label:'Diagnostic Statistics'},{value:'hr',label:'Personnel Attendance'}]} />
          <div className="grid grid-cols-2 gap-4 pt-2">
            <Input label="Temporal Start" type="date" />
            <Input label="Temporal End" type="date" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
