'use client';
import React from 'react';

interface BadgeProps {
  key?: React.Key;
  status: string;
  children?: React.ReactNode;
  className?: string;
}

export default function Badge({ status, children, className }: BadgeProps) {
  const getColors = (s: string) => {
    const low = s.toLowerCase();
    if (['active', 'completed', 'confirmed', 'paid', 'instock', 'normal'].includes(low)) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (['pending', 'in-progress', 'routine', 'morning'].includes(low)) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (['critical', 'stat', 'cancelled', 'outofstock', 'abnormal', 'high'].includes(low)) return 'bg-rose-50 text-rose-700 border-rose-200';
    if (['admitted', 'low', 'medium'].includes(low)) return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${getColors(status)} uppercase tracking-wider ${className || ''}`}>
      {children || status}
    </span>
  );
}
