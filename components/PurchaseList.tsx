import React, { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { PurchaseList as PurchaseListType, FlowerAnnotation } from '../types';
import FlowerAnnotationOverlay from './FlowerAnnotation';

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
  const exportCardRef = useRef<HTMLDivElement>(null);
  const [showAnnotation, setShowAnnotation] = useState(false);
  const [exportDataUrl, setExportDataUrl] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [showExportCard, setShowExportCard] = useState(false);
  const [expandedAlts, setExpandedAlts] = useState<Set<number>>(new Set());
  const [heroDataUrl, setHeroDataUrl] = useState(heroImageUrl);

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
    setShowExportCard(true);
    // Wait for React to mount the card + images to decode
    await new Promise(r => setTimeout(r, 400));
    try {
      if (!exportCardRef.current) throw new Error('card not ready');
      const dataUrl = await toPng(exportCardRef.current, {
        pixelRatio: 3,
        cacheBust: true,
        skipFonts: false,
      });
      setExportDataUrl(dataUrl);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setShowExportCard(false);
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

      {/* ─── Export card: shown just below viewport when capturing ─── */}
      {showExportCard && purchaseList && (
        <div
          ref={exportCardRef}
          style={{
            position: 'fixed',
            top: '110vh',
            left: 0,
            width: '390px',
            background: '#FDFCF7',
            padding: '48px 36px 40px',
            fontFamily: "'Noto Serif SC', 'Noto Sans SC', serif",
            boxSizing: 'border-box',
            zIndex: 9999,
          }}
        >
          {/* Brand header */}
          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.25em', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'sans-serif' }}>
              Botanical Intelligence
            </p>
            <h1 style={{ fontSize: '38px', fontWeight: 700, color: '#172f28', fontStyle: 'italic', margin: 0, lineHeight: 1.1 }}>
              植觉
            </h1>
            <p style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#9CA3AF', marginTop: '4px', fontFamily: 'sans-serif' }}>
              Plant Instinct
            </p>
          </div>

          {/* Hero image with annotation — explicit height avoids aspect-ratio bugs in capture */}
          <div style={{ position: 'relative', width: '318px', height: '424px', borderRadius: '16px', overflow: 'hidden', marginBottom: '28px' }}>
            <img
              src={heroDataUrl}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.25), transparent)' }} />
            {annotations && annotations.length > 0 && (
              <FlowerAnnotationOverlay annotations={annotations} forExport />
            )}
          </div>

          {/* Title + tags */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#172f28', margin: '0 0 8px', lineHeight: 1.3 }}>
              {purchaseList.title || '专属花束清单'}
            </h2>
            <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0, letterSpacing: '0.05em', fontFamily: 'sans-serif' }}>
              {purchaseList.style} · {purchaseList.occasion} · {purchaseList.size}
            </p>
          </div>

          {/* Flower grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px', marginBottom: '28px' }}>
            {purchaseList.flowers.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#172f28', opacity: 0.35, flexShrink: 0 }} />
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#172f28', flex: 1, minWidth: 0 }}>{f.nameCN}</span>
                <span style={{ fontSize: '13px', color: '#9CA3AF', fontFamily: 'sans-serif', flexShrink: 0 }}>×{f.quantity}</span>
              </div>
            ))}
          </div>

          {/* Divider + footer */}
          <div style={{ borderTop: '1px solid rgba(23,47,40,0.1)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#9CA3AF', fontStyle: 'italic' }}>植觉 Plant Instinct</span>
            <span style={{ fontSize: '9px', color: '#C4C4C4', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>Botanical</span>
          </div>
        </div>
      )}

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
