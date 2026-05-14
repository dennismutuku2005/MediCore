'use client';
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { apiFetch } from '@/lib/api';
import { ClipboardIcon, SearchIcon, FilterIcon } from '@/components/ui/Icons';

export default function SystemLogs() {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await apiFetch('/activities');
        if (res.status === 'success') {
          setActivities(res.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredLogs = activities.filter(a => 
    a.description.toLowerCase().includes(search.toLowerCase()) ||
    a.patientName?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="space-y-4">
      <SkeletonLoader height={40} />
      <SkeletonLoader height={400} />
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-medium text-slate-800">System audit logs</h2>
          <p className="text-[10px] text-slate-400 mt-1">Real-time tracking of all clinical and administrative actions</p>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <SearchIcon size={14} />
          </div>
          <input
            type="text"
            placeholder="Search activities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full sm:w-64 pl-10 pr-3 h-10 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <ClipboardIcon size={16} className="text-blue-600" />
            <h3 className="text-xs font-medium text-slate-700">Activity timeline</h3>
          </div>
          <div className="text-[10px] text-slate-400 font-medium">{filteredLogs.length} events found</div>
        </div>

        <div className="overflow-x-auto">
          <Table headers={['Timestamp', 'Event Type', 'Description', 'Associated Profile', 'System Status']}>
            {filteredLogs.map((a: any) => (
              <tr key={a.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
                <td className="px-5 py-3 text-[11px] font-medium text-slate-500">
                  {a.actionDate || 'Recent'}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-[11px] font-medium text-slate-700">{a.icon || 'General'}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-xs text-slate-700 font-medium">
                  {a.description}
                </td>
                <td className="px-5 py-3 text-[11px] text-slate-600">
                  {a.patientName || 'System'}
                </td>
                <td className="px-5 py-3">
                  <Badge status="completed">Verified</Badge>
                </td>
              </tr>
            ))}
          </Table>
          
          {filteredLogs.length === 0 && (
            <div className="p-20 text-center text-slate-400">
              <div className="text-sm">No activities match your search</div>
              <button onClick={() => setSearch('')} className="text-[10px] text-blue-600 mt-2 hover:underline">Clear filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
