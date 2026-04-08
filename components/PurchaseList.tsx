import React, { useRef, useState, useEffect } from 'react';
import { PurchaseList as PurchaseListType, FlowerAnnotation } from '../types';
import FlowerAnnotationOverlay from './FlowerAnnotation';
import { buildExportImage } from '../utils/buildExportImage';
import { encodeShare } from '../utils/shareUtils';

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
  const [exportWithAnnotation, setExportWithAnnotation] = useState(true);
  const [expandedAlts, setExpandedAlts] = useState<Set<number>>(new Set());
  const [heroDataUrl, setHeroDataUrl] = useState(heroImageUrl);
  const [shareToast, setShareToast] = useState(false);

  // Pre-load hero image as base64 data URL so html-to-image can capture it
  useEffect(() => {
    if (!heroImageUrl) return;
    if (heroImageUrl.startsWith('data:')) { setHeroDataUrl(heroImageUrl); return; }
    fetch(heroImageUrl)
      .then(r => r.blob())
      .then(blob => new Promise<string>((res, rej) => {
        const reader = new FileReader();
        reader.onload = e => res(e.target!.result as string);
        reader.onerror = rej;
        reader.readAsDataURL(blob);
      }))
      .then(setHeroDataUrl)
      .catch(() => {});
  }, [heroImageUrl]);

  // Auto-show annotation when it first arrives
  useEffect(() => {
    if (annotations && annotations.length > 0) {
      setShowAnnotation(true);
    }
  }, [annotations]);

  const handleExport = async () => {
    if (!purchaseList) return;
    setExporting(true);
    try {
      const dataUrl = await buildExportImage(
        heroDataUrl,
        purchaseList,
        exportWithAnnotation ? annotations : undefined,
      );
      setExportDataUrl(dataUrl);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  const handleShareLink = async () => {
    if (!purchaseList) return;
    const encoded = encodeShare(purchaseList);
    const url = `${window.location.origin}${window.location.pathname}?share=${encoded}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `植觉·${purchaseList.title}`,
          text: `来看看我的花束清单「${purchaseList.title}」`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setShareToast(true);
        setTimeout(() => setShareToast(false), 2500);
      }
    } catch {
      // user cancelled share or clipboard not available
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

      {/* Share link toast */}
      {shareToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-on-surface text-surface text-sm font-label font-semibold px-5 py-3 rounded-full shadow-lg pointer-events-none">
          链接已复制
        </div>
      )}

      {/* Export modal */}
      {exportDataUrl && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/80 px-6 py-10"
          onClick={() => setExportDataUrl(null)}
        >
          <div
            className="w-full max-w-sm mx-auto bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Top back bar */}
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
              <button
                onClick={() => setExportDataUrl(null)}
                className="flex items-center gap-1 text-gray-600 text-sm font-semibold"
              >
                <span className="material-symbols-outlined text-base">arrow_back_ios</span>
                返回
              </button>
            </div>
            <img src={exportDataUrl} alt="导出预览" className="w-full" />
            <div className="px-6 py-5 text-center">
              <p className="text-sm font-semibold text-gray-800">长按图片保存到相册</p>
              <p className="text-xs text-gray-400 mt-1">或截图保存</p>
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
            src={heroDataUrl}
            alt={purchaseList.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          {/* Inline annotation SVG overlay */}
          {showAnnotation && hasAnnotations && (
            <FlowerAnnotationOverlay annotations={annotations!} />
          )}
          {/* Quote */}
          <div className="absolute bottom-5 left-5 right-5" data-html2canvas-ignore="true">
            <span className="inline-block bg-white/15 backdrop-blur-sm text-white font-headline text-sm italic px-4 py-2 rounded-full">
              「{purchaseList.title}」
            </span>
          </div>
          {/* Annotation toggle button — excluded from export */}
          {(isAnnotating || hasAnnotations) && (
            <button
              data-html2canvas-ignore="true"
              onClick={() => hasAnnotations && setShowAnnotation(v => !v)}
              disabled={isAnnotating}
              className="absolute top-4 right-4 flex items-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-full shadow-lg transition-all active:scale-95"
              style={{
                background: isAnnotating ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.25)',
                backdropFilter: 'blur(8px)',
                border: '1.5px solid rgba(255,255,255,0.5)',
              }}
            >
              {isAnnotating ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin-slow">refresh</span>
                  识别中…
                </>
              ) : showAnnotation ? (
                <>
                  <span className="material-symbols-outlined text-base">visibility_off</span>
                  隐藏标注
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">where_to_vote</span>
                  查看花束地图
                </>
              )}
            </button>
          )}
        </div>

        {/* Flower List */}
        <section className="mb-14">
          <div className="flex items-baseline justify-between mb-8">
            <h3 className="font-headline text-3xl text-primary">花材清单</h3>
            <span className="text-secondary text-[10px] font-label uppercase tracking-[0.2em] font-bold opacity-50">Ingredients</span>
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
        {/* Annotation toggle — only shown when annotations exist */}
        {hasAnnotations && (
          <button
            onClick={() => setExportWithAnnotation(v => !v)}
            className="w-full py-3 px-4 flex items-center justify-between rounded-xl border border-outline-variant/20 text-sm font-label text-secondary active:scale-[0.98] transition-all"
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">where_to_vote</span>
              导出图包含花束标注
            </span>
            <span className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 ${exportWithAnnotation ? 'bg-primary' : 'bg-outline-variant/30'}`}>
              <span className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${exportWithAnnotation ? 'translate-x-4' : ''}`} />
            </span>
          </button>
        )}
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
          onClick={handleShareLink}
          className="w-full py-4 border border-outline-variant/20 text-secondary rounded-2xl font-label font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <span className="material-symbols-outlined text-sm">link</span>
          分享链接
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
