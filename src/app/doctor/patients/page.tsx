'use client';
import React, { useState, useEffect } from 'react';
import { tableStyles } from '@/components/ui/Table';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { CloseIcon, ChevronDownIcon } from '@/components/ui/Icons';
import { patients, vitals, prescriptions, labTests, doctorNotes } from '@/lib/mockData';

export default function DoctorPatients() {
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ info: true, vitals: true, meds: true, labs: true, notes: true });

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  const myPatients = patients.filter(p => p.assignedDoctor === 'Dr. Amina Odhiambo');
  const selectedP = myPatients.find(p => p.id === selected);

  if (loading) return <SkeletonLoader height={52} count={6} />;

  return (
    <>
      <Table headers={['Name', 'Age', 'Diagnosis', 'Ward', 'Status']}>
        {myPatients.map(p => (
          <tr key={p.id} className={tableStyles.clickableRow} onClick={() => setSelected(p.id)}>
            <td><div className={tableStyles.nameCell}><div className={tableStyles.avatar}>{p.name.split(' ').map(w => w[0]).join('')}</div><strong>{p.name}</strong></div></td>
            <td>{p.age}</td><td>{p.diagnosis}</td><td>{p.ward}</td><td><Badge status={p.status} /></td>
          </tr>
        ))}
      </Table>

      {selectedP && (
        <>
          <div className="fixed inset-0 bg-slate-900/20 z-[1001]" onClick={() => setSelected(null)} />
          <div className="fixed right-0 top-0 bottom-0 w-[400px] max-w-full bg-white border-l border-slate-200 z-[1002] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">{selectedP.name}</h2>
              <button className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors" onClick={() => setSelected(null)}><CloseIcon size={18} /></button>
            </div>

            {/* Personal Info */}
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-center justify-between text-sm font-bold text-slate-800 cursor-pointer select-none hover:text-blue-600 transition-colors uppercase tracking-tight mb-2" onClick={() => setExpanded(e => ({ ...e, info: !e.info }))}>Personal Info <ChevronDownIcon size={14} /></div>
              {expanded.info && (<>
                <div className="flex justify-between py-1.5 text-sm border-b border-dashed border-slate-100 last:border-0"><span className="text-slate-500 font-semibold">Age</span><span className="text-slate-800 font-bold">{selectedP.age}</span></div>
                <div className="flex justify-between py-1.5 text-sm border-b border-dashed border-slate-100 last:border-0"><span className="text-slate-500 font-semibold">Gender</span><span className="text-slate-800 font-bold">{selectedP.gender}</span></div>
                <div className="flex justify-between py-1.5 text-sm border-b border-dashed border-slate-100 last:border-0"><span className="text-slate-500 font-semibold">Blood Type</span><span className="text-slate-800 font-bold">{selectedP.bloodType}</span></div>
                <div className="flex justify-between py-1.5 text-sm border-b border-dashed border-slate-100 last:border-0"><span className="text-slate-500 font-semibold">Diagnosis</span><span className="text-slate-800 font-bold">{selectedP.diagnosis}</span></div>
              </>)}
            </div>

            {/* Vitals */}
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-center justify-between text-sm font-bold text-slate-800 cursor-pointer select-none hover:text-blue-600 transition-colors uppercase tracking-tight mb-2" onClick={() => setExpanded(e => ({ ...e, vitals: !e.vitals }))}>Current Vitals <ChevronDownIcon size={14} /></div>
              {expanded.vitals && (() => {
                const v = vitals.find(vt => vt.patientId === selectedP.id);
                if (!v) return <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No vitals</p>;
                return (<>
                  <div className="flex justify-between py-1.5 text-sm border-b border-dashed border-slate-100 last:border-0"><span className="text-slate-500 font-semibold">BP</span><span className="text-slate-800 font-bold">{v.bp}</span></div>
                  <div className="flex justify-between py-1.5 text-sm border-b border-dashed border-slate-100 last:border-0"><span className="text-slate-500 font-semibold">HR</span><span className="text-slate-800 font-bold">{v.hr} bpm</span></div>
                  <div className="flex justify-between py-1.5 text-sm border-b border-dashed border-slate-100 last:border-0"><span className="text-slate-500 font-semibold">Temp</span><span className="text-slate-800 font-bold">{v.temp}°C</span></div>
                  <div className="flex justify-between py-1.5 text-sm border-b border-dashed border-slate-100 last:border-0"><span className="text-slate-500 font-semibold">SpO2</span><span className="text-slate-800 font-bold">{v.spo2}%</span></div>
                </>);
              })()}
            </div>

            {/* Medications */}
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-center justify-between text-sm font-bold text-slate-800 cursor-pointer select-none hover:text-blue-600 transition-colors uppercase tracking-tight mb-2" onClick={() => setExpanded(e => ({ ...e, meds: !e.meds }))}>Medications <ChevronDownIcon size={14} /></div>
              {expanded.meds && prescriptions.filter(rx => rx.patient === selectedP.name).map(rx => (
                <div key={rx.id} className="flex justify-between py-1.5 text-sm border-b border-dashed border-slate-100 last:border-0"><span className="text-slate-500 font-semibold">{rx.medication}</span><span className="text-slate-800 font-bold">{rx.dosage} — {rx.frequency}</span></div>
              ))}
            </div>

            {/* Lab Results */}
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-center justify-between text-sm font-bold text-slate-800 cursor-pointer select-none hover:text-blue-600 transition-colors uppercase tracking-tight mb-2" onClick={() => setExpanded(e => ({ ...e, labs: !e.labs }))}>Lab Results <ChevronDownIcon size={14} /></div>
              {expanded.labs && labTests.filter(lt => lt.patient === selectedP.name).map(lt => (
                <div key={lt.id} className="flex justify-between py-1.5 text-sm border-b border-dashed border-slate-100 last:border-0"><span className="text-slate-500 font-semibold">{lt.testType}</span><span className="text-slate-800 font-bold">{lt.result || lt.status}</span></div>
              ))}
            </div>

            {/* Notes */}
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-center justify-between text-sm font-bold text-slate-800 cursor-pointer select-none hover:text-blue-600 transition-colors uppercase tracking-tight mb-2" onClick={() => setExpanded(e => ({ ...e, notes: !e.notes }))}>Doctor Notes <ChevronDownIcon size={14} /></div>
              {expanded.notes && doctorNotes.filter(dn => dn.patientId === selectedP.id).map(dn => (
                <div key={dn.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                  <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{dn.date}</div>
                  <div style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{dn.content}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
