'use client';
import React, { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { UploadIcon } from '@/components/ui/Icons';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>({
    hospitalName: '',
    address: '',
    contactNumber: '',
    email: '',
    emailNotifications: true,
    smsNotifications: false,
    auditLogging: true
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await apiFetch('/settings');
        if (res.status === 'success') {
          setSettings(res.data || {});
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await apiFetch('/settings', {
        method: 'POST',
        body: JSON.stringify(settings)
      });
      if (res.status === 'success') {
        toast.success('Configuration persistent in system database');
      }
    } catch (error) {
      toast.error('Protocol failure: Configuration not saved');
    } finally {
      setSaving(false);
    }
  };

  const toggle = (key: string) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  if (loading) return (
    <div className="space-y-8 animate-pulse">
      <SkeletonLoader height={250} className="rounded-xl" />
      <SkeletonLoader height={150} className="rounded-xl" />
      <SkeletonLoader height={200} className="rounded-xl" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <div className="mb-6 border-b border-slate-50 pb-5">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Institutional Identification</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Core facility metadata and communication links</p>
        </div>
        
        <div className="space-y-6">
          <Input 
            label="Facility Denomination" 
            value={settings.hospitalName} 
            onChange={(e) => setSettings({...settings, hospitalName: e.target.value})} 
          />
          <Input 
            label="Geospatial Address" 
            isTextarea 
            value={settings.address} 
            onChange={(e) => setSettings({...settings, address: e.target.value})} 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Primary Voice Link" 
              value={settings.contactNumber} 
              onChange={(e) => setSettings({...settings, contactNumber: e.target.value})} 
            />
            <Input 
              label="Administrative Email" 
              value={settings.email} 
              onChange={(e) => setSettings({...settings, email: e.target.value})} 
            />
          </div>
          <div className="pt-4 flex justify-end">
            <Button loading={saving} onClick={handleSave} className="h-10 px-8 text-[11px] font-black uppercase tracking-widest">Commit Changes</Button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <div className="mb-6 border-b border-slate-50 pb-5">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Visual Identity</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">System-wide branding and iconography</p>
        </div>
        
        <div className="flex flex-col items-center bg-slate-50/50 p-10 rounded-xl border-2 border-dashed border-slate-200">
          <div className="mb-6 bg-white p-5 rounded-lg shadow-sm border border-slate-100 ring-4 ring-slate-50">
            <Image src="/logo.png" alt="Hospital Logo" width={220} height={60} className="object-contain" priority />
          </div>
          <div className="text-center">
            <Button variant="secondary" className="flex items-center gap-2 h-10 px-6 text-[10px] font-black uppercase tracking-widest">
              <UploadIcon size={16} />
              Re-upload Brandmark
            </Button>
            <p className="mt-4 text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">Matrix: PNG, SVG, or WEBP • Max Volume: 4.0MB</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <div className="mb-6 border-b border-slate-50 pb-5">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Operational Protocols</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Automated notification and audit subsystems</p>
        </div>

        <div className="space-y-1">
          {[
            { id: 'emailNotifications', label: 'Automated SMTP Relays', desc: 'Dispatch clinical alerts via email infrastructure' },
            { id: 'smsNotifications', label: 'Cellular SMS Gateways', desc: 'Push appointment signals to patient mobile devices' },
            { id: 'auditLogging', label: 'Cryptographic Audit Trail', desc: 'Record all system interactions for clinical compliance' }
          ].map(opt => (
            <div key={opt.id} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0 group">
              <div className="space-y-0.5">
                <div className="text-[11px] font-black text-slate-800 uppercase tracking-wider">{opt.label}</div>
                <div className="text-[10px] text-slate-400 font-medium">{opt.desc}</div>
              </div>
              <button 
                className={`relative w-11 h-5.5 rounded-full transition-all duration-300 shadow-inner ${settings[opt.id] ? 'bg-blue-600' : 'bg-slate-200'}`} 
                onClick={() => toggle(opt.id)}
              >
                <span className={`absolute top-1 left-1 w-3.5 h-3.5 bg-white rounded-full transition-transform duration-300 shadow-sm ${settings[opt.id] ? 'translate-x-5.5' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
