'use client';
import React, { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { UploadIcon } from '@/components/ui/Icons';
import Toast from '@/components/ui/Toast';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [toggles, setToggles] = useState({ email: true, sms: false, audit: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setToast('Settings saved successfully'); }, 1000);
  };

  if (loading) return <SkeletonLoader height={200} count={3} />;

  return (
    <>
      <div className="relative">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight mb-2">Hospital Information</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Hospital Name" value="MediCore General Hospital" onChange={() => {}} />
          <Input label="Address" isTextarea value="Nairobi, Kenya — Kenyatta Avenue, P.O. Box 12345" onChange={() => {}} />
          <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
            <Input label="Contact Number" value="020 123 4567" onChange={() => {}} />
            <Input label="Email" value="info@medicore.ke" onChange={() => {}} />
          </div>
          <div><Button loading={saving} onClick={handleSave}>Save Changes</Button></div>
        </div>
      </div>

      <div className="relative">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight mb-2">Logo</h3>
        <div className="relative">
          <UploadIcon size={24} color="var(--text-muted)" />
          <p style={{ marginTop: 8 }}>Click to upload hospital logo</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>PNG, JPG up to 2MB</p>
        </div>
      </div>

      <div className="relative">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight mb-2">Notifications</h3>
        {(['email', 'sms', 'audit'] as const).map(key => (
          <div key={key} className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{key === 'email' ? 'Email Notifications' : key === 'sms' ? 'SMS Notifications' : 'Audit Log'}</span>
            <button className={`relative ${toggles[key] ? styles.switchActive : ''}`} onClick={() => setToggles({ ...toggles, [key]: !toggles[key] })}>
              <span className="relative" />
            </button>
          </div>
        ))}
      </div>

      {toast && <Toast message={toast} onDone={() => setToast('')} />}
    </>
  );
}
