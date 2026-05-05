'use client';
import React, { useState, useEffect } from 'react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { PlusIcon } from '@/components/ui/Icons';
import { apiFetch } from '@/lib/api';
import authService from '@/lib/auth';
import { toast } from 'sonner';

export default function NurseTasks() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ patientId: '', description: '', dueTime: '', priority: 'Medium' });
  const user = authService.getUser();

  const fetchData = async () => {
    try {
      const [taskRes, patRes] = await Promise.all([
        apiFetch(`/nurse-tasks?nurseId=${user?.id || ''}`),
        apiFetch('/patients')
      ]);
      if (taskRes.status === 'success') setTasks(taskRes.data || []);
      if (patRes.status === 'success') setPatients(patRes.data || []);
    } catch (error) {
      console.error("Failed to fetch task data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const columns: { key: string; label: string }[] = [
    { key: 'todo', label: 'To Do' },
    { key: 'inprogress', label: 'In Progress' },
    { key: 'done', label: 'Completed' },
  ];

  const moveTask = async (task: any) => {
    const nextMap: Record<string, string> = { todo: 'inprogress', inprogress: 'done', done: 'todo' };
    const nextCol = nextMap[task.column] || 'todo';
    
    try {
      await apiFetch('/nurse-tasks', {
        method: 'POST',
        body: JSON.stringify({ ...task, column: nextCol })
      });
      await fetchData();
    } catch (error) {
      toast.error("Failed to transition task state.");
    }
  };

  const handleAdd = async () => {
    if (!form.patientId || !form.description) return;
    setSaving(true);
    try {
      const res = await apiFetch('/nurse-tasks', {
        method: 'POST',
        body: JSON.stringify({ ...form, column: 'todo', assignedNurse: { id: user?.id } })
      });
      if (res.status === 'success') {
        await fetchData();
        setModalOpen(false);
        setForm({ patientId: '', description: '', dueTime: '', priority: 'Medium' });
      }
    } catch (error) {
      toast.error("Failed to commit task to protocol.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
      {[1,2,3].map(i => <SkeletonLoader key={i} height={500} className="rounded-xl shadow-sm" />)}
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Clinical Task Protocol</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Status management for patient care routines</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="h-10 text-[11px] font-black uppercase tracking-widest">
          <PlusIcon size={14} /> 
          <span className="ml-2">Add New Task</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(col => {
          const colTasks = tasks.filter(t => (t.column || 'todo') === col.key);
          return (
            <div key={col.key} className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">{col.label}</span>
                <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-200">{colTasks.length}</span>
              </div>
              
              <div className="space-y-4 min-h-[500px]">
                {colTasks.map(t => (
                  <div key={t.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-blue-200 transition-all group relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${t.priority === 'High' ? 'bg-rose-500' : t.priority === 'Medium' ? 'bg-amber-500' : 'bg-slate-300'}`} />
                    
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-sm font-black text-slate-800 tracking-tight">{t.patient || 'General Protocol'}</div>
                      <Badge status={t.priority} />
                    </div>
                    
                    <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">{t.description}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-1.5 text-blue-600 font-mono text-[10px] font-bold">
                        <span>DUE:</span> {t.dueTime || 'ASAP'}
                      </div>
                      <button 
                        onClick={() => moveTask(t)}
                        className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors bg-slate-50 px-2 py-1 rounded border border-slate-100"
                      >
                        Transition →
                      </button>
                    </div>
                  </div>
                ))}
                
                {colTasks.length === 0 && (
                  <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl p-10 text-center opacity-20">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Active Tasks</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Initialize Clinical Protocol"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Abort interface</Button><Button loading={saving} onClick={handleAdd}>Commit Task</Button></>}>
        <div className="space-y-4 py-2">
          <Input label="Target Patient Identity" options={patients.map(p => ({ value: p.id, label: p.name }))} value={form.patientId} onChange={e => setForm({...form, patientId: e.target.value})} />
          <Input label="Protocol Description" isTextarea placeholder="Describe the care routine or medication task..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Temporal Due Time" type="time" value={form.dueTime} onChange={e => setForm({...form, dueTime: e.target.value})} />
            <Input label="Clinical Priority" options={[{value:'Low',label:'Low (Routine)'},{value:'Medium',label:'Medium (Alert)'},{value:'High',label:'High (STAT)'}]} value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
