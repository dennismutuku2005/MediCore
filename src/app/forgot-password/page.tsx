'use client';
import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { PersonIcon, WhatsAppIcon, ArrowLeftIcon } from '@/components/ui/Icons';
import Image from 'next/image';
import { apiFetch } from '@/lib/api';

export default function ForgotPassword() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resetLink, setResetLink] = useState('');
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
        setResetLink(res.resetLink);
      } else {
        setError(res.message || 'Verification failed. User not recognized.');
      }
    } catch (err) {
      setError('System connectivity issue. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const shareToWhatsApp = () => {
    const text = `MediCore Clinical Access Recovery:\n\nA password reset has been initiated for your account.\n\nPlease click the link below to set a new access key:\n${resetLink}\n\nNote: This link expires in 1 hour.`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-5 font-sans">
      <div className="w-full max-w-[400px] bg-white border border-slate-200 rounded p-10 shadow-sm animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="MediCore Logo" width={180} height={50} className="object-contain" priority />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">Access Recovery</p>
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
                <div className="p-3 bg-rose-50 border border-rose-200 rounded text-[10px] font-bold text-rose-600 text-center uppercase tracking-wider">
                  {error}
                </div>
              )}

              <Button fullWidth loading={loading} className="h-11">
                Generate Reset Token
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
          <div className="text-center space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100 text-emerald-600 shadow-inner">
               <WhatsAppIcon size={32} />
            </div>
            
            <div>
              <h2 className="text-lg font-bold text-slate-800">Token Generated</h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                A secure reset token has been verified for <span className="font-bold text-slate-900">{username}</span>.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded text-[10px] break-all font-mono text-slate-600">
              {resetLink}
            </div>

            <Button fullWidth onClick={shareToWhatsApp} className="h-11 bg-emerald-600 hover:bg-emerald-700 border-emerald-700 shadow-lg shadow-emerald-600/20">
               <WhatsAppIcon size={18} className="mr-2" />
               Forward to WhatsApp
            </Button>

            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-2">
              Valid for exactly 60 minutes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
