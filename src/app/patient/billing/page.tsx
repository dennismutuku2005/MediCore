'use client';
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { DownloadIcon } from '@/components/ui/Icons';
import { apiFetch } from '@/lib/api';
import authService from '@/lib/auth';
import { toast } from 'sonner';

export default function PatientBilling() {
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState<any[]>([]);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const user = authService.getUser();

  const fetchData = async () => {
    try {
      const patientsRes = await apiFetch('/patients');
      const currentPatient = patientsRes.data?.find((p: any) => p.user?.username === user?.username);
      
      if (currentPatient) {
        const res = await apiFetch(`/billing/invoices?patientId=${currentPatient.id}`);
        if (res.status === 'success') {
          setBills(res.data || []);
        }
      }
    } catch (error) {
      console.error("Failed to fetch billing data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.username]);

  const handlePay = async (id: number) => {
    setProcessingId(id);
    try {
      const res = await apiFetch('/billing/pay', {
        method: 'POST',
        body: JSON.stringify({ id })
      });
      if (res.status === 'success') {
        toast.success("Payment verified and processed");
        await fetchData();
      }
    } catch (error: any) {
      toast.error(error.message || "Financial gateway protocol error.");
    } finally {
      setProcessingId(null);
    }
  };

  const outstanding = bills
    .filter(b => b.status === 'pending')
    .reduce((sum, b) => sum + (b.amount || 0), 0);

  if (loading) return <><SkeletonLoader height={120} style={{ marginBottom: 24 }} className="rounded-xl" /><SkeletonLoader height={52} count={4} className="rounded" /></>;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-[10px] text-slate-400 mb-1">Financial liability protocol</div>
          <div className="text-3xl font-medium text-slate-900 tracking-tighter">KES {outstanding.toLocaleString()}</div>
          <p className="text-[10px] text-slate-400 mt-2">Outstanding clinical fees requiring settlement</p>
        </div>
        {outstanding > 0 && (
          <Button className="h-12 px-10 text-[11px] shadow-lg shadow-blue-100">Save</Button>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium text-slate-800">Financial chronology</h3>
        <p className="text-[10px] text-slate-400 mt-1">Audit trail of clinical invoices and payment verification</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <Table headers={['Reference ID', 'Issue Date', 'Service Protocol', 'Volume (Amount)', 'Matrix Status', 'Operational Action']}>
          {bills.map(b => (
            <tr key={b.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 font-medium">
              <td className="px-5 py-4 text-sm font-mono text-slate-400">#{b.invoiceNumber || b.id}</td>
              <td className="px-5 py-4 text-sm text-slate-500">{b.date}</td>
              <td className="px-5 py-4 text-sm font-medium text-slate-800">{b.itemDescription}</td>
              <td className="px-5 py-4 text-sm font-medium text-slate-900">KES {b.amount?.toLocaleString()}</td>
              <td className="px-5 py-4 text-sm"><Badge status={b.status} /></td>
              <td className="px-5 py-4 text-sm">
                <div className="flex items-center gap-2">
                  {b.status === 'pending' ? (
                    <Button 
                      loading={processingId === b.id}
                      onClick={() => handlePay(b.id)}
                      className="h-8 px-4 text-[10px]"
                    >
                      Update
                    </Button>
                  ) : (
                    <Button variant="secondary" className="h-8 px-3 text-[10px] gap-1.5 shadow-sm">
                      <DownloadIcon size={12} /> Receipt
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </Table>
        {bills.length === 0 && (
          <div className="p-16 text-center text-slate-400 text-[10px]">
            No financial protocols identified in your account
          </div>
        )}
      </div>
    </div>
  );
}
