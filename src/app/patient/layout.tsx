'use client';
import GenericLayout from '../GenericLayout';

const pageTitles = {
  '/patient/dashboard': 'Dashboard',
  '/patient/appointments': 'My Appointments',
  '/patient/records': 'Medical Records',
  '/patient/lab-results': 'Lab Results',
  '/patient/prescriptions': 'Prescriptions',
  '/patient/profile': 'My Profile',
  '/patient/billing': 'Billing',
};

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return <GenericLayout role="patient" pageTitles={pageTitles}>{children}</GenericLayout>;
}
