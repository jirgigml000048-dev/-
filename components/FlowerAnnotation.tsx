import React, { useState, useEffect } from 'react';
import { FlowerAnnotation } from '../types';

interface FlowerAnnotationProps {
  imageUrl: string;
  annotations: FlowerAnnotation[];
  onClose: () => void;
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

export default function FlowerAnnotationView({ imageUrl, annotations, onClose }: FlowerAnnotationProps) {
  const [shown, setShown] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  useEffect(() => {
    const t = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        background: 'rgba(5,10,20,0.92)',
        backdropFilter: 'blur(2px)',
        opacity: shown ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-5 shrink-0">
        <div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
            Flower Map
          </p>
          <h3 style={{ color: 'white', fontSize: 22, fontWeight: 700, marginTop: 2, fontFamily: 'serif' }}>
            花束识别图
          </h3>
        </div>
        <button
          onClick={onClose}
          style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
        >
          <span className="material-symbols-outlined" style={{ color: 'white', fontSize: 20 }}>close</span>
        </button>
      </div>

      {/* Annotated image */}
      <div className="flex-1 flex items-center justify-center px-5 min-h-0">
        <div className="relative w-full" style={{ maxHeight: '62vh' }}>
          <img
            src={imageUrl}
            alt="花束标注"
            style={{ width: '100%', maxHeight: '62vh', objectFit: 'contain', borderRadius: 16, display: 'block' }}
          />
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
          >
            {annotations.map((ann, i) => {
              const [y1, x1, y2, x2] = ann.box_2d;
              const cx = (x1 + x2) / 2;
              const cy = (y1 + y2) / 2;
              const c = PALETTE[i % PALETTE.length];
              const isActive = activeIdx === i;

              // Smart label placement: push labels outside image center
              const toRight = cx < 500;
              const toBottom = cy < 500;
              const lx = toRight ? Math.min(cx + 120, 940) : Math.max(cx - 120, 60);
              const ly = toBottom ? Math.min(cy + 80, 960) : Math.max(cy - 80, 40);
              const labelW = ann.label.length * 16 + 28;

              return (
                <g
                  key={i}
                  onClick={() => setActiveIdx(activeIdx === i ? null : i)}
                  style={{
                    cursor: 'pointer',
                    opacity: 0,
                    animation: `fadeInUp 0.5s ease ${i * 0.08}s forwards`,
                  }}
                >
                  {/* Outer glow ring */}
                  <circle cx={cx} cy={cy} r={isActive ? 32 : 24} fill={c.dot} opacity={0.2} />
                  {/* Main dot */}
                  <circle cx={cx} cy={cy} r={isActive ? 14 : 10} fill={c.dot} opacity={0.95} />
                  {/* Inner white core */}
                  <circle cx={cx} cy={cy} r={5} fill="white" opacity={0.9} />
                  {/* Dashed connector */}
                  <line
                    x1={cx} y1={cy} x2={lx} y2={ly}
                    stroke={c.dot}
                    strokeWidth={1.5}
                    strokeDasharray="5 3"
                    opacity={0.7}
                  />
                  {/* Label pill */}
                  <rect
                    x={toRight ? lx - 4 : lx - labelW + 4}
                    y={ly - 16}
                    width={labelW}
                    height={32}
                    rx={16}
                    fill={isActive ? c.dot : 'rgba(255,255,255,0.12)'}
                    stroke={c.dot}
                    strokeWidth={1.5}
                  />
                  <text
                    x={toRight ? lx + labelW / 2 - 4 : lx - labelW / 2 + 4}
                    y={ly + 1}
                    fill={isActive ? 'white' : c.dot}
                    fontSize="18"
                    fontWeight="600"
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
          <style>{`
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(6px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      </div>

      {/* Bottom legend chips */}
      <div style={{ padding: '16px 20px 28px', flexShrink: 0 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          {annotations.map((ann, i) => {
            const c = PALETTE[i % PALETTE.length];
            const isActive = activeIdx === i;
            return (
              <button
                key={i}
                onClick={() => setActiveIdx(activeIdx === i ? null : i)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  background: isActive ? c.dot : 'rgba(255,255,255,0.06)',
                  color: isActive ? 'white' : c.dot,
                  border: `1.5px solid ${isActive ? c.dot : c.dot + '60'}`,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'sans-serif',
                }}
              >
                {ann.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
