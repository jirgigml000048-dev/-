import React, { useState } from 'react';
import { StyleSelections, PurchaseList, PhotoEntry } from '../types';

interface BouquetGalleryProps {
  selections: StyleSelections;
  purchaseList: PurchaseList | null;
  photos: PhotoEntry[];
  onConfirm: (photoUrl: string) => void;
  onBack: () => void;
}

export default function BouquetGallery({
  selections,
  purchaseList,
  photos,
  onConfirm,
  onBack,
}: BouquetGalleryProps) {
  const [selected, setSelected] = useState<number>(0);

  return (
    <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <p className="font-label text-secondary uppercase tracking-widest text-[10px] mb-2 font-bold">
          Curated Selection
        </p>
        <h2 className="font-headline text-4xl leading-tight text-primary">
          为你推荐的<br />植物美学空间
        </h2>
        {purchaseList && (
          <p className="text-secondary mt-3 font-label text-sm">
            「{purchaseList.title}」· {selections.style} · {selections.occasion} · {selections.size}
          </p>
        )}
      </div>

      {/* 2x2 Staggered Grid */}
      <div className="grid grid-cols-2 gap-6 mb-16">
        {photos.slice(0, 4).map((photo, index) => {
          const isSelected = selected === index;
          const isOffset = index === 1 || index === 3; // right column offset
          return (
            <div
              key={photo.id}
              className={`flex flex-col group ${isOffset ? 'mt-8 md:mt-16' : ''}`}
            >
              <button
                onClick={() => setSelected(index)}
                className={`relative aspect-[2/3] rounded-xl overflow-hidden transition-all duration-300 ${
                  isSelected
                    ? 'ring-2 ring-primary ring-offset-4 ring-offset-surface'
                    : 'bg-surface-container-low'
                }`}
              >
                <img
                  src={photo.url}
                  alt={photo.name}
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    isSelected
                      ? 'scale-105'
                      : 'opacity-90 group-hover:opacity-100 group-hover:scale-105'
                  }`}
                />
                {isSelected && (
                  <div className="absolute top-4 right-4 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center">
                    <span
                      className="material-symbols-outlined text-sm"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check
                    </span>
                  </div>
                )}
              </button>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-headline text-xl text-primary">
                  {photo.name}
                </span>
                {isSelected && (
                  <span className="font-label text-secondary text-xs uppercase tracking-tighter">
                    Selected
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => onConfirm(photos[selected]?.url ?? '')}
          className="w-full bg-primary text-on-primary font-body font-semibold px-10 py-5 rounded-xl flex items-center justify-center gap-3 hover:bg-primary-container transition-colors shadow-lg shadow-primary/10"
        >
          <span className="material-symbols-outlined">shopping_basket</span>
          <span>生成购买清单</span>
        </button>
        <button
          onClick={onBack}
          className="w-full py-4 border border-outline-variant/20 text-secondary rounded-xl font-label font-semibold hover:bg-surface-container-low transition-colors"
        >
          重新选择风格
        </button>
      </div>
    </main>
  );
}
