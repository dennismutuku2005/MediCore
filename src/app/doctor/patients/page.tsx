'use client';
import React, { useState, useEffect } from 'react';
import { tableStyles } from '@/components/ui/Table';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { CloseIcon, ChevronDownIcon, ActivityIcon, ClipboardIcon, PlusIcon } from '@/components/ui/Icons';
import { patients, vitals, prescriptions, labTests, doctorNotes } from '@/lib/mockData';

export default function DoctorPatients() {
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ info: true, vitals: true, meds: true, labs: true, notes: true });

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  const myPatients = patients.filter(p => p.assignedDoctor === 'Dr. Amina Odhiambo');
  const selectedP = myPatients.find(p => p.id === selected);

  if (loading) return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded p-6 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <SkeletonLoader width={180} height={20} />
          <SkeletonLoader width={80} height={20} />
        </div>
        <div className="space-y-4">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0">
               <SkeletonLoader variant="circular" width={32} height={32} />
               <div className="flex-1 space-y-2">
                 <SkeletonLoader width="25%" height={16} />
                 <SkeletonLoader width="15%" height={12} />
               </div>
               <SkeletonLoader width="20%" height={14} />
               <SkeletonLoader width="15%" height={14} />
               <SkeletonLoader width={70} height={24} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Assigned Clinical Census</h3>
          <Badge status="active">ACTIVE CASES</Badge>
        </div>
        <Table headers={['Identity', 'Biological Age', 'Current Diagnosis', 'Location', 'Status']}>
          {myPatients.map(p => (
            <tr 
              key={p.id} 
              className={`hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100 last:border-0 font-medium ${selected === p.id ? 'bg-blue-50/50' : ''}`} 
              onClick={() => setSelected(p.id)}
            >
              <td className="px-5 py-3"><div className="flex items-center gap-3"><div className={tableStyles.avatar}>{p.name.charAt(0)}</div><span className="font-bold text-slate-800">{p.name}</span></div></td>
              <td className="px-5 py-3 text-sm text-slate-500">{p.age} Yrs</td>
              <td className="px-5 py-3 text-sm text-slate-800 font-bold">{p.diagnosis}</td>
              <td className="px-5 py-3 text-sm text-slate-600 font-mono italic">{p.ward}</td>
              <td className="px-5 py-3 text-sm"><Badge status={p.status} /></td>
            </tr>
          ))}
        </Table>
      </div>

      <Modal 
        open={!!selectedP} 
        onClose={() => setSelected(null)} 
        title="Comprehensive Clinical Insight"
        footer={<><Button variant="secondary" onClick={() => setSelected(null)}>Dismiss</Button><Button onClick={() => {}}>Update Progress Note</Button></>}
      >
        {selectedP && (
          <div className="flex flex-col animate-in fade-in duration-300">
            <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
              {/* Vitals Summary */}
              <div className="py-2 pb-6">
                <div className="flex items-center justify-between font-bold text-[10px] text-slate-400 uppercase tracking-[0.15em] mb-4">Diagnostic Vitals <ActivityIcon size={12} /></div>
                {(() => {
                  const v = vitals.find(vt => vt.patientId === selectedP.id);
                  if (!v) return <div className="text-sm italic text-slate-300">No recorded vitals found</div>;
                  return (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-3 rounded border border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">SYS/DIA</div>
                        <div className="text-sm font-black text-slate-800">{v.bp}</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded border border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">PERFUSION</div>
                        <div className="text-sm font-black text-slate-800">{v.spo2}%</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded border border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">HEART RATE</div>
                        <div className="text-sm font-black text-slate-800">{v.hr} BPM</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded border border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">THERMAL</div>
                        <div className="text-sm font-black text-slate-800">{v.temp}°C</div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Medication Compliance */}
              <div className="py-6">
                <div className="flex items-center justify-between font-bold text-[10px] text-slate-400 uppercase tracking-[0.15em] mb-4">Medication Logistics <ClipboardIcon size={12} /></div>
                <div className="space-y-2">
                  {prescriptions.filter(rx => rx.patient === selectedP.name).map(rx => (
                    <div key={rx.id} className="flex flex-col p-3 border border-slate-100 rounded hover:border-slate-200 transition-colors">
                      <div className="text-sm font-bold text-slate-800">{rx.medication}</div>
                      <div className="text-[10px] font-medium text-slate-500 mt-0.5">{rx.dosage} • {rx.frequency}</div>
                    </div>
                  ))}
                  {prescriptions.filter(rx => rx.patient === selectedP.name).length === 0 && (
                    <div className="text-sm italic text-slate-300 text-center py-4 bg-slate-50/50 rounded border border-dashed border-slate-100">No active prescriptions allotted</div>
                  )}
                </div>
              </div>

              {/* Clinical Chronology */}
              <div className="py-6">
                <div className="flex items-center justify-between font-bold text-[10px] text-slate-400 uppercase tracking-[0.15em] mb-4">Clinical Chronology</div>
                <div className="space-y-5">
                  {doctorNotes.filter(dn => dn.patientId === selectedP.id).map(dn => (
                    <div key={dn.id} className="relative pl-5 border-l-2 border-slate-100">
                      <div className="absolute top-1.5 -left-[5px] w-2 h-2 rounded-full bg-slate-200" />
                      <div className="text-[10px] font-bold text-blue-600 uppercase mb-1">{dn.date}</div>
                      <div className="text-xs text-slate-600 leading-relaxed font-medium">{dn.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
