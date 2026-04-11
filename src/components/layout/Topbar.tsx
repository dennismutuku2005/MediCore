'use client';
import React from 'react';
import { BellIcon, MonitorIcon, MenuIcon } from '../ui/Icons';
import SearchInput from '../ui/SearchInput';

export default function Topbar({ pageTitle, username, onMenuToggle }: any) {
  return (
    <header className="fixed top-0 right-0 left-0 lg:left-[240px] h-[64px] bg-white border-b border-slate-200 z-[900] flex items-center justify-between px-5 transition-[left] duration-300">
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-1 text-slate-500 hover:text-slate-800 transition-colors" onClick={onMenuToggle}>
          <MenuIcon size={20} />
        </button>
        <h2 className="text-base font-bold text-slate-800 tracking-tight">{pageTitle}</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex w-[250px]">
          <SearchInput placeholder="Search records..." />
        </div>

        <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded text-slate-500 hover:bg-slate-50 transition-colors"><MonitorIcon size={18} /></button>
        <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded text-slate-500 hover:bg-slate-50 transition-colors relative">
          <BellIcon size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white"></span>
        </button>
        
        <div className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-[11px] font-extrabold text-slate-600 tracking-wider">
          {username.toUpperCase()}
        </div>
      </div>
    </header>
  );
}
