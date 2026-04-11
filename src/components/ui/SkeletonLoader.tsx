'use client';
import React from 'react';

interface SkeletonLoaderProps {
  key?: React.Key;
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function SkeletonLoader({ width = '100%', height = 20, count = 1, className = '', style }: SkeletonLoaderProps) {
  const skeletons = Array.from({ length: count });

  return (
    <div className="flex flex-col gap-3 w-full">
      {skeletons.map((_, i) => (
        <div 
          key={i}
          className={`animate-pulse bg-slate-200 rounded-sm ${className}`}
          style={{ width, height, ...style }}
        />
      ))}
    </div>
  );
}
