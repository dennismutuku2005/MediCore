'use client';
import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { patients } from '@/lib/mockData';

export default function PatientProfile() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1000); return () => clearTimeout(t); }, []);

  const me = patients.find(p => p.id === 'P001');

  if (loading || !me) return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
      <SkeletonLoader height={350} />
      <SkeletonLoader height={600} />
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 animate-in fade-in duration-500">
      
      {/* Sidebar Profile Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm h-fit flex flex-col items-center text-center">
        <div className="w-28 h-28 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-extrabold text-4xl shadow-sm mb-4">
          {me.name.split(' ').map(n => n[0]).join('')}
        </div>
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">{me.name}</h2>
        <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wider">Patient ID: {me.id}</p>
        
        <div className="w-full h-px bg-slate-100 my-6" />
        
        <div className="w-full space-y-3">
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-slate-500">Registered</span>
            <span className="font-bold text-slate-800">12 Jan 2025</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-slate-500">Status</span>
            <span className="font-bold text-emerald-600">Active</span>
          </div>
        </div>

        <Button variant="secondary" className="mt-8 w-full">Change Photo</Button>
      </div>
      
      {/* Main Details Form */}
      <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
        
        <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest mb-5">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <Input label="First Name" value={me.name.split(' ')[0]} />
          <Input label="Last Name" value={me.name.split(' ').slice(1).join(' ')} />
          <Input label="Email Address" value="brian.m@gmail.com" />
          <Input label="Phone Number" value={me.contact} />
          <Input label="Gender" value={me.gender} readOnly />
          <Input label="Blood Type" value={me.bloodType} readOnly />
        </div>
        
        <div className="h-px bg-slate-100 -mx-8 mb-8" />
        
        <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest mb-5">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <Input label="Contact Person" value={me.emergencyContact} />
          <Input label="Emergency Phone" value={me.emergencyPhone} />
        </div>

        <div className="h-px bg-slate-100 -mx-8 mb-8" />

        <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest mb-5">Insurance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <Input label="Provider" value={me.insuranceProvider} />
          <Input label="Policy Number" value={me.policyNumber} />
        </div>
        
        <div className="flex items-center justify-end gap-3 mt-10 pt-6 border-t border-slate-100">
          <Button variant="secondary">Discard Changes</Button>
          <Button>Save Profile</Button>
        </div>

      </div>
    </div>
  );
}
