'use client';
import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import authService from '@/lib/auth';

export default function DoctorNotes() {
  const [loading, setLoading]           = useState(true);
  const [patients, setPatients]         = useState<any[]>([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [notes, setNotes]               = useState<any[]>([]);
  const [noteText, setNoteText]         = useState('');
  const [saving, setSaving]             = useState(false);
  const user = authService.getUser();

  const fetchNotes = async (patientId: number) => {
    try {
      const res = await apiFetch(`/doctor/notes?patientId=${patientId}`);
      if (res.status === 'success') {
        setNotes(res.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  };

  useEffect(() => {
    async function init() {
      try {
        const res = await apiFetch(`/doctor/patients?doctorId=${user?.id || ''}`);
        if (res.status === 'success') {
          const list = res.data || [];
          setPatients(list);
          if (list.length > 0) {
            setSelectedPatient(list[0].id);
            await fetchNotes(list[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to initialize notes page:", error);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [user?.id]);

  useEffect(() => {
    if (selectedPatient) {
      fetchNotes(selectedPatient);
    }
  }, [selectedPatient]);

  const handleSave = async () => {
    if (!noteText.trim() || !selectedPatient) return;
    setSaving(true);
    try {
      const payload = {
        patient: { id: selectedPatient },
        doctor: { id: user?.id },
        content: noteText,
        isPrivate: false
      };
      const res = await apiFetch('/doctor/notes', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (res.status === 'success') {
        setNoteText('');
        toast.success('Clinical note committed successfully');
        await fetchNotes(selectedPatient);
      }
    } catch (error) {
      toast.error('Protocol failure: Could not save note');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 h-[calc(100vh-120px)] animate-in fade-in duration-300">
      <div className="bg-white border border-slate-200 rounded p-4 space-y-4 shadow-sm">
        <SkeletonLoader width="60%" height={20} />
        {[1,2,3,4,5].map(i => <SkeletonLoader key={i} height={40} className="rounded" />)}
      </div>
      <div className="space-y-6 overflow-y-auto pr-2">
        <div className="bg-white border border-slate-200 rounded p-6 space-y-4 shadow-sm">
          <SkeletonLoader width="30%" height={16} />
          <SkeletonLoader height={120} />
          <div className="flex justify-end"><SkeletonLoader width={100} height={40} /></div>
        </div>
        {[1,2].map(i => (
          <div key={i} className="bg-white border border-slate-200 rounded p-6 space-y-3 shadow-sm">
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
      {/* Patient Sidebar with Search */}
      <div className="bg-white border border-slate-200 rounded flex flex-col shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-3">Clinical Census</h3>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none text-xs">🔍</span>
            <input
              className="w-full h-8 pl-7 pr-3 border border-slate-200 rounded text-xs bg-white focus:outline-none focus:border-blue-500 placeholder:text-slate-300 transition-colors"
              placeholder="Search patients..."
              value={patientSearch}
              onChange={e => setPatientSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {patients
            .filter(p => p.name?.toLowerCase().includes(patientSearch.toLowerCase()))
            .map(p => (
            <div 
              key={p.id} 
              className={`px-5 py-4 cursor-pointer transition-all group ${selectedPatient === p.id ? 'bg-blue-50/50 border-r-4 border-r-blue-600' : 'hover:bg-slate-50'}`}
              onClick={() => setSelectedPatient(p.id)}
            >
              <div className={`text-sm font-bold tracking-tight ${selectedPatient === p.id ? 'text-blue-700' : 'text-slate-700 group-hover:text-slate-900'}`}>{p.name}</div>
              <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">#{p.id} • {p.diagnosis || 'Observation'}</div>
            </div>
          ))}
            ))}
          {patients.filter(p => p.name?.toLowerCase().includes(patientSearch.toLowerCase())).length === 0 && (
            <div className="p-8 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
              {patientSearch ? `No match for "${patientSearch}"` : 'No assigned patients'}
            </div>
          )}
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
                  <button key={btn} className="w-7 h-7 rounded border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-400 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm">{btn}</button>
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
            <Button loading={saving} onClick={handleSave} className="px-8 shadow-sm h-10 text-[11px] font-black uppercase tracking-widest">Commit to Record</Button>
          </div>
        </div>

        {/* History Chronology */}
        <div className="space-y-4 pb-10">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 mb-2">Chronological History</div>
          {notes.map(n => (
            <div key={n.id} className="bg-white border border-slate-200 rounded p-6 shadow-sm group hover:border-blue-200 transition-colors relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-20" />
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {n.noteDate
                    ? new Date(n.noteDate).toLocaleString()
                    : new Date(n.createdAt || n.date || Date.now()).toLocaleString()}
                </span>
                </div>
                <Badge status="info">Protocol Entry</Badge>
              </div>
              <div className="text-sm text-slate-600 leading-relaxed font-medium pl-3.5 border-l-2 border-slate-50 group-hover:border-blue-100 transition-colors">
                {n.content}
              </div>
            </div>
          ))}
          {notes.length === 0 && (
            <div className="text-center py-12 bg-slate-50/30 border border-dashed border-slate-200 rounded font-bold text-slate-300 uppercase tracking-widest text-[10px]">
              No historical entries identified for this identifier
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
