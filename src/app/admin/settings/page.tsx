'use client';
import React, { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import Image from 'next/image';
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

      <div className="mb-8">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight mb-4">Logo</h3>
        <div className="p-6 border border-dashed border-slate-200 rounded-lg flex flex-col items-center bg-slate-50">
          <div className="mb-4 bg-white p-4 rounded shadow-sm border border-slate-100">
            <Image src="/logo.png" alt="Hospital Logo" width={180} height={50} className="object-contain" />
          </div>
          <div className="text-center">
            <Button variant="secondary" className="flex items-center gap-2">
              <UploadIcon size={16} />
              Change Logo
            </Button>
            <p className="mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">PNG, JPG up to 2MB. Recommended: 300x80px</p>
          </div>
        </div>
      </div>

      <div className="relative">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight mb-2">Notifications</h3>
        {(['email', 'sms', 'audit'] as const).map(key => (
          <div key={key} className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{key === 'email' ? 'Email Notifications' : key === 'sms' ? 'SMS Notifications' : 'Audit Log'}</span>
            <button 
              className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${toggles[key] ? 'bg-blue-600' : 'bg-slate-200'}`} 
              onClick={() => setToggles({ ...toggles, [key]: !toggles[key] })}
            >
              <span className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ${toggles[key] ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        ))}
      </div>

      {toast && <Toast message={toast} onDone={() => setToast('')} />}
    </>
  );
}
