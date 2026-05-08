'use client';
import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon, ChevronDownIcon } from './Icons';

interface Option {
  value: string | number;
  label: string;
  sublabel?: string;
}

interface ComboboxProps {
  label?: string;
  placeholder?: string;
  options: Option[];
  value: string | number;
  onChange: (value: string) => void;
  className?: string;
}

export default function Combobox({
  label,
  placeholder = 'Select option...',
  options,
  value,
  onChange,
  className = '',
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => String(o.value) === String(value));
  
  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = query === '' 
    ? options 
    : options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()) || (o.sublabel && o.sublabel.toLowerCase().includes(query.toLowerCase())));

  return (
    <div ref={wrapperRef} className={`relative flex flex-col gap-1 ${className}`}>
      {label && <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>}
      
      <div 
        className={`relative h-9 flex items-center border rounded transition-all cursor-pointer ${open ? 'border-blue-600 ring-1 ring-blue-100 bg-white' : 'border-slate-200 bg-slate-50 hover:bg-white'}`}
        onClick={() => setOpen(!open)}
      >
        <div className="flex-1 px-3 truncate text-sm">
          {selectedOption ? (
            <span className="font-bold text-slate-800">{selectedOption.label}</span>
          ) : (
            <span className="text-slate-400">{placeholder}</span>
          )}
        </div>
        <div className="px-2 text-slate-300">
          <ChevronDownIcon size={14} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {open && (
        <div className="absolute z-[100] top-full mt-1 left-0 right-0 bg-white border border-slate-200 rounded-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top">
          {/* Search Input */}
          <div className="relative border-b border-slate-50">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <SearchIcon size={12} />
            </div>
            <input 
              autoFocus
              className="w-full h-9 pl-9 pr-3 text-xs outline-none bg-white placeholder:text-slate-300 font-medium"
              placeholder="Filter options..."
              value={query}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Options List */}
          <div className="max-h-[200px] overflow-y-auto py-1">
            {filtered.length > 0 ? filtered.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors flex flex-col ${String(opt.value) === String(value) ? 'bg-blue-50' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(String(opt.value));
                  setOpen(false);
                  setQuery('');
                }}
              >
                <span className={`text-xs font-bold ${String(opt.value) === String(value) ? 'text-blue-700' : 'text-slate-700'}`}>
                  {opt.label}
                </span>
                {opt.sublabel && (
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{opt.sublabel}</span>
                )}
              </button>
            )) : (
              <div className="px-4 py-3 text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center">
                No matching results
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
