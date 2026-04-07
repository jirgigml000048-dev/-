import React, { useState } from 'react';
import { FlowerStyle, FlowerOccasion, BouquetSize, FlowerColor, MainFlower, FlowerSeason, StyleSelections } from '../types';
import { STYLE_COVER_IMAGES } from '../constants/flowers';

const STYLES: FlowerStyle[] = ['现代简约', '浪漫唯美', '自然田园', '日式侘寂', '复古典雅'];
const OCCASIONS: FlowerOccasion[] = ['爱情', '友情', '节日', '日常', '悼念'];
const SIZES: BouquetSize[] = ['小型', '中型', '大型'];
const COLORS: FlowerColor[] = ['白色系', '粉色系', '红色系', '紫色系', '黄橙系', '混色'];
const MAIN_FLOWERS: MainFlower[] = ['玫瑰', '牡丹', '向日葵', '绣球', '郁金香', '雏菊', '满天星', '其他'];
const SEASONS: FlowerSeason[] = ['春', '夏', '秋', '冬'];

const STYLE_EN: Record<FlowerStyle, string> = {
  '现代简约': 'Modern',
  '浪漫唯美': 'Romantic',
  '自然田园': 'Nature',
  '日式侘寂': 'Wabi-sabi',
  '复古典雅': 'Classic',
};

const OCCASION_EN: Record<FlowerOccasion, string> = {
  '爱情': 'Love',
  '友情': 'Friendship',
  '节日': 'Holiday',
  '日常': 'Daily',
  '悼念': 'Memorial',
};

const SIZE_EN: Record<BouquetSize, string> = {
  '小型': 'Small',
  '中型': 'Medium',
  '大型': 'Large',
};

interface StyleSelectorProps {
  onConfirm: (selections: StyleSelections) => void;
  isLoading: boolean;
}

export default function StyleSelector({ onConfirm, isLoading }: StyleSelectorProps) {
  const [style, setStyle] = useState<FlowerStyle>('浪漫唯美');
  const [occasion, setOccasion] = useState<FlowerOccasion>('爱情');
  const [size, setSize] = useState<BouquetSize>('中型');
  const [color, setColor] = useState<FlowerColor | undefined>(undefined);
  const [mainFlower, setMainFlower] = useState<MainFlower | undefined>(undefined);
  const [season, setSeason] = useState<FlowerSeason | undefined>(undefined);

  const coverImage = STYLE_COVER_IMAGES[style];

  return (
    <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
      {/* Hero Section */}
      <section className="mb-12">
        <span className="font-label text-secondary uppercase tracking-[0.2em] text-[10px] font-extrabold mb-2 block">
          Curation Engine
        </span>
        <h2 className="font-headline text-4xl text-primary font-bold leading-tight mb-4 italic">
          定义您的植觉美学
        </h2>
        <p className="text-secondary font-body leading-relaxed max-w-sm">
          通过选择您的个人偏好，AI 将为您量身定制专属花束方案。
        </p>
      </section>

      {/* Cover Preview */}
      <div className="relative w-full mb-12 h-64 rounded-xl overflow-hidden group">
        <img
          key={coverImage}
          src={coverImage}
          alt={style}
          className="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute bottom-6 right-6 bg-surface-container-highest p-5 rounded-lg max-w-[220px] shadow-sm">
          <span className="font-label text-secondary text-[10px] uppercase tracking-widest font-bold">
            Selected Style
          </span>
          <h3 className="font-headline text-xl text-primary mt-1">{style}</h3>
          <p className="text-on-surface-variant text-xs mt-1 font-medium">
            {STYLE_EN[style]} · {occasion} · {size}
            {color ? ` · ${color}` : ''}
            {mainFlower ? ` · ${mainFlower}` : ''}
          </p>
        </div>
      </div>

      {/* Selection Chips */}
      <div className="space-y-10">
        {/* Style */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <h4 className="font-headline text-2xl text-primary">风格</h4>
            <span className="font-label text-[10px] text-secondary tracking-widest font-bold uppercase opacity-60">
              Style
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-2">
            {STYLES.map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`px-6 py-3 rounded-full font-label text-sm whitespace-nowrap font-semibold transition-all ${
                  style === s
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-surface-container text-secondary hover:bg-surface-container-high'
                }`}
              >
                {STYLE_EN[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Occasion */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <h4 className="font-headline text-2xl text-primary">场合</h4>
            <span className="font-label text-[10px] text-secondary tracking-widest font-bold uppercase opacity-60">
              Occasion
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-2">
            {OCCASIONS.map((o) => (
              <button
                key={o}
                onClick={() => setOccasion(o)}
                className={`px-6 py-3 rounded-full font-label text-sm whitespace-nowrap font-semibold transition-all ${
                  occasion === o
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-surface-container text-secondary hover:bg-surface-container-high'
                }`}
              >
                {OCCASION_EN[o]}
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <h4 className="font-headline text-2xl text-primary">大小</h4>
            <span className="font-label text-[10px] text-secondary tracking-widest font-bold uppercase opacity-60">
              Proportions
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-2">
            {SIZES.map((sz) => (
              <button
                key={sz}
                onClick={() => setSize(sz)}
                className={`px-6 py-3 rounded-full font-label text-sm whitespace-nowrap font-semibold transition-all ${
                  size === sz
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-surface-container text-secondary hover:bg-surface-container-high'
                }`}
              >
                {SIZE_EN[sz]}
              </button>
            ))}
          </div>
        </div>

        {/* Color (optional) */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <h4 className="font-headline text-2xl text-primary">颜色系</h4>
            <span className="font-label text-[10px] text-secondary tracking-widest font-bold uppercase opacity-60">
              Color
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-2">
            <button
              onClick={() => setColor(undefined)}
              className={`px-6 py-3 rounded-full font-label text-sm whitespace-nowrap font-semibold transition-all ${
                color === undefined
                  ? 'bg-secondary text-white shadow-lg shadow-secondary/20'
                  : 'bg-surface-container text-secondary hover:bg-surface-container-high'
              }`}
            >
              全部
            </button>
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c === color ? undefined : c)}
                className={`px-6 py-3 rounded-full font-label text-sm whitespace-nowrap font-semibold transition-all ${
                  color === c
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-surface-container text-secondary hover:bg-surface-container-high'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Main Flower (optional) */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <h4 className="font-headline text-2xl text-primary">主花</h4>
            <span className="font-label text-[10px] text-secondary tracking-widest font-bold uppercase opacity-60">
              Flower
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-2">
            <button
              onClick={() => setMainFlower(undefined)}
              className={`px-6 py-3 rounded-full font-label text-sm whitespace-nowrap font-semibold transition-all ${
                mainFlower === undefined
                  ? 'bg-secondary text-white shadow-lg shadow-secondary/20'
                  : 'bg-surface-container text-secondary hover:bg-surface-container-high'
              }`}
            >
              全部
            </button>
            {MAIN_FLOWERS.map((f) => (
              <button
                key={f}
                onClick={() => setMainFlower(f === mainFlower ? undefined : f)}
                className={`px-6 py-3 rounded-full font-label text-sm whitespace-nowrap font-semibold transition-all ${
                  mainFlower === f
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-surface-container text-secondary hover:bg-surface-container-high'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Season (optional) */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <h4 className="font-headline text-2xl text-primary">季节</h4>
            <span className="font-label text-[10px] text-secondary tracking-widest font-bold uppercase opacity-60">
              Season
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-2">
            <button
              onClick={() => setSeason(undefined)}
              className={`px-6 py-3 rounded-full font-label text-sm whitespace-nowrap font-semibold transition-all ${
                season === undefined
                  ? 'bg-secondary text-white shadow-lg shadow-secondary/20'
                  : 'bg-surface-container text-secondary hover:bg-surface-container-high'
              }`}
            >
              全部
            </button>
            {SEASONS.map((s) => (
              <button
                key={s}
                onClick={() => setSeason(s === season ? undefined : s)}
                className={`px-6 py-3 rounded-full font-label text-sm whitespace-nowrap font-semibold transition-all ${
                  season === s
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-surface-container text-secondary hover:bg-surface-container-high'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-16">
        <button
          onClick={() => onConfirm({ style, occasion, size, color, mainFlower, season })}
          disabled={isLoading}
          className="w-full bg-primary text-on-primary font-headline text-lg py-5 rounded-xl hover:bg-primary-container transition-all flex items-center justify-center gap-3 disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <span className="material-symbols-outlined animate-spin-slow">refresh</span>
              AI 正在为您搭配…
            </>
          ) : (
            <>
              为我推荐
              <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
            </>
          )}
        </button>
        <p className="text-center text-[10px] uppercase tracking-widest text-secondary mt-6 font-bold opacity-40 italic">
          Refining Botanical Intelligence
        </p>
      </div>
    </main>
  );
}
