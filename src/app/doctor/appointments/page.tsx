'use client';
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { appointments } from '@/lib/mockData';

export default function DoctorAppointments() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  const myAppts = appointments.filter(a => a.doctor === 'Dr. Amina Odhiambo');

  if (loading) return <SkeletonLoader height={52} count={6} />;

  return (
    <Table headers={['Patient', 'Date', 'Time', 'Reason', 'Department', 'Status']}>
      {myAppts.map(a => (
        <tr key={a.id}><td>{a.patient}</td><td>{a.date}</td><td>{a.time}</td><td>{a.reason}</td><td>{a.department}</td><td><Badge status={a.status} /></td></tr>
      ))}
    </Table>
  );
}
