'use client';
import React, { useState, useEffect } from 'react';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { wards } from '@/lib/mockData';

export default function AdminWards() {
  const [loading, setLoading] = useState(true);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [hoveredBed, setHoveredBed] = useState<string | null>(null);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  if (loading) return <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">{[1,2,3,4].map(i => <SkeletonLoader key={i} height={160} />)}</div>;

  const activeWard = wards.find(w => w.name === selectedWard);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {wards.map(w => (
          <div key={w.name} className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm mb-4" onClick={() => setSelectedWard(w.name === selectedWard ? null : w.name)}>
            <div className="text-sm font-bold text-slate-800 uppercase tracking-tight mb-2">{w.name}</div>
            <div className="relative"><span>Total Beds</span><span>{w.totalBeds}</span></div>
            <div className="relative"><span>Occupied</span><span>{w.occupied}</span></div>
            <div className="relative"><span>Available</span><span>{w.available}</span></div>
            <div className="relative">
              <div className="relative" style={{ width: `${(w.occupied / w.totalBeds) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      {activeWard && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm mb-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight mb-2">{activeWard.name} — Bed Layout</h3>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16, fontSize: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span className="relative" style={{ width: 16, height: 16, background: 'var(--success-light)', border: '1px solid #059669' }} /> Available</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span className="relative" style={{ width: 16, height: 16, background: 'var(--danger-light)', border: '1px solid #DC2626' }} /> Occupied</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span className="relative" style={{ width: 16, height: 16, background: 'var(--warning-light)', border: '1px solid #D97706' }} /> Reserved</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {activeWard.beds.map(bed => (
              <div key={bed.number}
                className={`relative ${bed.status === 'available' ? styles.bedAvailable : bed.status === 'occupied' ? styles.bedOccupied : styles.bedReserved}`}
                onMouseEnter={() => setHoveredBed(bed.number)} onMouseLeave={() => setHoveredBed(null)}>
                {bed.number.replace(activeWard.name.replace('Ward ', '').replace('ICU', 'ICU'), '')}
                {hoveredBed === bed.number && (
                  <div className="relative">{bed.number}{bed.patient ? ` — ${bed.patient}` : ' — Empty'}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
