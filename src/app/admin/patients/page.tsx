'use client';
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SearchInput from '@/components/ui/SearchInput';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { patients as initialPatients } from '@/lib/mockData';
import { Patient } from '@/lib/types';
import { PlusIcon, EyeIcon } from '@/components/ui/Icons';

export default function AdminPatients() {
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1000); return () => clearTimeout(t); }, []);

  if (loading) return (
    <div className="space-y-4">
      <div className="flex justify-between"><SkeletonLoader height={36} width={300} /><SkeletonLoader height={36} width={150} /></div>
      <div className="bg-white border border-slate-200 rounded p-5 space-y-2">
        {[1,2,3,4,5,6,7,8].map(i => <SkeletonLoader key={i} height={48} />)}
      </div>
    </div>
  );

  return (
    <>
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="w-[300px]">
          <SearchInput placeholder="Search patients..." />
        </div>
        <Button onClick={() => setModalOpen(true)}><PlusIcon size={16} /> Register Patient</Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 w-full overflow-hidden bg-white border border-slate-200 rounded">
          <Table headers={['ID', 'Patient Name', 'Gender', 'Blood', 'Insurance', 'Action']}>
            {initialPatients.map(p => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedPatient(p)}>
                <td className="px-5 py-3 text-sm text-slate-400 font-mono">{p.id}</td>
                <td className="px-5 py-3 text-sm font-bold text-slate-800">{p.name}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{p.gender}</td>
                <td className="px-5 py-3 text-sm"><Badge status="info">{p.bloodType}</Badge></td>
                <td className="px-5 py-3 text-sm text-slate-500">{p.insuranceProvider}</td>
                <td className="px-5 py-3 text-sm">
                  <Button variant="secondary" className="p-1 h-7 w-7"><EyeIcon size={14} /></Button>
                </td>
              </tr>
            ))}
          </Table>
        </div>

        {selectedPatient && (
          <div className="w-full lg:w-[350px] shrink-0 sticky top-[84px] animate-in slide-in-from-right duration-300">
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Patient Profile</h3>
                <button onClick={() => setSelectedPatient(null)} className="text-slate-400 hover:text-slate-600 text-xl font-light">×</button>
              </div>
              
              <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-2xl mb-3 shadow-inner">
                  {selectedPatient.name.charAt(0)}
                </div>
                <div className="text-lg font-bold text-slate-800">{selectedPatient.name}</div>
                <div className="text-xs font-bold text-slate-400 uppercase mt-1">Patient ID: {selectedPatient.id}</div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between py-2 border-b border-slate-50 text-sm">
                  <span className="text-slate-400 font-semibold">Contact</span>
                  <span className="text-slate-800 font-bold">{selectedPatient.contact}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50 text-sm">
                  <span className="text-slate-400 font-semibold">Insurance</span>
                  <span className="text-slate-800 font-bold">{selectedPatient.insuranceProvider}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50 text-sm">
                  <span className="text-slate-400 font-semibold">Blood Group</span>
                  <span className="text-slate-800 font-bold text-rose-600">{selectedPatient.bloodType}</span>
                </div>
              </div>

              <div className="mt-8">
                <Button fullWidth variant="secondary">View Full History</Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Register New Patient"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={() => setModalOpen(false)}>Register</Button></>}>
        <div className="grid grid-cols-2 gap-4">
          <Input label="First Name" placeholder="First Name" />
          <Input label="Last Name" placeholder="Last Name" />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Input label="Date of Birth" type="date" />
          <Input label="Gender" options={[{value:'M',label:'Male'},{value:'F',label:'Female'}]} />
        </div>
        <div className="mt-4"><Input label="Contact Number" placeholder="+254..." /></div>
        <div className="mt-4"><Input label="Address" isTextarea placeholder="Residential address..." /></div>
      </Modal>
    </>
  );
}
