'use client';
import React, { useState, useEffect } from 'react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { labTests } from '@/lib/mockData';
import { DownloadIcon } from '@/components/ui/Icons';

export default function PatientLabResults() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  const results = labTests.filter(t => t.patient === 'Brian Mwangi');

  if (loading) return <SkeletonLoader height={52} count={4} />;

  return (
    <Table headers={['Test Type', 'Date Requested', 'Status', 'Result', 'Action']}>
      {results.map(t => (
        <tr key={t.id}>
          <td><strong>{t.testType}</strong></td>
          <td>{t.dateRequested}</td>
          <td><Badge status={t.status} /></td>
          <td>{t.result || 'Pending'}</td>
          <td>
            {t.status === 'completed' && (
              <Button variant="secondary" style={{ padding: '6px 12px', fontSize: 12 }}>
                <DownloadIcon size={14} /> PDF
              </Button>
            )}
          </td>
        </tr>
      ))}
    </Table>
  );
}
