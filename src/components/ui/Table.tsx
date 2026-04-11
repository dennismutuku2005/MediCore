'use client';
import React from 'react';
export const tableStyles = {
  clickableRow: "hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-100 last:border-0",
  nameCell: "flex items-center gap-3 py-2",
  avatar: "w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0"
};

interface TableProps {
  headers: string[];
  children: React.ReactNode;
  loading?: boolean;
}

export default function Table({ headers, children, loading }: TableProps) {
  return (
    <div className="w-full overflow-x-auto bg-white border border-slate-200 rounded-lg shadow-sm">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm text-slate-800">
          {loading ? (
            <tr>
              <td colSpan={headers.length} className="px-4 py-8 text-center text-slate-400 font-semibold">Loading...</td>
            </tr>
          ) : React.Children.count(children) === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-4 py-8 text-center text-slate-400 font-semibold">No records found.</td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}

