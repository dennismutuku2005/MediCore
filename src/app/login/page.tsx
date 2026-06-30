'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { PersonIcon, LockIcon, EyeIcon, EyeOffIcon } from '@/components/ui/Icons';
import Image from 'next/image';
import authService, { roleRedirectPath } from '@/lib/auth';
import { Toaster, toast } from 'sonner';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authService.login(username, password);
      
      if (result.success && result.data) {
        toast.success('Authentication successful', {
          position: 'top-center'
        });
        setTimeout(() => {
          router.push(roleRedirectPath(result.data.user.role));
        }, 500);
      } else {
        const errorMsg = result.message || 'Invalid clinical credentials. Please try again.';
        setError(errorMsg);
        toast.error(errorMsg, {
          position: 'top-center'
        });
      }
    } catch (err) {
      const errorMsg = 'System connectivity issue. Please ensure backend is online.';
      setError(errorMsg);
      toast.error(errorMsg, {
        position: 'top-center'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-5 font-sans">
      <Toaster position="top-center" />
      <div className="w-full max-w-[400px] bg-white border border-slate-200 rounded p-10 shadow-sm animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Image src="/logo.png" alt="MediCore Logo" width={180} height={50} className="object-contain" priority />
          </div>
          <p className="text-sm font-medium text-slate-400 mt-2">Hospital management system</p>
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
            type={showPassword ? "text" : "password"} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            icon={<LockIcon size={16} />}
            suffix={
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="focus:outline-none hover:text-blue-600 transition-colors"
              >
                {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
              </button>
            }
            placeholder="••••••••"
          />

          <div className="text-right">
            <a href="/forgot-password" className="text-xs font-medium text-blue-600 hover:underline">Forgot access key?</a>
          </div>

          <Button fullWidth loading={loading} className="h-10 text-base">
            Authenticate
          </Button>
        </form>
      </div>
    </div>
  );
}
