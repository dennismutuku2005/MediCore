'use client';
import React from 'react';
import styles from './CircularLoader.module.css';

interface CircularLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const sizes = { sm: 20, md: 32, lg: 48 };

export default function CircularLoader({ size = 'md', color = 'var(--primary)' }: CircularLoaderProps) {
  const s = sizes[size];
  const strokeWidth = size === 'sm' ? 3 : size === 'md' ? 3 : 4;
  const radius = (s - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg className={styles.loader} width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <circle cx={s / 2} cy={s / 2} r={radius} fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth={strokeWidth} />
      <circle
        cx={s / 2} cy={s / 2} r={radius} fill="none"
        stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
        strokeLinecap="round"
      />
    </svg>
  );
}
