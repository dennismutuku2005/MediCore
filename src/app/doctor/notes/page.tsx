'use client';
import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import Toast from '@/components/ui/Toast';
import { patients, doctorNotes } from '@/lib/mockData';

export default function DoctorNotes() {
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState('P001');
  const [noteText, setNoteText] = useState('');
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  const myPatients = patients.filter(p => p.assignedDoctor === 'Dr. Amina Odhiambo');
  const filteredNotes = doctorNotes.filter(n => n.patientId === selectedPatient);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setNoteText(''); setToast('Note saved successfully'); }, 1000);
  };

  if (loading) return (
    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-5 h-[calc(100vh-100px)]">
      <SkeletonLoader height="100%" />
      <SkeletonLoader height="100%" />
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-5 h-[calc(100vh-100px)]">
        <div className="bg-white border border-slate-200 rounded-lg overflow-y-auto">
          <div className="px-4 py-3 font-bold text-sm border-b border-slate-200">Patients</div>
          {myPatients.map(p => (
            <div key={p.id} className={`px-4 py-3 border-b border-slate-50 cursor-pointer text-sm transition-colors ${selectedPatient === p.id ? 'bg-blue-50 text-blue-600 font-bold border-l-4 border-l-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
              onClick={() => setSelectedPatient(p.id)}>{p.name}</div>
          ))}
        </div>
        <div className="flex flex-col gap-5 overflow-y-auto pr-2">
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex gap-2 pb-3 border-b border-slate-50 mb-3">
              <button className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"><strong>B</strong></button>
              <button className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"><em>I</em></button>
              <button className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"><u>U</u></button>
            </div>
            <textarea className="w-full min-h-[120px] resize-y outline-none text-sm text-slate-800 placeholder:text-slate-400" placeholder="Write your clinical note here..." value={noteText} onChange={e => setNoteText(e.target.value)} />
            <div className="mt-4"><Button loading={saving} onClick={handleSave}>Save Note</Button></div>
          </div>
          <div className="flex flex-col gap-3">
            {filteredNotes.map(n => (
              <div key={n.id} className="bg-white border border-slate-200 rounded-lg p-5">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-slate-800">{n.patient}</span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{n.date}</span>
                </div>
                <div className="text-sm text-slate-600 leading-relaxed">{n.content}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {toast && <Toast message={toast} onDone={() => setToast('')} />}
    </>
  );
}
