'use client';
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  isTextarea?: boolean;
  options?: { value: string; label: string }[];
}

export default function Input({ label, error, icon, isTextarea, options, ...props }: InputProps) {
  const baseClasses = "w-full h-8 px-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors placeholder:text-slate-400";
  
  const isReadOnly = props.readOnly || (props.value !== undefined && !props.onChange);
  const safeProps = { ...props, readOnly: isReadOnly };

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>}
      
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}
        
        {options ? (
          <select className={`${baseClasses} appearance-none pr-8`} {...(props as any)}>
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        ) : isTextarea ? (
          <textarea className={`${baseClasses} h-auto min-h-[80px] py-2`} {...(safeProps as any)} />
        ) : (
          <input className={`${baseClasses} ${icon ? 'pl-9' : ''}`} {...(safeProps as any)} />
        )}
      </div>
      
      {error && <p className="text-[11px] text-rose-600">{error}</p>}
    </div>
  );
}
