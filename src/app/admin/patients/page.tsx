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
import { PlusIcon, EyeIcon, TrashIcon } from '@/components/ui/Icons';

export default function AdminPatients() {
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', dob: '', gender: '', contact: '', address: '' });

  const [patientsList, setPatientsList] = useState<Patient[]>(initialPatients);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1000); return () => clearTimeout(t); }, []);

  const handleOpenAdd = () => {
    setEditingPatient(null);
    setForm({ firstName: '', lastName: '', dob: '', gender: '', contact: '', address: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (patient: Patient) => {
    setEditingPatient(patient);
    const [first, ...last] = patient.name.split(' ');
    setForm({ 
      firstName: first, 
      lastName: last.join(' '), 
      dob: '', 
      gender: patient.gender, 
      contact: patient.contact || '', 
      address: '' 
    });
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this patient record? This will delete all associated medical history.')) {
      setPatientsList(patientsList.filter(p => p.id !== id));
      setSelectedPatient(null);
    }
  };

  const handleSave = () => {
    const updatedName = `${form.firstName} ${form.lastName}`;
    if (editingPatient) {
      setPatientsList(patientsList.map(p => p.id === editingPatient.id ? { ...p, name: updatedName, gender: form.gender as any, contact: form.contact } : p));
      if (selectedPatient?.id === editingPatient.id) {
        setSelectedPatient({ ...selectedPatient, name: updatedName, gender: form.gender as any, contact: form.contact });
      }
    } else {
      const newP = {
        id: `P${String(patientsList.length + 1).padStart(3, '0')}`,
        name: updatedName,
        gender: form.gender as any || 'Male',
        contact: form.contact || '',
        bloodType: 'O+',
        insuranceProvider: 'None',
        status: 'outpatient'
      } as any;
      setPatientsList([...patientsList, newP]);
    }
    setModalOpen(false);
    setEditingPatient(null);
  };

  if (loading) return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SkeletonLoader width={250} height={36} />
        <SkeletonLoader width={150} height={36} />
      </div>
      <div className="bg-white border border-slate-200 rounded p-5 space-y-3 shadow-sm">
        <SkeletonLoader variant="row" count={8} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="w-full sm:w-[350px]">
          <SearchInput placeholder="Search records by name, ID or insurance..." />
        </div>
        <Button onClick={handleOpenAdd} className="h-10">
          <PlusIcon size={16} /> 
          <span className="ml-1">Register New Patient</span>
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest text-[11px]">Master Patient Index</h3>
            <Badge status="info">{patientsList.length} Total Records</Badge>
        </div>
        <Table headers={['Accession ID', 'Full Name Identity', 'Genetic Gender', 'Category', 'Insurance Carrier', 'Action']}>
          {patientsList.map(p => (
            <tr key={p.id} className="hover:bg-slate-50 transition-colors cursor-pointer group border-b border-slate-100 last:border-0" onClick={() => setSelectedPatient(p)}>
              <td className="px-5 py-3 text-sm text-slate-400 font-mono italic">{p.id}</td>
              <td className="px-5 py-3 text-sm font-bold text-slate-800 group-hover:text-blue-600">{p.name}</td>
              <td className="px-5 py-3 text-sm text-slate-600">{p.gender}</td>
              <td className="px-5 py-3 text-sm"><Badge status="info">{p.bloodType}</Badge></td>
              <td className="px-5 py-3 text-sm text-slate-500 font-bold">{p.insuranceProvider}</td>
              <td className="px-5 py-3 text-sm text-right">
                <div className="flex justify-end">
                  <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded transition-all">
                    <EyeIcon size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      {/* Patient Detail Modal */}
      <Modal 
        open={!!selectedPatient} 
        onClose={() => setSelectedPatient(null)} 
        title="Comprehensive Patient Insight"
        footer={<><Button variant="secondary" onClick={() => setSelectedPatient(null)}>Dismiss</Button><Button onClick={() => handleOpenEdit(selectedPatient!)}>Edit Profile</Button></>}
      >
        {selectedPatient && (
          <div className="space-y-8 py-2">
            <div className="flex flex-col items-center border-b border-slate-50 pb-6">
              <div className="w-20 h-20 rounded bg-blue-50 border-2 border-blue-100 text-blue-600 flex items-center justify-center font-black text-3xl mb-4 shadow-sm">
                {selectedPatient.name.charAt(0)}
              </div>
              <div className="text-xl font-black text-slate-900 tracking-tight text-center">{selectedPatient.name}</div>
              <div className="mt-2 flex gap-2">
                <Badge status="info">{selectedPatient.id}</Badge>
                <Badge status="critical">{selectedPatient.bloodType}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-12">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Biological Gender</span>
                <span className="text-sm text-slate-800 font-bold">{selectedPatient.gender}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medical Coverage</span>
                <span className="text-sm text-slate-800 font-bold">{selectedPatient.insuranceProvider}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Communication Link</span>
                <span className="text-sm text-slate-800 font-bold">{selectedPatient.contact || 'N/A'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Status</span>
                <Badge status={selectedPatient.status as any}>{selectedPatient.status}</Badge>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50">
               <button 
                onClick={() => handleDelete(selectedPatient.id)}
                className="w-full h-11 border border-rose-200 text-rose-600 rounded-md font-bold hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
              >
                <TrashIcon size={16} /> 
                <span>DE-REGISTER PATIENT</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingPatient ? "Update Patient Profile" : "Register New Patient"}
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Dismiss</Button><Button onClick={handleSave}>{editingPatient ? "Update Records" : "Confirm Registration"}</Button></>}>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Given Name" placeholder="First..." value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
            <Input label="Surname" placeholder="Last..." value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date of Birth" type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />
            <Input label="Gender Identity" options={[{value:'Male',label:'Male'},{value:'Female',label:'Female'},{value:'Other',label:'Other'}]} value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} />
          </div>
          <Input label="Emergency Contact" placeholder="+254..." value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} />
          <Input label="Primary Residence" isTextarea placeholder="Full residential details..." value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
        </div>
      </Modal>
    </div>
  );
}
