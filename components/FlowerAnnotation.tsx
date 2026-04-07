import React, { useState } from 'react';
import { FlowerAnnotation } from '../types';

interface FlowerAnnotationOverlayProps {
  annotations: FlowerAnnotation[];
  forExport?: boolean; // disables animation so html-to-image captures correctly
}

const PALETTE = [
  { dot: '#F9A8D4', label: '#BE185D' }, // pink
  { dot: '#93C5FD', label: '#1D4ED8' }, // blue
  { dot: '#86EFAC', label: '#15803D' }, // green
  { dot: '#FCD34D', label: '#B45309' }, // amber
  { dot: '#C4B5FD', label: '#6D28D9' }, // violet
  { dot: '#6EE7B7', label: '#065F46' }, // emerald
  { dot: '#FCA5A5', label: '#B91C1C' }, // red
  { dot: '#A5F3FC', label: '#0E7490' }, // cyan
];

export default function FlowerAnnotationOverlay({ annotations, forExport = false }: FlowerAnnotationOverlayProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <>
      <style>{`
        @keyframes fadeInDot {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        style={{ pointerEvents: 'none' }}
      >
        {annotations.map((ann, i) => {
          const [y1, x1, y2, x2] = ann.box_2d;
          const cx = (x1 + x2) / 2;
          const cy = (y1 + y2) / 2;
          const c = PALETTE[i % PALETTE.length];
          const isActive = activeIdx === i;

          // Push label away from center with longer lines
          const toRight = cx < 500;
          const toBottom = cy < 500;
          const lx = toRight ? Math.min(cx + 220, 920) : Math.max(cx - 220, 80);
          const ly = toBottom ? Math.min(cy + 100, 950) : Math.max(cy - 100, 50);
          const labelW = ann.label.length * 20 + 32;

          return (
            <g
              key={i}
              onClick={() => setActiveIdx(activeIdx === i ? null : i)}
              style={{
                cursor: forExport ? 'default' : 'pointer',
                pointerEvents: forExport ? 'none' : 'all',
                opacity: forExport ? 1 : 0,
                animation: forExport ? 'none' : `fadeInDot 0.4s ease ${i * 0.1}s forwards`,
              }}
            >
              {/* Outer glow */}
              <circle cx={cx} cy={cy} r={isActive ? 36 : 26} fill={c.dot} opacity={0.25} />
              {/* Main dot */}
              <circle cx={cx} cy={cy} r={isActive ? 16 : 11} fill={c.dot} opacity={0.95} />
              {/* Inner white core */}
              <circle cx={cx} cy={cy} r={5} fill="white" opacity={0.9} />
              {/* Dashed connector — longer */}
              <line
                x1={cx} y1={cy} x2={lx} y2={ly}
                stroke={c.dot}
                strokeWidth={2}
                strokeDasharray="6 4"
                opacity={0.85}
              />
              {/* Label pill */}
              <rect
                x={toRight ? lx - 4 : lx - labelW + 4}
                y={ly - 20}
                width={labelW}
                height={40}
                rx={20}
                fill={isActive ? c.dot : 'rgba(0,0,0,0.55)'}
                stroke={c.dot}
                strokeWidth={1.5}
              />
              <text
                x={toRight ? lx + labelW / 2 - 4 : lx - labelW / 2 + 4}
                y={ly + 1}
                fill={isActive ? 'white' : c.dot}
                fontSize="24"
                fontWeight="700"
                fontFamily="'PingFang SC', 'Hiragino Sans GB', sans-serif"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {ann.label}
              </text>
            </g>
          );
        })}
      </svg>
    </>
  );
}
