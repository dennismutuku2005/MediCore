'use client';
import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { PersonIcon, ArrowLeftIcon } from '@/components/ui/Icons';
import Image from 'next/image';
import { apiFetch } from '@/lib/api';

export default function ForgotPassword() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [maskedPhone, setMaskedPhone] = useState('');
  const [error, setError] = useState('');

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await apiFetch('/auth?action=forgot_password', {
        method: 'POST',
        body: JSON.stringify({ username })
      });

      if (res.status === 'success') {
        setSuccess(true);
        setMaskedPhone(res.phone || '********');
      } else {
        setError(res.message || 'Verification failed. User not recognized.');
      }
    } catch (err) {
      setError('System connectivity issue. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-5 font-sans">
      <div className="w-full max-w-[400px] bg-white border border-slate-200 rounded p-10 shadow-sm animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="MediCore Logo" width={180} height={50} className="object-contain" priority />
          <p className="text-sm font-medium text-slate-400 mt-2">Access recovery</p>
        </div>

        {!success ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-lg font-bold text-slate-800">Forgot Credentials?</h2>
              <p className="text-xs text-slate-500 mt-2">Enter your Clinical ID to generate a secure recovery link.</p>
            </div>

            <form className="space-y-6" onSubmit={handleResetRequest}>
              <Input 
                label="Clinical ID (Username)" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                icon={<PersonIcon size={16} />}
                placeholder="e.g. jsmith_doc"
              />

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded text-[11px] font-medium text-rose-600 text-center">
                  {error}
                </div>
              )}

              <Button fullWidth loading={loading} className="h-11">
                Dispatch Reset Token
              </Button>

              <div className="text-center pt-2">
                <a href="/login" className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors">
                  <ArrowLeftIcon size={14} />
                  Return to Login
                </a>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center space-y-6 animate-in slide-in-from-bottom-4 duration-500 pt-4">
            
            <div>
              <h2 className="text-lg font-bold text-slate-800">Dispatch Successful</h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                A private clinical recovery link has been dispatched to the registered mobile device:
              </p>
            </div>

            <div className="py-4 px-6 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-lg font-black text-slate-700 tracking-[0.2em]">{maskedPhone}</span>
            </div>

            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded text-[11px] text-blue-600 font-medium leading-relaxed">
               Please check your WhatsApp messages for the secure access key.
            </div>

            <Button fullWidth onClick={() => window.location.href = '/login'} variant="secondary" className="h-11">
               Return to Secure Login
            </Button>

            <p className="text-[11px] text-slate-400 font-medium pt-2">
              Security link valid for 60 minutes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
