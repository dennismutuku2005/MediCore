'use client';
import GenericLayout from '../GenericLayout';

const pageTitles = {
  '/admin/dashboard': 'Dashboard',
  '/admin/doctors': 'Manage Doctors',
  '/admin/nurses': 'Manage Nurses',
  '/admin/patients': 'Manage Patients',
  '/admin/lab-technicians': 'Lab Technicians',
  '/admin/appointments': 'Appointments',
  '/admin/wards': 'Wards & Beds',
  '/admin/reports': 'Reports',
  '/admin/settings': 'Settings',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <GenericLayout role="admin" pageTitles={pageTitles}>{children}</GenericLayout>;
}
