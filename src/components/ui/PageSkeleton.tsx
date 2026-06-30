'use client';
import React from 'react';
import SkeletonLoader from './SkeletonLoader';

interface PageSkeletonProps {
  variant?: 'table' | 'dashboard' | 'form' | 'settings' | 'list';
  className?: string;
}

export default function PageSkeleton({ variant = 'table', className = '' }: PageSkeletonProps) {
  if (variant === 'dashboard') {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <SkeletonLoader variant="row" count={2} className="rounded-lg" />
            </div>
          ))}
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <SkeletonLoader width="35%" height={24} className="rounded-lg" />
          <SkeletonLoader variant="row" count={5} className="rounded-lg" />
        </div>
      </div>
    );
  }

  if (variant === 'form') {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">
          <SkeletonLoader width="45%" height={24} className="rounded-lg" />
          <SkeletonLoader width="70%" height={16} className="rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonLoader key={i} height={48} className="rounded-xl" />
            ))}
          </div>
          <div className="flex justify-end gap-3">
            <SkeletonLoader width={120} height={44} className="rounded-lg" />
            <SkeletonLoader width={160} height={44} className="rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'settings') {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">
          <SkeletonLoader width="40%" height={24} className="rounded-lg" />
          <SkeletonLoader width="60%" height={16} className="rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SkeletonLoader height={48} className="rounded-xl" />
            <SkeletonLoader height={48} className="rounded-xl" />
          </div>
          <SkeletonLoader height={96} className="rounded-xl" />
          <div className="flex justify-end">
            <SkeletonLoader width={220} height={44} className="rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between gap-4">
          <SkeletonLoader width="35%" height={36} className="rounded-lg" />
          <SkeletonLoader width={140} height={40} className="rounded-lg" />
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonLoader key={i} height={56} className="rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <SkeletonLoader width="35%" height={36} className="rounded-lg" />
        <SkeletonLoader width={140} height={40} className="rounded-lg" />
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonLoader key={i} height={58} className="rounded-xl" />
        ))}
      </div>
    </div>
  );
}
