'use client';
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { DownloadIcon } from '@/components/ui/Icons';

export default function PatientBilling() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  const bills = [
    { id: 'INV-001', date: '2025-04-10', item: 'Consultation Fee', amount: 'KES 2,500', status: 'paid' },
    { id: 'INV-002', date: '2025-04-10', item: 'Laboratory (CBC)', amount: 'KES 1,200', status: 'paid' },
    { id: 'INV-003', date: '2025-04-12', item: 'Prescription Drugs', amount: 'KES 3,450', status: 'pending' },
  ];

  if (loading) return <><SkeletonLoader height={120} style={{ marginBottom: 24 }} /><SkeletonLoader height={52} count={4} /></>;

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm mb-4">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Current Outstanding Balance</div>
        <div className="text-lg font-bold text-slate-800">KES 3,450</div>
        <div style={{ marginTop: 16 }}>
          <Button style={{ background: '#fff', color: 'var(--primary)', fontWeight: 700 }}>Pay Now</Button>
        </div>
      </div>

      <h3 className="text-base font-bold text-slate-800 mb-4" style={{ marginBottom: 16 }}>Payment History</h3>
      <Table headers={['Invoice ID', 'Date', 'Item Description', 'Amount', 'Status', 'Action']}>
        {bills.map(b => (
          <tr key={b.id}>
            <td>{b.id}</td>
            <td>{b.date}</td>
            <td><strong>{b.item}</strong></td>
            <td>{b.amount}</td>
            <td><Badge status={b.status} /></td>
            <td>
              <Button variant="secondary" style={{ padding: '6px 12px', fontSize: 12 }}>
                <DownloadIcon size={14} /> Receipt
              </Button>
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
