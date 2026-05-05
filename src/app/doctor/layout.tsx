'use client';
import GenericLayout from '../GenericLayout';

const pageTitles = {
  '/doctor/dashboard': 'Dashboard',
  '/doctor/patients': 'My Patients',
  '/doctor/appointments': 'Appointments',
  '/doctor/records': 'Medical Records',
  '/doctor/prescriptions': 'Prescriptions',
  '/doctor/lab-requests': 'Lab Requests',
  '/doctor/notes': 'Notes',
};

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return <GenericLayout role="doctor" pageTitles={pageTitles}>{children}</GenericLayout>;
}
