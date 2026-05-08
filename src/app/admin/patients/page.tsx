'use client';
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { apiFetch } from '@/lib/api';
import { PlusIcon, EyeIcon, TrashIcon, SearchIcon, EyeOffIcon } from '@/components/ui/Icons';
import { toast } from 'sonner';
import Combobox from '@/components/ui/Combobox';

export default function AdminPatients() {
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ 
    id: '', 
    name: '', 
    firstName: '', 
    lastName: '', 
    dob: '', 
    gender: '', 
    contact: '', 
    email: '', 
    address: '', 
    blood_type: '', 
    insurance: '',
    username: '',
    password: '',
    wardId: '',
    doctorId: '',
    status: 'outpatient'
  });

  const [patientsList, setPatientsList] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [wards, setWards] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const [patRes, wardRes, docRes] = await Promise.all([
        apiFetch('/patients'),
        apiFetch('/wards'),
        apiFetch('/doctors')
      ]);
      if (patRes.status === 'success') setPatientsList(patRes.data || []);
      if (wardRes.status === 'success') setWards(wardRes.data || []);
      if (docRes.status === 'success') setDoctors(docRes.data || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingPatient(null);
    setForm({ 
      id: '', name: '', firstName: '', lastName: '', dob: '', 
      gender: 'Male', contact: '', email: '', address: '', 
      blood_type: 'O+', insurance: 'None', username: '', password: '', 
      wardId: '', doctorId: '', status: 'outpatient'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (patient: any) => {
    setEditingPatient(patient);
    const names = (patient.name || '').split(' ');
    setForm({ 
      id: patient.id,
      name: patient.name,
      firstName: names[0] || '', 
      lastName: names.slice(1).join(' ') || '', 
      dob: patient.dob || '', 
      gender: patient.gender || 'Male', 
      contact: patient.contact || '', 
      email: patient.email || '',
      address: patient.address || '',
      blood_type: patient.bloodType || 'O+',
      insurance: patient.insuranceProvider || 'None',
      username: patient.user?.username || '',
      password: '',
      wardId: patient.ward?.id || '',
      doctorId: patient.assignedDoctor?.id || '',
      status: patient.status || 'outpatient'
    });
    setModalOpen(true);
    setSelectedPatient(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to remove this patient record? This will delete all associated medical history.')) {
      try {
        await apiFetch(`/patients?id=${id}`, { method: 'DELETE' });
        setPatientsList(prev => prev.filter(p => p.id !== id));
        setSelectedPatient(null);
        toast.success("Patient record removed from master index");
      } catch (error) {
        toast.error("Failed to delete patient record.");
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fullName = `${form.firstName} ${form.lastName}`.trim();
      const payload = {
        id: form.id,
        name: fullName,
        gender: form.gender,
        contact: form.contact,
        email: form.email,
        blood_type: form.blood_type,
        status: form.status,
        username: form.username,
        password: form.password,
        wardId: form.wardId,
        doctorId: form.doctorId
      };

      const res = await apiFetch('/patients', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res.status === 'success') {
        await fetchData();
        setModalOpen(false);
        toast.success(editingPatient ? "Patient profile updated successfully" : "New patient registered in clinical database");
      }
    } catch (error) {
      toast.error("Failed to save patient record.");
    } finally {
      setSaving(false);
    }
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
        <div className="relative w-full sm:w-[380px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <SearchIcon size={14} />
          </span>
          <input
            className="w-full h-10 pl-10 pr-4 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-all placeholder:text-slate-400"
            placeholder="Search by name, ID or status..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={handleOpenAdd} className="h-10">
          <PlusIcon size={16} />
          <span className="ml-1">Register New Patient</span>
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest text-[11px]">Master Patient Index</h3>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              {patientsList.filter(p => (p.name || '').toLowerCase().includes(search.toLowerCase())).length} of {patientsList.length} records
            </p>
          </div>
          <Badge status="info">{patientsList.length} Total</Badge>
        </div>
        <Table headers={['', 'Full Name', 'Gender', 'Ward', 'Doctor', 'Status', 'Action']}>
          {patientsList
            .filter(p => {
              const q = search.toLowerCase();
              return (p.name || '').toLowerCase().includes(q) ||
                     String(p.id).includes(q) ||
                     (p.status || '').toLowerCase().includes(q) ||
                     (p.assignedDoctor?.name || '').toLowerCase().includes(q);
            })
            .map(p => (
            <tr key={p.id} className="hover:bg-slate-50 transition-colors cursor-pointer group border-b border-slate-100 last:border-0" onClick={() => setSelectedPatient(p)}>
              <td className="px-5 py-3">
                <div className="w-8 h-8 rounded bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black text-xs">
                  {(p.name || 'P').charAt(0).toUpperCase()}
                </div>
              </td>
              <td className="px-5 py-3 text-sm font-bold text-slate-800 group-hover:text-blue-600">{p.name}</td>
              <td className="px-5 py-3 text-sm text-slate-600 font-bold">{p.gender || '—'}</td>
              <td className="px-5 py-3 text-sm text-slate-600 font-medium">{p.ward?.name || 'Outpatient'}</td>
              <td className="px-5 py-3 text-sm text-slate-500 font-medium">{p.assignedDoctor?.name || '—'}</td>
              <td className="px-5 py-3"><Badge status={p.status}>{p.status}</Badge></td>
              <td className="px-5 py-3 text-right">
                <button
                  className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded transition-all opacity-0 group-hover:opacity-100"
                  onClick={e => { e.stopPropagation(); setSelectedPatient(p); }}
                >
                  <EyeIcon size={14} />
                </button>
              </td>
            </tr>
          ))}
        </Table>
        {patientsList.filter(p => (p.name || '').toLowerCase().includes(search.toLowerCase())).length === 0 && (
          <div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
            {search ? `No patients matching "${search}"` : 'No patient records found.'}
          </div>
        )}
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
                {(selectedPatient.name || 'P').charAt(0)}
              </div>
              <div className="text-xl font-black text-slate-900 tracking-tight text-center">{selectedPatient.name}</div>
              <div className="mt-2 flex gap-2">
                <Badge status="info">#{selectedPatient.id}</Badge>
                <Badge status="critical">{selectedPatient.bloodType || 'UNK'}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-12">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Biological Gender</span>
                <span className="text-sm text-slate-800 font-bold">{selectedPatient.gender}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medical Coverage</span>
                <span className="text-sm text-slate-800 font-bold">{selectedPatient.insuranceProvider || 'Private Pay'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Communication Link</span>
                <span className="text-sm text-slate-800 font-bold">{selectedPatient.contact || 'N/A'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assigned Clinician</span>
                <span className="text-sm text-slate-800 font-bold">{selectedPatient.assignedDoctor?.name || 'Unassigned'}</span>
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
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Dismiss</Button><Button loading={saving} onClick={handleSave}>{editingPatient ? "Update Records" : "Confirm Registration"}</Button></>}>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Given Name" placeholder="First..." value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
            <Input label="Surname" placeholder="Last..." value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Email Contact" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <Input label="Gender Identity" options={[{value:'Male',label:'Male'},{value:'Female',label:'Female'},{value:'Other',label:'Other'}]} value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Blood Type" options={[{value:'A+',label:'A+'},{value:'A-',label:'A-'},{value:'B+',label:'B+'},{value:'B-',label:'B-'},{value:'O+',label:'O+'},{value:'O-',label:'O-'},{value:'AB+',label:'AB+'},{value:'AB-',label:'AB-'}]} value={form.blood_type} onChange={e => setForm({ ...form, blood_type: e.target.value })} />
            <Input label="Emergency Contact" placeholder="+254..." value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} />
          </div>
          <Input label="Primary Residence" isTextarea placeholder="Full residential details..." value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          
          <div className="pt-4 border-t border-slate-50">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Clinical Placement & Security</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Combobox 
                label="Ward Allocation" 
                placeholder="Select Ward..."
                options={[
                  { value: '', label: 'No Ward Assigned (Outpatient)' },
                  ...wards.map(w => ({ value: w.id, label: w.name, sublabel: `${w.occupied}/${w.totalBeds || w.capacity} Beds` }))
                ]} 
                value={form.wardId} 
                onChange={val => setForm({ ...form, wardId: val })} 
              />
              <Input 
                label="Clinical Status" 
                options={[
                  { value: 'outpatient', label: 'Outpatient' },
                  { value: 'inpatient', label: 'Inpatient (Admitted)' },
                  { value: 'discharged', label: 'Discharged' }
                ]} 
                value={form.status} 
                onChange={e => setForm({ ...form, status: e.target.value })} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Combobox 
                label="Assigned Doctor" 
                placeholder="Select Physician..."
                options={[
                  { value: '', label: 'Unassigned' },
                  ...doctors.map(d => ({ value: d.id, label: d.name, sublabel: d.specialization }))
                ]} 
                value={form.doctorId} 
                onChange={val => setForm({ ...form, doctorId: val })} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Portal Identifier (Username)" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
              <Input 
                label="Portal Security Key (Password)" 
                type={showPassword ? "text" : "password"} 
                placeholder={editingPatient ? "Leave blank to preserve" : "Enter temporary key"} 
                value={form.password} 
                onChange={e => setForm({ ...form, password: e.target.value })} 
                suffix={
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOffIcon size={14} /> : <EyeIcon size={14} />}
                  </button>
                }
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
