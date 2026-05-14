'use client';
import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { apiFetch } from '@/lib/api';
import authService from '@/lib/auth';

export default function PatientProfile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const user = authService.getUser();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const patientsRes = await apiFetch('/patients');
        const currentPatient = patientsRes.data?.find((p: any) => p.user?.username === user?.username);
        
        if (currentPatient) {
          const res = await apiFetch(`/patient/profile?patientId=${currentPatient.id}`);
          if (res.status === 'success') {
            setProfile(res.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user?.username]);

  if (loading || !profile) return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
      <SkeletonLoader height={350} className="rounded-xl" />
      <SkeletonLoader height={600} className="rounded-xl" />
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 animate-in fade-in duration-500">
      
      {/* Sidebar Profile Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-fit flex flex-col items-center text-center">
        <div className="w-28 h-28 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-4xl shadow-inner mb-4 border-2 border-blue-100">
          {(profile.name || 'P').split(' ').map((n: string) => n[0]).join('')}
        </div>
        <h2 className="text-xl font-black text-slate-800 tracking-tight">{profile.name}</h2>
        <p className="text-[10px] text-slate-400 mt-1">Patient protocol #{profile.id}</p>
        
        <div className="w-full h-px bg-slate-50 my-6" />
        
        <div className="w-full space-y-3 px-2">
          <div className="flex justify-between text-[11px] font-medium">
            <span className="text-slate-400">Registry Date</span>
            <span className="text-slate-800">{new Date(profile.createdAt || Date.now()).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between text-[11px] font-medium">
            <span className="text-slate-400">Clinical Status</span>
            <span className="text-emerald-600">Verified</span>
          </div>
        </div>

        <Button variant="secondary" className="mt-8 w-full h-10 text-[10px]">Update avatar</Button>
      </div>
      
      {/* Main Details Form */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <div className="mb-8 border-b border-slate-50 pb-5">
          <h3 className="text-sm font-medium text-slate-900">Demographic identification</h3>
          <p className="text-[10px] text-slate-400 mt-1">Core patient data for medical records</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Input label="Full Legal Name" value={profile.name} readOnly />
          <Input label="System Username" value={user?.username || 'N/A'} readOnly />
          <Input label="Clinical Email" value={profile.email || 'N/A'} />
          <Input label="Mobile Link" value={profile.contact || 'N/A'} />
          <Input label="Biological Gender" value={profile.gender || 'Unknown'} readOnly />
          <Input label="Genetic Blood Type" value={profile.bloodType || 'Unknown'} readOnly />
        </div>
        
        <div className="mb-8 border-b border-slate-50 pb-5 pt-4">
          <h3 className="text-sm font-medium text-slate-900">Emergency & contingency</h3>
          <p className="text-[10px] text-slate-400 mt-1">Primary contact for urgent clinical scenarios</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Input label="Contingency Contact Person" value={profile.emergencyContact || 'N/A'} />
          <Input label="Urgent Contact Number" value={profile.emergencyPhone || 'N/A'} />
        </div>

        <div className="mb-8 border-b border-slate-50 pb-5 pt-4">
          <h3 className="text-sm font-medium text-slate-900">Financial & coverage</h3>
          <p className="text-[10px] text-slate-400 mt-1">Insurance carrier and policy metadata</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Input label="Insurance Carrier" value={profile.insuranceProvider || 'Private/Cash'} />
          <Input label="Policy Protocol Number" value={profile.policyNumber || 'N/A'} />
        </div>
        
        <div className="flex items-center justify-end gap-3 mt-10 pt-6 border-t border-slate-50">
          <Button variant="secondary" className="h-10 px-6 text-[11px]">Cancel</Button>
          <Button className="h-10 px-6 text-[11px]">Save</Button>
        </div>
      </div>
    </div>
  );
}
