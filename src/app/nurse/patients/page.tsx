'use client';
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { patients } from '@/lib/mockData';

export default function NursePatients() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  if (loading) return <SkeletonLoader height={52} count={6} />;

  return (
    <>
      <div className="bg-blue-600 text-white rounded-lg p-5 mb-6 shadow-md flex items-center justify-between">
        ℹ️ Read-only view — contact doctor to update records
      </div>
      <Table headers={['Name', 'Age', 'Diagnosis', 'Doctor', 'Ward', 'Status']}>
        {patients.map(p => (
          <tr key={p.id}><td><strong>{p.name}</strong></td><td>{p.age}</td><td>{p.diagnosis}</td><td>{p.assignedDoctor}</td><td>{p.ward}</td><td><Badge status={p.status} /></td></tr>
        ))}
      </Table>
    </>
  );
}
