'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  DashboardIcon, StethoscopeIcon, NurseIcon, PatientsIcon, 
  FlaskIcon, CalendarIcon, BedIcon, ReportIcon, SettingsIcon, 
  LogoutIcon, CrossMedicalIcon, ClipboardIcon, ActivityIcon,
  FileTextIcon, PillIcon, ClockIcon, DollarIcon, PersonIcon,
  CheckCircleIcon
} from '../ui/Icons';
import { logout } from '@/lib/auth';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const navConfig: any = {
  admin: [
    { label: 'Main', items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: <DashboardIcon size={18} /> },
      { label: 'Appointments', href: '/admin/appointments', icon: <CalendarIcon size={18} /> },
    ]},
    { label: 'Staff', items: [
      { label: 'Doctors', href: '/admin/doctors', icon: <StethoscopeIcon size={18} /> },
      { label: 'Nurses', href: '/admin/nurses', icon: <NurseIcon size={18} /> },
      { label: 'Lab Techs', href: '/admin/lab-technicians', icon: <FlaskIcon size={18} /> },
    ]},
    { label: 'Facilities', items: [
      { label: 'Patients', href: '/admin/patients', icon: <PatientsIcon size={18} /> },
      { label: 'Wards & Beds', href: '/admin/wards', icon: <BedIcon size={18} /> },
    ]},
    { label: 'System', items: [
      { label: 'Users', href: '/admin/users', icon: <PersonIcon size={18} /> },
      { label: 'System Logs', href: '/admin/logs', icon: <ClipboardIcon size={18} /> },
      { label: 'Reports', href: '/admin/reports', icon: <ReportIcon size={18} /> },
      { label: 'Settings', href: '/admin/settings', icon: <SettingsIcon size={18} /> },
    ]}
  ],
  doctor: [
    { label: 'Clinical', items: [
      { label: 'Dashboard', href: '/doctor/dashboard', icon: <DashboardIcon size={18} /> },
      { label: 'My Patients', href: '/doctor/patients', icon: <PatientsIcon size={18} /> },
      { label: 'Appointments', href: '/doctor/appointments', icon: <CalendarIcon size={18} /> },
    ]},
    { label: 'Management', items: [
      { label: 'Medical Records', href: '/doctor/records', icon: <FileTextIcon size={18} /> },
      { label: 'Prescriptions', href: '/doctor/prescriptions', icon: <PillIcon size={18} /> },
      { label: 'Lab Requests', href: '/doctor/lab-requests', icon: <FlaskIcon size={18} /> },
    ]}
  ],
  nurse: [
    { label: 'Care', items: [
      { label: 'Dashboard', href: '/nurse/dashboard', icon: <DashboardIcon size={18} /> },
      { label: 'Patient Vitals', href: '/nurse/vitals', icon: <ActivityIcon size={18} /> },
      { label: 'Task List', href: '/nurse/tasks', icon: <ClipboardIcon size={18} /> },
    ]},
    { label: 'Operations', items: [
      { label: 'Medications', href: '/nurse/medications', icon: <PillIcon size={18} /> },
      { label: 'Activity Log', href: '/nurse/activity', icon: <ClockIcon size={18} /> },
      { label: 'Patients', href: '/nurse/patients', icon: <PatientsIcon size={18} /> },
    ]}
  ],
  patient: [
    { label: 'Health', items: [
      { label: 'Dashboard', href: '/patient/dashboard', icon: <DashboardIcon size={18} /> },
      { label: 'My Records', href: '/patient/records', icon: <FileTextIcon size={18} /> },
      { label: 'Lab Results', href: '/patient/lab-results', icon: <FlaskIcon size={18} /> },
      { label: 'Prescriptions', href: '/patient/prescriptions', icon: <PillIcon size={18} /> },
    ]},
    { label: 'Account', items: [
      { label: 'Appointments', href: '/patient/appointments', icon: <CalendarIcon size={18} /> },
      { label: 'Billing', href: '/patient/billing', icon: <DollarIcon size={18} /> },
      { label: 'Profile', href: '/patient/profile', icon: <PersonIcon size={18} /> },
    ]}
  ],
  labtech: [
    { label: 'Laboratory', items: [
      { label: 'Dashboard', href: '/labtech/dashboard', icon: <DashboardIcon size={18} /> },
      { label: 'Test Queue', href: '/labtech/queue', icon: <ClipboardIcon size={18} /> },
      { label: 'Completed', href: '/labtech/completed', icon: <CheckCircleIcon size={18} /> },
      { label: 'Inventory', href: '/labtech/inventory', icon: <BedIcon size={18} /> },
    ]}
  ]
};

export default function Sidebar({ role, currentPath, isOpen, onClose }: any) {
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const sections = navConfig[role] || [];

  const handleLogout = () => { logout(); router.push('/login'); };

  return (
    <>
      <div className={`fixed inset-0 bg-slate-900/40 z-[999] lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      
      <aside className={`fixed left-0 top-0 h-screen w-[240px] bg-white border-r border-slate-200 z-[1000] flex flex-col transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-[64px] flex items-center px-5 gap-3 border-b border-slate-100">
          <Image src="/logoicon.png" alt="MediCore Logo" width={28} height={28} className="object-contain" />
          <span className="font-bold text-lg text-slate-800 tracking-tight">MediCore</span>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-6">
          {sections.map((section: any, idx: number) => (
            <div key={idx}>
              <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{section.label}</div>
              <div className="space-y-0.5">
                {section.items.map((item: any) => {
                  const isActive = currentPath === item.href;
                  return (
                    <Link 
                      key={item.href} href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded text-sm font-semibold transition-colors ${isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                      onClick={() => { if (window.innerWidth <= 1024) onClose(); }}
                    >
                      <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-200 bg-slate-50">
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded bg-white border border-slate-200 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors shadow-sm"
          >
            <LogoutIcon size={18} />
            Log Out
          </button>
        </div>
      </aside>

      <Modal open={showLogoutConfirm} onClose={() => setShowLogoutConfirm(false)} title="Confirm Logout"
        footer={<><Button variant="secondary" onClick={() => setShowLogoutConfirm(false)}>Cancel</Button><Button variant="danger" onClick={handleLogout}>Logout</Button></>}>
        <p className="text-slate-600">Are you sure you want to log out of the system?</p>
      </Modal>
    </>
  );
}
