'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { UploadIcon } from '@/components/ui/Icons';
import Toast from '@/components/ui/Toast';
import { labTests } from '@/lib/mockData';

export default function LabtechUpload() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const testId = searchParams.get('id');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  
  const test = labTests.find(t => t.id === testId);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1000); return () => clearTimeout(t); }, []);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setToast('Test results uploaded successfully');
      setTimeout(() => router.push('/labtech/queue'), 1500);
    }, 1500);
  };

  if (loading) return <SkeletonLoader height={300} />;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm mb-4">
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight mb-2">Upload Results: {test?.id || 'New Result'}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <Input label="Patient" value={test?.patient || ''} readOnly />
        <Input label="Test Type" value={test?.testType || ''} readOnly />
      </div>

      <Input label="Test Results / Findings" isTextarea placeholder="Enter detailed findings here..." style={{ minHeight: 180 }} />
      
      <div className="relative" style={{ marginTop: 24 }}>
        <UploadIcon size={24} color="var(--text-muted)" />
        <p style={{ marginTop: 8 }}>Click to upload lab attachments / images</p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>PDF, JPEG up to 10MB</p>
      </div>

      <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <Button variant="secondary" onClick={() => router.back()}>Cancel</Button>
        <Button loading={saving} onClick={handleSave}>Submit Results</Button>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast('')} />}
    </div>
  );
}
