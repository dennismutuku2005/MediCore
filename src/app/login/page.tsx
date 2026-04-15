'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { CrossMedicalIcon, PersonIcon, LockIcon } from '@/components/ui/Icons';
import Image from 'next/image';
import { login, setRole } from '@/lib/auth';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const role = login(username, password);
      if (role) {
        setRole(role);
        router.push(`/${role}/dashboard`);
      } else {
        setError('Invalid clinical credentials. Please try again.');
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-5 font-sans">
      <div className="w-full max-w-[400px] bg-white border border-slate-200 rounded p-10 shadow-sm animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Image src="/logo.png" alt="MediCore Logo" width={180} height={50} className="object-contain" priority />
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">Hospital System</p>
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-lg font-bold text-slate-800">System Access</h2>
          <p className="text-sm text-slate-500 mt-1">Authorized medical staff only.</p>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          <Input 
            label="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            icon={<PersonIcon size={16} />}
            placeholder="Clinical ID"
          />
          <Input 
            label="Password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            icon={<LockIcon size={16} />}
            placeholder="••••••••"
          />

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs font-bold text-rose-600 text-center animate-shake">
              {error}
            </div>
          )}

          <div className="text-right">
            <a href="#" className="text-xs font-bold text-blue-600 hover:underline">Forgot access key?</a>
          </div>

          <Button fullWidth loading={loading} className="h-10 text-base">
            Authenticate
          </Button>
        </form>

        <div className="mt-10 p-4 bg-slate-50 rounded border border-slate-100 italic text-[11px] text-slate-400 text-center">
          Available roles for testing: admin, doctor, nurse, patient, labtech
        </div>
      </div>
    </div>
  );
}
