'use client';
import React, { useEffect, useState } from 'react';
import styles from './Toast.module.css';
import { CheckCircleIcon, CloseIcon } from './Icons';

interface ToastProps {
  message: string;
  variant?: 'success' | 'error';
  onDone: () => void;
}

export default function Toast({ message, variant = 'success', onDone }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300);
    }, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  if (!visible) return null;

  return (
    <div className={`${styles.toast} ${styles[variant]}`}>
      {variant === 'success' ? <CheckCircleIcon size={16} color="#fff" /> : <CloseIcon size={16} color="#fff" />}
      {message}
    </div>
  );
}
