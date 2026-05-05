'use client';
import React, { useState, useEffect } from 'react';
import StatCard from '@/components/ui/StatCard';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { apiFetch } from '@/lib/api';
import { DollarIcon, PatientsIcon, CheckCircleIcon, FlaskIcon, DownloadIcon } from '@/components/ui/Icons';
import { toast } from 'sonner';

export default function AdminReports() {
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({ domain: 'patients' });

  const fetchReportsData = async () => {
    try {
      const data = await apiFetch('/reports');
      if (data.status === 'success') {
        setStats(data.data);
        setArtifacts(data.artifacts || []);
      }
    } catch (e) {
      console.error("Fetch reports error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const result = await apiFetch('/reports', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      if (result.status === 'success') {
        toast.success("Report Generated", { description: "The institutional artifact is now available for retrieval." });
        fetchReportsData();
        setModalOpen(false);
      }
    } catch (e) {
        // Handled in apiFetch
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <SkeletonLoader key={i} height={100} className="rounded shadow-sm" />)}
      </div>
      <SkeletonLoader height={400} className="rounded shadow-sm" />
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          icon={<DollarIcon size={20} />} 
          label="Gross Turnover" 
          value={stats?.grossTurnover || "KES 0"} 
          iconBg="rgba(37, 99, 235, 0.1)" 
          iconColor="#2563eb" 
        />
        <StatCard 
          icon={<PatientsIcon size={20} />} 
          label="In-Patient Allotment" 
          value={stats?.totalPatients || 0} 
          iconBg="rgba(3, 105, 161, 0.1)" 
          iconColor="#0369a1" 
        />
        <StatCard 
          icon={<CheckCircleIcon size={20} />} 
          label="Resolved Cases" 
          value={stats?.resolvedCases || 0} 
          iconBg="rgba(4, 120, 87, 0.1)" 
          iconColor="#047857" 
        />
        <StatCard 
          icon={<FlaskIcon size={20} />} 
          label="Pending Diagnostics" 
          value={stats?.pendingDiagnostics || 0} 
          iconBg="rgba(180, 83, 9, 0.1)" 
          iconColor="#b45309" 
        />
      </div>

      {/* Artifacts Table */}
      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest text-[11px]">Generated Insights & Artifacts</h3>
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mt-0.5">Institutional Intelligence Repository</p>
          </div>
          <Button onClick={() => setModalOpen(true)} className="h-9">Generate New Artifact</Button>
        </div>
        <Table headers={['Artifact Name', 'Domain', 'Timestamp', 'Originator', 'Action']}>
          {artifacts.map((r) => (
            <tr key={r.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 group">
              <td className="px-5 py-4 text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{r.name}</td>
              <td className="px-5 py-4">
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded uppercase tracking-widest">{r.domain}</span>
              </td>
              <td className="px-5 py-4 text-sm text-slate-500 font-mono italic">{r.timestamp}</td>
              <td className="px-5 py-4 text-sm text-slate-400 font-medium">{r.originator}</td>
              <td className="px-5 py-4 text-right">
                <Button variant="secondary" className="h-8 px-3 text-[10px] font-bold uppercase tracking-widest">
                  <DownloadIcon size={12} className="mr-1" /> 
                  Retrieve
                </Button>
              </td>
            </tr>
          ))}
          {artifacts.length === 0 && (
            <tr>
              <td colSpan={5} className="px-5 py-20 text-center">
                <div className="flex flex-col items-center opacity-20">
                  <FlaskIcon size={48} className="text-slate-400 mb-4" />
                  <p className="text-sm font-bold uppercase tracking-widest">No artifacts generated yet</p>
                </div>
              </td>
            </tr>
          )}
        </Table>
      </div>

      {/* Generation Modal */}
      <Modal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title="Initialize Intelligence Generation"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Abort Process</Button>
            <Button loading={generating} onClick={handleGenerate}>Initialize Generation</Button>
          </>
        }
      >
        <div className="space-y-6 py-2">
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Generating a new institutional artifact will aggregate clinical telemetry, financial data, and operational logs for the selected domain.
          </p>
          <Input 
            label="Domain Classification" 
            options={[
              {value:'patients', label:'Patient Logistics & Census'},
              {value:'financial', label:'Revenue & Financial Audit'},
              {value:'laboratory', label:'Diagnostic Statistics & Yield'},
              {value:'personnel', label:'Staff Performance & Attendance'}
            ]} 
            value={form.domain}
            onChange={(e) => setForm({ ...form, domain: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4 pt-2">
            <Input label="Temporal Start" type="date" />
            <Input label="Temporal End" type="date" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
