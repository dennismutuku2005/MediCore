'use client';
import React from 'react';
import { SearchIcon } from './Icons';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

export default function SearchInput({ containerClassName = '', ...props }: SearchInputProps) {
  return (
    <div className={`relative w-full ${containerClassName}`}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        <SearchIcon size={14} />
      </span>
      <input 
        className="w-full h-9 pl-9 pr-3 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-400"
        {...props}
      />
    </div>
  );
}
