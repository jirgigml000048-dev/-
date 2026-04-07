import React, { useState } from 'react';
import { FlowerAnnotation } from '../types';

interface FlowerAnnotationProps {
  imageUrl: string;       // 图片 URL 或 base64 data URL
  annotations: FlowerAnnotation[];
  onClose: () => void;
}

// 标注框的颜色池
const COLORS = [
  '#4CAF50', '#2196F3', '#FF9800', '#E91E63',
  '#9C27B0', '#00BCD4', '#FF5722', '#8BC34A',
];

export default function FlowerAnnotationView({ imageUrl, annotations, onClose }: FlowerAnnotationProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 shrink-0">
        <div>
          <p className="font-label text-white/60 text-xs uppercase tracking-widest">Flower Map</p>
          <h3 className="font-headline text-white text-xl">花束识别图</h3>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20"
        >
          <span className="material-symbols-outlined text-white">close</span>
        </button>
      </div>

      {/* Annotated image */}
      <div className="flex-1 flex items-center justify-center px-4 min-h-0">
        <div className="relative inline-block max-w-full max-h-full">
          <img
            src={imageUrl}
            alt="花束标注"
            className="max-w-full max-h-[60vh] object-contain rounded-xl"
          />
          {/* SVG overlay */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
          >
            {annotations.map((ann, i) => {
              const [y1, x1, y2, x2] = ann.box_2d;
              const color = COLORS[i % COLORS.length];
              const isHovered = hoveredIndex === i;
              return (
                <g key={i}>
                  <rect
                    x={x1} y={y1}
                    width={x2 - x1} height={y2 - y1}
                    fill={isHovered ? `${color}30` : 'transparent'}
                    stroke={color}
                    strokeWidth={isHovered ? 8 : 5}
                    rx="8"
                    style={{ transition: 'all 0.2s' }}
                  />
                  {/* Label badge */}
                  <rect
                    x={x1} y={Math.max(0, y1 - 44)}
                    width={ann.label.length * 18 + 20} height={36}
                    fill={color} rx="6"
                  />
                  <text
                    x={x1 + 10}
                    y={Math.max(0, y1 - 44) + 24}
                    fill="white"
                    fontSize="22"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    {ann.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 py-4 shrink-0">
        <div className="flex flex-wrap gap-2 justify-center">
          {annotations.map((ann, i) => {
            const color = COLORS[i % COLORS.length];
            return (
              <button
                key={i}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onTouchStart={() => setHoveredIndex(i)}
                onTouchEnd={() => setHoveredIndex(null)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-label font-semibold transition-all"
                style={{
                  backgroundColor: hoveredIndex === i ? color : `${color}30`,
                  color: hoveredIndex === i ? 'white' : color,
                  border: `2px solid ${color}`,
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
