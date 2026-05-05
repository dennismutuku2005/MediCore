'use client';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
  loading?: boolean;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  fullWidth, 
  loading, 
  className = '', 
  ...props 
}: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 px-3 h-8 text-sm font-semibold rounded transition-colors disabled:opacity-60 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50",
    danger: "bg-rose-600 text-white hover:bg-rose-700"
  };

  return (
    <button 
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${loading ? 'opacity-70 pulse' : ''} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {children}
    </button>
  );
}
