import React, { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { PurchaseList as PurchaseListType, FlowerAnnotation } from '../types';
import FlowerAnnotationView from './FlowerAnnotation';

interface PurchaseListProps {
  purchaseList: PurchaseListType | null;
  heroImageUrl: string;
  onRedo: () => void;
  annotations?: FlowerAnnotation[];
  isAnnotating?: boolean;
  isLoading?: boolean;
}

export default function PurchaseList({
  purchaseList, heroImageUrl, onRedo,
  annotations, isAnnotating, isLoading,
}: PurchaseListProps) {
  const exportRef = useRef<HTMLDivElement>(null);
  const [showAnnotation, setShowAnnotation] = useState(false);
  const [exportDataUrl, setExportDataUrl] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [expandedAlts, setExpandedAlts] = useState<Set<number>>(new Set());

  // Auto-show annotation when it first arrives
  useEffect(() => {
    if (annotations && annotations.length > 0) {
      setShowAnnotation(true);
    }
  }, [annotations]);

  const handleExport = async () => {
    if (!exportRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(exportRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        style: { fontFamily: "'Noto Serif SC', serif" },
      });
      setExportDataUrl(dataUrl);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  const toggleAlt = (i: number) => {
    setExpandedAlts(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const hasAnnotations = annotations && annotations.length > 0;

  // Loading state: purchaseList not yet ready
  if (!purchaseList) {
    return (
      <main className="pt-24 px-6 max-w-2xl mx-auto pb-32 flex flex-col items-center">
        {heroImageUrl && (
          <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden mb-10">
            <img src={heroImageUrl} alt="" className="w-full h-full object-cover opacity-80" />
          </div>
        )}
        <div className="flex flex-col items-center gap-4 py-8">
          <span className="material-symbols-outlined text-primary text-4xl animate-spin-slow">refresh</span>
          <p className="text-secondary font-label text-sm">AI 正在生成花材清单…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 px-6 max-w-2xl mx-auto pb-32">

      {/* Annotation overlay */}
      {showAnnotation && hasAnnotations && (
        <FlowerAnnotationView
          imageUrl={heroImageUrl}
          annotations={annotations}
          onClose={() => setShowAnnotation(false)}
        />
      )}

      {/* Export modal */}
      {exportDataUrl && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 px-6"
          onClick={() => setExportDataUrl(null)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <img src={exportDataUrl} alt="导出预览" className="w-full" />
            <div className="px-6 py-5 text-center">
              <p className="text-sm font-semibold text-gray-800">长按图片保存到相册</p>
              <p className="text-xs text-gray-400 mt-1">或截图保存</p>
              <button
                onClick={() => setExportDataUrl(null)}
                className="mt-4 w-full py-3 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exportable card */}
      <div ref={exportRef} className="bg-surface">

        {/* Title */}
        <section className="mb-12">
          <p className="text-secondary font-label uppercase tracking-[0.2em] text-[10px] font-semibold mb-3">
            Shopping List
          </p>
          <h2 className="font-headline text-5xl text-primary font-bold leading-[1.1] tracking-tight">
            {purchaseList.title || '专属花束清单'}
          </h2>
          <p className="text-secondary mt-5 font-label text-sm">
            {purchaseList.style} · {purchaseList.occasion} · {purchaseList.size}
          </p>
          {purchaseList.tips && (
            <p className="text-on-surface-variant mt-4 leading-loose font-body text-sm italic max-w-sm">
              {purchaseList.tips}
            </p>
          )}
        </section>

        {/* Hero Image */}
        <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-14">
          <img
            src={heroImageUrl}
            alt={purchaseList.title}
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          {/* Quote */}
          <div className="absolute bottom-5 left-5 right-5">
            <span className="inline-block bg-white/15 backdrop-blur-sm text-white font-headline text-sm italic px-4 py-2 rounded-full">
              「{purchaseList.title}」
            </span>
          </div>
          {/* Annotation button — prominent floating pill */}
          <button
            onClick={() => hasAnnotations ? setShowAnnotation(true) : undefined}
            disabled={isAnnotating || !hasAnnotations && !isAnnotating}
            className="absolute top-4 right-4 flex items-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-full shadow-lg transition-all active:scale-95"
            style={{
              background: isAnnotating
                ? 'rgba(0,0,0,0.45)'
                : hasAnnotations
                  ? 'rgba(255,255,255,0.25)'
                  : 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(8px)',
              border: hasAnnotations ? '1.5px solid rgba(255,255,255,0.5)' : '1.5px solid rgba(255,255,255,0.15)',
              display: (!hasAnnotations && !isAnnotating) ? 'none' : 'flex',
            }}
          >
            {isAnnotating ? (
              <>
                <span className="material-symbols-outlined text-base animate-spin-slow">refresh</span>
                识别中…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">where_to_vote</span>
                查看花束地图
              </>
            )}
          </button>
        </div>

        {/* Flower List */}
        <section className="mb-14">
          <div className="flex items-baseline justify-between mb-8">
            <h3 className="font-headline text-3xl text-primary">花材清单</h3>
            <span className="text-secondary text-xs font-label uppercase tracking-widest opacity-60">Ingredients</span>
          </div>
          <div>
            {purchaseList.flowers.map((flower, i) => (
              <div key={i} className="py-7 border-b border-outline-variant/10">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-5 flex-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-3 shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-xl text-on-surface leading-tight">
                        {flower.nameCN}
                        {flower.color && (
                          <span className="text-secondary font-normal text-base ml-2 align-middle">
                            {flower.color}
                          </span>
                        )}
                      </p>
                      <p className="text-secondary text-[11px] font-label uppercase tracking-widest mt-1.5">
                        {flower.nameLatin}
                      </p>
                      {flower.notes && (
                        <p className="text-on-surface-variant text-sm mt-2.5 font-body leading-relaxed">
                          {flower.notes}
                        </p>
                      )}
                      {flower.alternatives && flower.alternatives.length > 0 && (
                        <div className="mt-3">
                          <button
                            onClick={() => toggleAlt(i)}
                            className="flex items-center gap-1 text-xs font-label text-secondary/70 hover:text-primary transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">
                              {expandedAlts.has(i) ? 'expand_less' : 'expand_more'}
                            </span>
                            买不到？看备选
                          </button>
                          {expandedAlts.has(i) && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {flower.alternatives.map((alt, j) => (
                                <span key={j} className="px-3 py-1 bg-surface-container text-secondary text-xs font-label rounded-full">
                                  {alt}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="font-headline text-2xl text-primary/60 shrink-0 mt-0.5">
                    ×{flower.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Greenery + Tools */}
        {(purchaseList.fillerGreenery?.length > 0 || purchaseList.tools?.length > 0) && (
          <div className="grid grid-cols-2 gap-5 mb-14">
            {purchaseList.fillerGreenery?.length > 0 && (
              <div className="bg-surface-container-low p-6 rounded-2xl">
                <p className="text-[10px] text-secondary/50 font-label uppercase tracking-widest mb-4">Greenery</p>
                <h3 className="font-headline text-lg text-primary mb-4">绿植填充</h3>
                <ul className="space-y-3">
                  {purchaseList.fillerGreenery.map((g, i) => (
                    <li key={i} className="flex items-center gap-2 text-secondary text-sm font-body">
                      <span className="material-symbols-outlined text-sm opacity-50">park</span>
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {purchaseList.tools?.length > 0 && (
              <div className="bg-surface-container p-6 rounded-2xl">
                <p className="text-[10px] text-secondary/50 font-label uppercase tracking-widest mb-4">Tools</p>
                <h3 className="font-headline text-lg text-primary mb-4">工具准备</h3>
                <ul className="space-y-3">
                  {purchaseList.tools.map((t, i) => (
                    <li key={i} className="flex items-center gap-2 text-secondary text-sm font-body">
                      <span className="material-symbols-outlined text-sm opacity-50">content_cut</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Footer brand */}
        <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10 mb-2">
          <p className="font-headline text-primary text-sm italic opacity-40">Plant Instinct · 植觉</p>
          <p className="text-[10px] text-secondary/30 font-label uppercase tracking-widest">Botanical Intelligence</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 mt-10">
        <button
          onClick={handleExport}
          disabled={exporting}
          className="w-full py-5 bg-primary text-on-primary rounded-2xl font-semibold text-base flex items-center justify-center gap-3 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-60"
        >
          {exporting ? (
            <><span className="material-symbols-outlined animate-spin-slow">refresh</span>生成中…</>
          ) : (
            <><span className="material-symbols-outlined">ios_share</span>生成分享图</>
          )}
        </button>
        <button
          onClick={onRedo}
          className="w-full py-4 border border-outline-variant/20 text-secondary rounded-2xl font-label font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
          重新推荐
        </button>
      </div>
    </main>
  );
}
