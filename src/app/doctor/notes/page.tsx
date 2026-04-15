'use client';
import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
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
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 h-[calc(100vh-120px)] animate-in fade-in duration-300">
      <div className="bg-white border border-slate-200 rounded p-4 space-y-4">
        <SkeletonLoader width="60%" height={20} />
        {[1,2,3,4,5].map(i => <SkeletonLoader key={i} height={40} />)}
      </div>
      <div className="space-y-6 overflow-y-auto pr-2">
        <div className="bg-white border border-slate-200 rounded p-6 space-y-4">
          <SkeletonLoader width="30%" height={16} />
          <SkeletonLoader height={120} />
          <SkeletonLoader width={100} height={40} />
        </div>
        {[1,2].map(i => (
          <div key={i} className="bg-white border border-slate-200 rounded p-6 space-y-3">
            <div className="flex justify-between">
              <SkeletonLoader width="40%" height={16} />
              <SkeletonLoader width="20%" height={12} />
            </div>
            <SkeletonLoader height={60} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 h-[calc(100vh-120px)] animate-in fade-in duration-300">
      {/* Patient Selection Sidebar */}
      <div className="bg-white border border-slate-200 rounded flex flex-col shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Clinical Census</h3>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {myPatients.map(p => (
            <div 
              key={p.id} 
              className={`px-5 py-4 cursor-pointer transition-all group ${selectedPatient === p.id ? 'bg-blue-50/50 border-r-4 border-r-blue-600' : 'hover:bg-slate-50'}`}
              onClick={() => setSelectedPatient(p.id)}
            >
              <div className={`text-sm font-bold tracking-tight ${selectedPatient === p.id ? 'text-blue-700' : 'text-slate-700 group-hover:text-slate-900'}`}>{p.name}</div>
              <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{p.id} • {p.diagnosis}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Note Editor and History */}
      <div className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
        {/* Editor Block */}
        <div className="bg-white border border-slate-200 rounded p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">New Clinical Entry</h3>
             <div className="flex gap-1.5">
                {['B', 'I', 'U'].map(btn => (
                  <button key={btn} className="w-7 h-7 rounded border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-400 hover:bg-slate-50 hover:text-blue-600 transition-colors">{btn}</button>
                ))}
             </div>
          </div>
          <textarea 
            className="w-full min-h-[160px] p-4 bg-slate-50/50 border border-slate-100 rounded outline-none text-sm text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-blue-200 transition-all font-medium leading-relaxed" 
            placeholder="Record medical findings, observations, or protocol changes..." 
            value={noteText} 
            onChange={e => setNoteText(e.target.value)} 
          />
          <div className="mt-4 flex justify-end">
            <Button loading={saving} onClick={handleSave} className="px-8 shadow-sm">Commit to Record</Button>
          </div>
        </div>

        {/* History Chronology */}
        <div className="space-y-4 pb-10">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 mb-2">Chronological History</div>
          {filteredNotes.map(n => (
            <div key={n.id} className="bg-white border border-slate-200 rounded p-6 shadow-sm group hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="text-sm font-black text-slate-900 tracking-tight">{n.patient}</span>
                </div>
                <Badge status="info">{n.date}</Badge>
              </div>
              <div className="text-sm text-slate-600 leading-relaxed font-medium pl-3.5 border-l-2 border-slate-50 group-hover:border-blue-50 transition-colors">
                {n.content}
              </div>
            </div>
          ))}
          {filteredNotes.length === 0 && (
            <div className="text-center py-12 bg-slate-50/30 border border-dashed border-slate-200 rounded font-bold text-slate-300 uppercase tracking-widest text-[10px]">
              No historical entries identified for this identifier
            </div>
          )}
        </div>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast('')} />}
    </div>
  );
}
