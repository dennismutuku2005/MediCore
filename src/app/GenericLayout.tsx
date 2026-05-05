'use client';
import React, { useState, useEffect } from 'react';
import { getRole, getUsername } from '@/lib/auth';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

interface LayoutProps {
  children: React.ReactNode;
  role: string;
  pageTitles: Record<string, string>;
}

export default function GenericLayout({ children, role, pageTitles }: LayoutProps) {
  const [username, setUsername] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setUsername(getUsername());
  }, []);

  const pageTitle = pageTitles[pathname] || 'Dashboard';

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar 
        role={role} 
        currentPath={pathname} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col transition-[margin] duration-300 lg:ml-[240px]">
        <Topbar 
          pageTitle={pageTitle} 
          username={username || ''} 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
        />
        
        <main className="flex-1 p-5 mt-[64px] animate-in fade-in duration-500">
          {children}
        </main>
      </div>
    </div>
  );
}
