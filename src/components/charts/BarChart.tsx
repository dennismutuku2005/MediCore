'use client';
import React, { useState } from 'react';

interface BarChartProps {
  data: Array<{ label: string; value: number }>;
  width?: number;
  height?: number;
  color?: string;
}

export default function BarChart({ data, width = 700, height = 180, color = 'var(--primary)' }: BarChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const padding = { top: 10, right: 10, bottom: 25, left: 35 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const maxVal = Math.max(...data.map(d => d.value)) || 1;
  const barW = chartW / data.length - 12;
  const yTicks = [0, Math.round(maxVal * 0.5), maxVal];

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      {yTicks.map((t, i) => {
        const y = padding.top + chartH - (t / maxVal) * chartH;
        return (
          <g key={i}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="var(--border)" strokeDasharray="3,3" />
            <text x={padding.left - 6} y={y + 3} textAnchor="end" fontSize="10" fill="var(--text-muted)" fontWeight="500">{t}</text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const barH = (d.value / maxVal) * chartH;
        const x = padding.left + i * (chartW / data.length) + 6;
        const y = padding.top + chartH - barH;
        return (
          <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            <rect x={x} y={y} width={barW} height={barH} rx={2} fill={color}
              opacity={hovered === i ? 1 : 0.7} style={{ transition: 'all 0.2s' }} />
            <text x={x + barW / 2} y={height - 8} textAnchor="middle" fontSize="10" fill="var(--text-muted)" fontWeight="500">{d.label.slice(0,3)}</text>
          </g>
        );
      })}
    </svg>
  );
}
