'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { UploadIcon } from '@/components/ui/Icons';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';

export default function LabtechUpload() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const testId = searchParams.get('id');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [test, setTest] = useState<any>(null);
  const [result, setResult] = useState('');

  useEffect(() => {
    async function fetchTest() {
      if (!testId) {
        setLoading(false);
        return;
      }
      try {
        const res = await apiFetch('/labtech/queue');
        if (res.status === 'success') {
          const found = (res.data || []).find((t: any) => String(t.id) === testId);
          setTest(found);
          if (found?.result) setResult(found.result);
        }
      } catch (error) {
        console.error("Failed to fetch test details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTest();
  }, [testId]);

  const handleSave = async () => {
    if (!testId || !result) return;
    setSaving(true);
    try {
      const res = await apiFetch('/labtech/results', {
        method: 'POST',
        body: JSON.stringify({ id: testId, result, status: 'completed' })
      });
      if (res.status === 'success') {
        toast.success('Clinical diagnostic results validated and committed');
        setTimeout(() => router.push('/labtech/queue'), 2000);
      }
    } catch (error) {
      toast.error('Protocol failure: Could not commit results');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="space-y-6">
      <SkeletonLoader height={100} className="rounded-xl shadow-sm" />
      <SkeletonLoader height={300} className="rounded-xl shadow-sm" />
    </div>
  );

  if (!test && !loading) return (
    <div className="p-20 text-center bg-white border border-slate-200 rounded-xl shadow-sm">
      <div className="text-sm font-black text-slate-400 uppercase tracking-widest">Accession ID not identified in active queue</div>
      <Button onClick={() => router.push('/labtech/queue')} className="mt-6">Return to Terminal</Button>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm mb-6">
        <div className="mb-8 border-b border-slate-50 pb-5">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Diagnostic Investigation Results</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Accessioning Terminal • ID: #{test?.id}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-1">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Patient</div>
            <div className="text-sm font-bold text-slate-800 bg-slate-50 p-3 rounded border border-slate-100">{test?.patient}</div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Diagnostic Protocol</div>
            <div className="text-sm font-black text-blue-600 bg-blue-50/30 p-3 rounded border border-blue-100">{test?.testType}</div>
          </div>
        </div>

        <div className="space-y-6">
          <Input 
            label="Clinical Findings & Analysis" 
            isTextarea 
            placeholder="Enter comprehensive diagnostic findings here for physician review..." 
            style={{ minHeight: 220 }}
            value={result}
            onChange={(e) => setResult(e.target.value)}
          />
          
          <div className="p-10 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50 flex flex-col items-center group hover:border-blue-200 transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:border-blue-100 transition-all shadow-sm">
              <UploadIcon size={24} />
            </div>
            <p className="mt-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Ingest Clinical Attachments</p>
            <p className="mt-1 text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">PDF, DICOM, or High-Res JPEG up to 25MB</p>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-50 flex justify-end gap-4">
          <Button variant="secondary" onClick={() => router.back()} className="h-10 px-6 text-[11px] font-black uppercase tracking-widest">Abort interface</Button>
          <Button loading={saving} onClick={handleSave} className="h-10 px-10 text-[11px] font-black uppercase tracking-widest shadow-md">Validate & Commit Results</Button>
        </div>
      </div>

    </div>
  );
}
