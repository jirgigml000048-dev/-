import React, { useState } from 'react';
import { PHOTO_LIBRARY } from '../constants/photoLibrary';

export default function LibraryPreview() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-surface text-on-surface px-4 py-8">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-headline text-3xl text-primary">图库预览</h1>
          <span className="bg-primary-container text-on-primary-container text-sm font-label font-bold px-4 py-1.5 rounded-full">
            共 {PHOTO_LIBRARY.length} 张
          </span>
        </div>
        <p className="text-secondary text-sm font-body">
          访问 <code className="bg-surface-container px-2 py-0.5 rounded text-xs">?preview</code> 查看所有图库图片，确认均为完整花束后部署上线。
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-2xl mx-auto grid grid-cols-2 gap-4">
        {PHOTO_LIBRARY.map((photo) => (
          <div key={photo.id} className="flex flex-col">
            <button
              onClick={() => setLightbox(photo.url)}
              className="relative aspect-[3/4] rounded-xl overflow-hidden bg-surface-container group"
            >
              <img
                src={photo.url}
                alt={photo.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-2 left-2 bg-surface/80 backdrop-blur-sm text-on-surface-variant text-[10px] font-label font-bold px-2 py-0.5 rounded-full">
                {photo.id}
              </div>
            </button>
            <div className="mt-2 space-y-1 px-1">
              <p className="font-headline text-base text-primary leading-tight">{photo.name}</p>
              <p className="text-[10px] font-label text-secondary leading-relaxed">
                <span className="font-bold">风格</span> {photo.styles.join(' · ')}
              </p>
              <p className="text-[10px] font-label text-secondary leading-relaxed">
                <span className="font-bold">色调</span> {photo.colors.join(' · ')}
              </p>
              <p className="text-[10px] font-label text-secondary leading-relaxed">
                <span className="font-bold">主花</span> {photo.mainFlowers.join(' · ')}
              </p>
              <p className="text-[10px] font-label text-secondary">
                <span className="font-bold">季节</span> {photo.season} ·{' '}
                <span className="font-bold">场合</span> {photo.occasions.join(' · ')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt="全屏预览"
            className="max-w-full max-h-full rounded-xl object-contain"
          />
          <button
            className="absolute top-6 right-6 bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/30"
            onClick={() => setLightbox(null)}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
