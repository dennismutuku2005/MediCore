'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { LockIcon, EyeIcon, EyeOffIcon, CheckCircleIcon } from '@/components/ui/Icons';
import Image from 'next/image';
import { apiFetch } from '@/lib/api';

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Invalid access token. Please request a new link.');
    }
  }, [token]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await apiFetch('/auth?action=reset_password', {
        method: 'POST',
        body: JSON.stringify({ token, password })
      });

      if (res.status === 'success') {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setError(res.message || 'Token verification failed or expired.');
      }
    } catch (err) {
      setError('System connectivity issue. Please ensure backend is online.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-5 font-sans">
      <div className="w-full max-w-[400px] bg-white border border-slate-200 rounded p-10 shadow-sm animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center mb-10">
          <Image src="/logo.png" alt="MediCore Logo" width={180} height={50} className="object-contain" priority />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">Security Key Reset</p>
        </div>

        {!success ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-lg font-bold text-slate-800">Set New Access Key</h2>
              <p className="text-sm text-slate-500 mt-1">Establish a new secure password for your account.</p>
            </div>

            <form className="space-y-5" onSubmit={handleReset}>
              <Input 
                label="New Password" 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                icon={<LockIcon size={16} />}
                placeholder="••••••••"
                suffix={
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                  </button>
                }
              />
              <Input 
                label="Confirm Password" 
                type={showPassword ? "text" : "password"} 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                icon={<LockIcon size={16} />}
                placeholder="••••••••"
              />

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs font-bold text-rose-600 text-center animate-shake">
                  {error}
                </div>
              )}

              <Button fullWidth loading={loading} className="h-10 text-base" disabled={!!error && !token}>
                Update Credentials
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-5 animate-in zoom-in duration-500">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 border border-blue-100">
              <CheckCircleIcon size={32} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Key Updated</h2>
            <p className="text-sm text-slate-500 mt-2">Your clinical access key has been successfully reset. Redirecting to login...</p>
          </div>
        )}
      </div>
    </div>
  );
}
