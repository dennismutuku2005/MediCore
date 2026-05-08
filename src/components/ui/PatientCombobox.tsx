'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { apiFetch } from '@/lib/api';
import { SearchIcon } from '@/components/ui/Icons';

const MAX_VISIBLE = 8;
const DEBOUNCE_MS = 250;

export interface PatientSuggestion {
  id: number;
  name: string;
  gender?: string;
  bloodType?: string;
  status?: string;
}

interface Props {
  /** Currently selected patient ID (empty string = nothing selected) */
  value: string;
  /** Display name of the selected patient */
  displayValue: string;
  onChange: (id: string, name: string) => void;
  label?: string;
  placeholder?: string;
  /** Optional static list — if provided, searches locally instead of calling API */
  staticList?: PatientSuggestion[];
}

export default function PatientCombobox({
  value,
  displayValue,
  onChange,
  label = 'Patient',
  placeholder = 'Type name to search...',
  staticList,
}: Props) {
  const [query, setQuery]               = useState(displayValue);
  const [suggestions, setSuggestions]   = useState<PatientSuggestion[]>([]);
  const [open, setOpen]                 = useState(false);
  const [loading, setLoading]           = useState(false);
  const [highlighted, setHighlighted]   = useState(0);
  const [total, setTotal]               = useState(0);
  const wrapperRef                      = useRef<HTMLDivElement>(null);
  const inputRef                        = useRef<HTMLInputElement>(null);
  const debounceRef                     = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep display in sync when parent changes (e.g. modal re-open/close)
  useEffect(() => { setQuery(displayValue); }, [displayValue]);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        // Restore confirmed name if user typed but didn't select
        setQuery(value ? displayValue : '');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [value, displayValue]);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setSuggestions([]); setOpen(false); return; }

    if (staticList) {
      // Local filter — no API call
      const filtered = staticList.filter(p =>
        p.name?.toLowerCase().includes(q.toLowerCase())
      );
      setTotal(filtered.length);
      setSuggestions(filtered.slice(0, MAX_VISIBLE));
      setOpen(true);
      return;
    }

    // API search
    setLoading(true);
    try {
      const res = await apiFetch(`/patients/search?name=${encodeURIComponent(q)}&limit=${MAX_VISIBLE}`);
      if (res?.status === 'success') {
        setSuggestions(res.data || []);
        setTotal(res.data?.length ?? 0);
        setOpen(true);
      }
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [staticList]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    setHighlighted(0);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(q), DEBOUNCE_MS);
  };

  const select = (p: PatientSuggestion) => {
    onChange(String(p.id), p.name);
    setQuery(p.name);
    setOpen(false);
    setSuggestions([]);
    setHighlighted(0);
  };

  const clear = () => {
    onChange('', '');
    setQuery('');
    setSuggestions([]);
    setOpen(false);
    inputRef.current?.focus();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted(h => Math.min(h + 1, suggestions.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)); }
    if (e.key === 'Enter')     { e.preventDefault(); if (suggestions[highlighted]) select(suggestions[highlighted]); }
    if (e.key === 'Escape')    { setOpen(false); setQuery(value ? displayValue : ''); }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      {label && (
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
          {label}
        </label>
      )}

      {/* Input */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          {loading
            ? <span className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin inline-block" />
            : <SearchIcon size={14} />
          }
        </span>
        <input
          ref={inputRef}
          className="w-full h-9 pl-9 pr-8 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors placeholder:text-slate-400"
          placeholder={placeholder}
          value={query}
          autoComplete="off"
          onChange={handleChange}
          onFocus={() => { if (query.trim() && suggestions.length > 0) setOpen(true); }}
          onKeyDown={handleKey}
        />
        {/* Clear button */}
        {(query || value) && (
          <button
            type="button"
            onClick={clear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 text-base leading-none transition-colors"
            tabIndex={-1}
            title="Clear"
          >×</button>
        )}
      </div>

      {/* Confirmed selection badge */}
      {value && (
        <div className="mt-1.5 flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-blue-600 flex items-center justify-center text-white text-[8px] font-black shrink-0">
            {displayValue.charAt(0).toUpperCase()}
          </div>
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide truncate">
            {displayValue} · ID #{value}
          </span>
        </div>
      )}

      {/* Suggestions dropdown */}
      {open && suggestions.length > 0 && (
        <div className="absolute z-[100] top-full mt-1 left-0 right-0 bg-white border border-slate-200 rounded-md shadow-xl overflow-hidden">
          {suggestions.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onMouseDown={() => select(p)}
              className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors border-b border-slate-50 last:border-0 ${
                i === highlighted ? 'bg-blue-50' : 'hover:bg-slate-50'
              }`}
            >
              <div className="w-7 h-7 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-[11px] font-black text-slate-500 shrink-0">
                {p.name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className={`text-sm font-bold leading-tight truncate ${i === highlighted ? 'text-blue-700' : 'text-slate-800'}`}>
                  {p.name}
                </div>
                <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                  ID #{p.id}{p.gender ? ` · ${p.gender}` : ''}{p.bloodType ? ` · ${p.bloodType}` : ''}
                </div>
              </div>
              {p.status && (
                <span className={`ml-auto text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded shrink-0 ${
                  p.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                }`}>{p.status}</span>
              )}
            </button>
          ))}
          {total >= MAX_VISIBLE && (
            <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 border-t border-slate-100 flex items-center gap-1.5">
              <span>Showing top {MAX_VISIBLE}</span>
              <span className="text-slate-300">·</span>
              <span>type more to narrow</span>
            </div>
          )}
        </div>
      )}

      {/* No results */}
      {open && !loading && query.trim().length >= 1 && suggestions.length === 0 && (
        <div className="absolute z-[100] top-full mt-1 left-0 right-0 bg-white border border-slate-200 rounded-md shadow-xl px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          No patients found for "{query}"
        </div>
      )}
    </div>
  );
}
