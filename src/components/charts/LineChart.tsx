'use client';
import React, { useState } from 'react';

interface LineChartProps {
  data: Array<{ label: string; value: number }>;
  width?: number;
  height?: number;
  color?: string;
}

export default function LineChart({ data, width = 500, height = 150, color = 'var(--primary)' }: LineChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const padding = { top: 10, right: 10, bottom: 25, left: 35 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const minVal = Math.min(...data.map(d => d.value)) - 2;
  const maxVal = Math.max(...data.map(d => d.value)) + 2;
  const range = maxVal - minVal || 1;

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1 || 1)) * chartW;
    const y = padding.top + chartH - ((d.value - minVal) / range) * chartH;
    return { x, y, ...d };
  });

  const polyline = points.map(p => `${p.x},${p.y}`).join(' ');
  const areaPath = `M${points[0]?.x},${padding.top + chartH} ${points.map(p => `L${p.x},${p.y}`).join(' ')} L${points[points.length - 1]?.x},${padding.top + chartH} Z`;

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.1" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map((f, i) => {
        const val = Math.round(minVal + f * range);
        const y = padding.top + chartH - f * chartH;
        return (
          <g key={i}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="var(--border)" strokeDasharray="3,3" />
            <text x={padding.left - 6} y={y + 3} textAnchor="end" fontSize="10" fill="var(--text-muted)" fontWeight="500">{val}</text>
          </g>
        );
      })}
      <path d={areaPath} fill="url(#lineGrad)" />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
          <circle cx={p.x} cy={p.y} r={hovered === i ? 5 : 3} fill={color} stroke="#fff" strokeWidth="1.5" style={{ transition: 'r 0.2s' }} />
          <text x={p.x} y={height - 8} textAnchor="middle" fontSize="10" fill="var(--text-muted)" fontWeight="500">{p.label}</text>
        </g>
      ))}
    </svg>
  );
}
