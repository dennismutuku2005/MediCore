'use client';
import React, { useState, useEffect } from 'react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { PlusIcon } from '@/components/ui/Icons';
import { nurseTasks as initial, patients } from '@/lib/mockData';
import { NurseTask } from '@/lib/types';

export default function NurseTasks() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<NurseTask[]>(initial);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ patient: '', description: '', dueTime: '', priority: '' });

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  const columns: { key: NurseTask['column']; label: string }[] = [
    { key: 'todo', label: 'To Do' },
    { key: 'inprogress', label: 'In Progress' },
    { key: 'done', label: 'Done' },
  ];

  const moveTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const next: Record<string, NurseTask['column']> = { todo: 'inprogress', inprogress: 'done', done: 'todo' };
      return { ...t, column: next[t.column] };
    }));
  };

  const handleAdd = () => {
    setSaving(true);
    setTimeout(() => {
      setTasks([...tasks, { id: `NT${String(tasks.length+1).padStart(3,'0')}`, patient: form.patient, description: form.description, dueTime: form.dueTime, priority: form.priority as NurseTask['priority'] || 'Medium', column: 'todo', assignedNurse: 'Patricia Wanjiku' }]);
      setSaving(false); setModalOpen(false); setForm({ patient:'', description:'', dueTime:'', priority:'' });
    }, 1000);
  };

  if (loading) return <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">{[1,2,3].map(i => <SkeletonLoader key={i} height={400} />)}</div>;

  return (
    <>
      <div className="flex items-center justify-between mb-6"><div /><Button onClick={() => setModalOpen(true)}><PlusIcon size={16} /> Add Task</Button></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.column === col.key);
          return (
            <div key={col.key} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">{col.label} <span className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">{colTasks.length}</span></div>
              {colTasks.map(t => (
                <div key={t.id} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">{t.patient}</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">{t.description}</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <span className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">{t.dueTime}</span>
                    <Badge status={t.priority} />
                    <button className="text-sm text-blue-600 font-bold hover:text-blue-800 transition-colors cursor-pointer" onClick={() => moveTask(t.id)}>Move →</button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Task"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button loading={saving} onClick={handleAdd}>Add</Button></>}>
        <Input label="Patient" options={patients.filter(p => p.ward === 'Ward A').map(p => ({ value: p.name, label: p.name }))} value={form.patient} onChange={e => setForm({...form, patient: e.target.value})} />
        <Input label="Task Description" isTextarea placeholder="Describe the task..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
          <Input label="Due Time" type="time" value={form.dueTime} onChange={e => setForm({...form, dueTime: e.target.value})} />
          <Input label="Priority" options={[{value:'Low',label:'Low'},{value:'Medium',label:'Medium'},{value:'High',label:'High'}]} value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} />
        </div>
      </Modal>
    </>
  );
}
