'use client';
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { labTests as initial } from '@/lib/mockData';
import { EyeIcon } from '@/components/ui/Icons';

export default function LabtechCompleted() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  const completedTests = initial.filter(t => t.status === 'completed');

  if (loading) return <SkeletonLoader height={52} count={8} />;

  return (
    <Table headers={['Date', 'ID', 'Patient', 'Test Type', 'Requested By', 'Result Summary', 'Action']}>
      {completedTests.map(t => (
        <tr key={t.id}>
          <td>{t.dateRequested}</td>
          <td>{t.id}</td>
          <td><strong>{t.patient}</strong></td>
          <td>{t.testType}</td>
          <td>{t.doctor}</td>
          <td>{t.result}</td>
          <td>
            <Button variant="secondary" style={{ padding: '6px 12px', fontSize: 12 }}>
              <EyeIcon size={14} /> View
            </Button>
          </td>
        </tr>
      ))}
    </Table>
  );
}
