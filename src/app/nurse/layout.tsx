'use client';
import GenericLayout from '../GenericLayout';

const pageTitles = {
  '/nurse/dashboard': 'Dashboard',
  '/nurse/vitals': 'Patient Vitals',
  '/nurse/tasks': 'Task Management',
  '/nurse/medications': 'Medication Admin',
  '/nurse/activity': 'Activity Log',
  '/nurse/patients': 'Patient Overview',
};

export default function NurseLayout({ children }: { children: React.ReactNode }) {
  return <GenericLayout role="nurse" pageTitles={pageTitles}>{children}</GenericLayout>;
}
