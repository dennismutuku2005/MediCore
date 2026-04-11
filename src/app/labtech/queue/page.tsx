'use client';
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { labTests as initial } from '@/lib/mockData';
import { LabTest } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function LabtechQueue() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  const pendingTests = initial.filter(t => t.status === 'pending');

  if (loading) return <SkeletonLoader height={52} count={8} />;

  return (
    <Table headers={['Date', 'ID', 'Patient', 'Test Type', 'Urgency', 'Requested By', 'Action']}>
      {pendingTests.map(t => (
        <tr key={t.id}>
          <td>{t.dateRequested}</td>
          <td>{t.id}</td>
          <td><strong>{t.patient}</strong></td>
          <td>{t.testType}</td>
          <td><Badge status={t.urgency} /></td>
          <td>{t.doctor}</td>
          <td>
            <Button variant="primary" style={{ padding: '6px 12px', fontSize: 12 }} 
              onClick={() => router.push(`/labtech/upload?id=${t.id}`)}>Process</Button>
          </td>
        </tr>
      ))}
    </Table>
  );
}
