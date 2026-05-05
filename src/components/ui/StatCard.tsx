'use client';
import React from 'react';
import { TrendUpIcon, TrendDownIcon } from './Icons';

interface StatCardProps {
  key?: React.Key;
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  iconBg?: string;
  iconColor?: string;
}

export default function StatCard({ icon, label, value, trend, trendUp, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="bg-white border border-slate-200 p-5 rounded flex items-start justify-between shadow-sm">
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-tight mb-1">{label}</p>
        <h4 className="text-2xl font-extrabold text-slate-900">{value}</h4>
        {trend && (
          <div className={`mt-2 flex items-center gap-1 text-xs font-bold ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trendUp ? <TrendUpIcon size={12} /> : <TrendDownIcon size={12} />}
            {trend}
          </div>
        )}
      </div>
      <div 
        className="p-3 rounded"
        style={{ backgroundColor: iconBg || 'rgba(37, 99, 235, 0.1)', color: iconColor || '#2563eb' }}
      >
        {icon}
      </div>
    </div>
  );
}
