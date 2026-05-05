'use client';
import GenericLayout from '../GenericLayout';

const pageTitles = {
  '/labtech/dashboard': 'Dashboard',
  '/labtech/queue': 'Test Queue',
  '/labtech/upload': 'Upload Results',
  '/labtech/completed': 'Completed Tests',
  '/labtech/inventory': 'Inventory',
};

export default function LabtechLayout({ children }: { children: React.ReactNode }) {
  return <GenericLayout role="labtech" pageTitles={pageTitles}>{children}</GenericLayout>;
}
