'use client';
import React from 'react';

interface SkeletonLoaderProps {
  key?: React.Key;
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'text' | 'card' | 'row' | 'circular';
}

export default function SkeletonLoader({ 
  width, 
  height, 
  count = 1, 
  className = '', 
  style,
  variant = 'text' 
}: SkeletonLoaderProps) {
  const skeletons = Array.from({ length: count });

  const getStyles = () => {
    switch (variant) {
      case 'card': return { height: height || 120, borderRadius: 12 };
      case 'row': return { height: height || 52, borderRadius: 4 };
      case 'circular': return { width: width || 40, height: height || 40, borderRadius: '50%' };
      default: return { width: width || '100%', height: height || 20, borderRadius: 4 };
    }
  };

  const baseStyles = getStyles();

  return (
    <div className={`flex flex-col gap-4 w-full ${variant === 'row' ? 'gap-2' : ''}`}>
      {skeletons.map((_, i) => (
        <div 
          key={i}
          className={`animate-pulse bg-slate-200/60 ${className}`}
          style={{ ...baseStyles, ...style }}
        />
      ))}
    </div>
  );
}
