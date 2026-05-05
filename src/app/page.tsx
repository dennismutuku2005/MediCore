'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getRole } from '@/lib/auth';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const role = getRole();
    if (role) {
      router.replace(`/${role}/dashboard`);
    } else {
      router.replace('/login');
    }
  }, [router]);
  return null;
}
