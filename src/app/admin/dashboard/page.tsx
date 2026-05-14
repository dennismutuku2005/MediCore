'use client';
import React, { useState, useEffect, useCallback } from 'react';
import StatCard from '@/components/ui/StatCard';
import BarChart from '@/components/charts/BarChart';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import { PersonIcon, CalendarIcon, BedIcon, ActivityIcon, TrendUpIcon } from '@/components/ui/Icons';
import { apiFetch } from '@/lib/api';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    pendingLabs: 0,
    wardOccupancy: 0
  });
  const [admissions, setAdmissions] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [timeRange, setTimeRange] = useState(30);
  const [fetchingCharts, setFetchingCharts] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [dashboardData, chartData, activityData, apptData] = await Promise.all([
          apiFetch('/dashboard'),
          apiFetch('/dashboard?action=charts'),
          apiFetch('/dashboard?action=recent_transactions'),
          apiFetch('/appointments')
        ]);

        if (dashboardData.status === 'success') {
          setStats({
            totalPatients: dashboardData.data.totalPatients || 0,
            totalDoctors: dashboardData.data.totalDoctors || 0,
            totalAppointments: dashboardData.data.totalAppointments || 0,
            pendingLabs: dashboardData.data.pendingLabs || 0,
            wardOccupancy: dashboardData.data.wardOccupancy || 0
          });
        }

        if (chartData.status === 'success') {
          setAdmissions(chartData.data.admissions || []);
        }

        if (activityData.status === 'success') {
          setRecentActivities(activityData.data || []);
        }

        if (apptData.status === 'success') {
          setAppointments(apptData.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    
    // Log View
    apiFetch('/activities', {
      method: 'POST',
      body: JSON.stringify({
        icon: 'MonitorIcon',
        description: 'Admin accessed system overview dashboard',
        patientName: 'Admin'
      })
    }).catch(console.error);
  }, []);

  const fetchCharts = useCallback(async (days: number) => {
    setFetchingCharts(true);
    try {
      const res = await apiFetch(`/dashboard?action=charts&days=${days}`);
      if (res.status === 'success') {
        setAdmissions(res.data.admissions || []);
      }
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
    } finally {
      setFetchingCharts(false);
    }
  }, []);

  useEffect(() => {
    fetchCharts(timeRange);
  }, [timeRange, fetchCharts]);

  if (loading) return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <SkeletonLoader key={i} height={100} className="rounded shadow-sm" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><SkeletonLoader height={350} className="rounded shadow-sm" /></div>
        <div className="space-y-6">
          <SkeletonLoader height={350} className="rounded shadow-sm" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">System overview</h1>
          <p className="text-slate-400 text-[11px] font-medium mt-0.5">Real-time operations dashboard</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100/50 px-3 py-1.5 rounded border border-slate-200">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[11px] font-medium text-slate-500">Live: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<PersonIcon size={20} />} label="Total Patients" value={stats.totalPatients.toLocaleString()} iconBg="rgba(37, 99, 235, 0.1)" iconColor="#2563eb" />
        <StatCard icon={<CalendarIcon size={20} />} label="Appointments" value={stats.totalAppointments} iconBg="rgba(245, 158, 11, 0.1)" iconColor="#d97706" />
        <StatCard icon={<BedIcon size={20} />} label="Ward Occupancy" value={stats.wardOccupancy} iconBg="rgba(16, 185, 129, 0.1)" iconColor="#059669" />
        <StatCard icon={<ActivityIcon size={20} />} label="Pending Labs" value={stats.pendingLabs} iconBg="rgba(239, 68, 68, 0.1)" iconColor="#dc2626" />
      </div>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Admissions Chart Section */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Admissions overview</h3>
              <p className="text-slate-400 text-[11px] font-medium mt-0.5">Historical growth trend</p>
            </div>
            <div className="flex gap-1">
                {[7, 30].map(d => (
                    <button 
                        key={d} 
                        onClick={() => setTimeRange(d)}
                        disabled={fetchingCharts}
                        className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${timeRange === d ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-100 disabled:opacity-50'}`}
                    >
                        {d} days
                    </button>
                ))}
            </div>
          </div>
          <div className="flex-1 p-6">
            <div className={`h-[250px] relative transition-opacity duration-300 ${fetchingCharts ? 'opacity-50' : 'opacity-100'}`}>
              <BarChart data={admissions} height={250} color="#2563eb" />
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-sm font-semibold text-slate-800">Recent activity</h3>
            <p className="text-slate-400 text-[11px] font-medium mt-0.5">System audit logs</p>
          </div>
          <div className="flex-1 px-5 py-4 overflow-y-auto max-h-[350px] space-y-4">
            {recentActivities.length > 0 ? recentActivities.map((act: any, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-700 leading-snug">{act.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-medium text-slate-400">{act.patientName || 'Admin'}</span>
                    <span className="text-[11px] font-medium text-blue-500">{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 py-10">
                <ActivityIcon size={32} className="opacity-20 mb-2" />
                <span className="text-[11px] font-medium">No audit logs found</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Operational table */}
      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div>
                <h3 className="text-sm font-semibold text-slate-800">Scheduled appointments</h3>
                <p className="text-slate-400 text-[11px] font-medium mt-0.5">Daily clinical queue</p>
            </div>
            <Badge status="info">LIVE FEED</Badge>
        </div>
        <div className="overflow-x-auto">
          <Table headers={['ID', 'Patient Name', 'Assigned Doctor', 'Department', 'Scheduled Time', 'Status']}>
            {appointments.slice(0, 5).map((app: any) => (
              <tr key={app.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 group">
                <td className="px-5 py-3 text-[10px] font-mono text-slate-400 italic">#{app.id}</td>
                <td className="px-5 py-3">
                  <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600">{app.patient?.name || app.patient}</span>
                </td>
                <td className="px-5 py-3 text-sm text-slate-600 font-medium">{app.doctor?.name || app.doctor}</td>
                <td className="px-5 py-3 text-[11px] font-medium text-slate-500">{app.department}</td>
                <td className="px-5 py-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-700">{app.time}</span>
                    <span className="text-[11px] text-slate-400 font-medium">{app.date}</span>
                  </div>
                </td>
                <td className="px-5 py-3"><Badge status={app.status} /></td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr>
                <td colSpan={6} className="px-8 py-10 text-center">
                  <span className="text-[11px] font-medium text-slate-300">No active sessions</span>
                </td>
              </tr>
            )}
          </Table>
        </div>
      </div>
    </div>
  );
}
