'use client';
import React, { useState, useEffect } from 'react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { apiFetch } from '@/lib/api';
import authService from '@/lib/auth';
import { DownloadIcon } from '@/components/ui/Icons';

export default function PatientLabResults() {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const user = authService.getUser();

  useEffect(() => {
    async function fetchResults() {
      try {
        const patientsRes = await apiFetch('/patients');
        const currentPatient = patientsRes.data?.find((p: any) => p.user?.username === user?.username);
        
        if (currentPatient) {
          const res = await apiFetch(`/labtech/queue?patientId=${currentPatient.id}`);
          if (res.status === 'success') {
            setResults(res.data || []);
          }
        }
      } catch (error) {
        console.error("Failed to fetch lab results:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [user?.username]);

  if (loading) return (
    <div className="space-y-3">
      <SkeletonLoader height={52} count={5} className="rounded" />
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6">
        <h2 className="text-xl font-medium text-slate-800">Diagnostic analysis terminal</h2>
        <p className="text-[10px] text-slate-400 mt-1">Status of laboratory investigations and verified results</p>
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <Table headers={['Protocol Type', 'Request Date', 'Clinical Status', 'Result Summary', 'Operational Action']}>
          {results.map(t => (
            <tr key={t.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 font-medium">
              <td className="px-5 py-3 text-sm font-medium text-slate-800">{t.testType}</td>
              <td className="px-5 py-3 text-sm text-slate-500 font-mono italic">{t.dateRequested}</td>
              <td className="px-5 py-3 text-sm"><Badge status={t.status} /></td>
              <td className="px-5 py-3 text-sm text-slate-800 font-medium truncate max-w-[200px]">{t.result || 'Analysis in progress...'}</td>
              <td className="px-5 py-3 text-sm">
                {t.status === 'completed' ? (
                  <Button variant="secondary" className="h-8 px-3 text-[10px] gap-1.5">
                    <DownloadIcon size={12} /> Verified pdf
                  </Button>
                ) : (
                  <span className="text-[10px] text-slate-300">Locked</span>
                )}
              </td>
            </tr>
          ))}
        </Table>
        {results.length === 0 && (
          <div className="p-16 text-center text-slate-400 text-[10px]">
            No diagnostic records found in your health profile
          </div>
        )}
      </div>
    </div>
  );
}
