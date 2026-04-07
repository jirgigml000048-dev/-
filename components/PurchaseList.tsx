import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import { PurchaseList as PurchaseListType, FlowerAnnotation } from '../types';
import FlowerAnnotationView from './FlowerAnnotation';

interface PurchaseListProps {
  purchaseList: PurchaseListType;
  heroImageUrl: string;
  onRedo: () => void;
  annotations?: FlowerAnnotation[];       // 可选，来自识花流程
  onRequestAnnotation?: () => void;       // 触发标注请求
  isAnnotating?: boolean;                 // 标注加载中
}

export default function PurchaseList({
  purchaseList, heroImageUrl, onRedo,
  annotations, onRequestAnnotation, isAnnotating,
}: PurchaseListProps) {
  const exportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [showAnnotation, setShowAnnotation] = useState(false);
  const [expandedAlts, setExpandedAlts] = useState<Set<number>>(new Set());

  const handleExport = async () => {
    if (!exportRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(exportRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        style: { fontFamily: "'Noto Serif SC', serif" },
      });
      saveAs(dataUrl, `植觉-${purchaseList.title || '购买清单'}.png`);
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

  return (
    <main className="pt-24 px-6 max-w-2xl mx-auto pb-32">
      {/* Annotation overlay */}
      {showAnnotation && annotations && annotations.length > 0 && (
        <FlowerAnnotationView
          imageUrl={heroImageUrl}
          annotations={annotations}
          onClose={() => setShowAnnotation(false)}
        />
      )}
      {/* Exportable area */}
      <div ref={exportRef} className="bg-surface">
        {/* Header */}
        <section className="mb-10">
          <p className="text-secondary font-label uppercase tracking-widest text-[10px] font-semibold mb-2">
            Shopping List
          </p>
          <h2 className="font-headline text-4xl text-primary font-bold leading-tight">
            {purchaseList.title || '专属花束清单'}
          </h2>
          <p className="text-secondary mt-4 leading-relaxed max-w-md font-body text-sm">
            {purchaseList.style} · {purchaseList.occasion} · {purchaseList.size}
          </p>
          {purchaseList.tips && (
            <p className="text-on-surface-variant mt-3 leading-relaxed font-body text-sm italic">
              {purchaseList.tips}
            </p>
          )}
        </section>

        {/* Hero Image */}
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-12">
          <img
            src={heroImageUrl}
            alt={purchaseList.title}
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
          />
          <div className="absolute bottom-6 right-6 p-5 bg-surface-container-highest rounded-lg shadow-sm">
            <p className="font-headline text-base text-primary italic">
              「{purchaseList.title}」
            </p>
          </div>
          {/* Annotation button */}
          {onRequestAnnotation && (
            <button
              onClick={annotations ? () => setShowAnnotation(true) : onRequestAnnotation}
              disabled={isAnnotating}
              className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white text-xs font-label font-semibold px-3 py-2 rounded-full hover:bg-black/70 transition-colors disabled:opacity-60"
            >
              {isAnnotating ? (
                <><span className="material-symbols-outlined text-sm animate-spin-slow">refresh</span>识别中…</>
              ) : annotations ? (
                <><span className="material-symbols-outlined text-sm">local_florist</span>查看标注</>
              ) : (
                <><span className="material-symbols-outlined text-sm">where_to_vote</span>标注花束</>
              )}
            </button>
          )}
        </div>

        {/* Flower List */}
        <section className="mb-10">
          <div className="flex items-baseline justify-between mb-6">
            <h3 className="font-headline text-2xl text-primary">花材清单</h3>
            <span className="text-secondary text-sm font-medium font-label">Ingredients</span>
          </div>
          <div className="space-y-0">
            {purchaseList.flowers.map((flower, i) => (
              <div
                key={i}
                className="py-5 border-b border-outline-variant/15"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <span className="w-2 h-2 rounded-full bg-primary/30 mt-2 shrink-0" />
                    <div>
                      <p className="font-semibold text-lg text-on-surface">
                        {flower.nameCN}
                        {flower.color && (
                          <span className="text-secondary font-normal text-base ml-2">
                            ({flower.color})
                          </span>
                        )}
                      </p>
                      <p className="text-secondary text-xs font-label uppercase tracking-wider mt-1">
                        {flower.nameLatin}
                      </p>
                      {flower.notes && (
                        <p className="text-on-surface-variant text-sm mt-1 font-body">
                          {flower.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="font-headline text-xl text-primary shrink-0 ml-4">
                    ×{flower.quantity}
                  </span>
                </div>
                {/* Alternatives */}
                {flower.alternatives && flower.alternatives.length > 0 && (
                  <div className="ml-6 mt-2">
                    <button
                      onClick={() => toggleAlt(i)}
                      className="flex items-center gap-1 text-xs font-label text-secondary hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {expandedAlts.has(i) ? 'expand_less' : 'expand_more'}
                      </span>
                      买不到？看备选
                    </button>
                    {expandedAlts.has(i) && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {flower.alternatives.map((alt, j) => (
                          <span
                            key={j}
                            className="px-3 py-1 bg-surface-container text-secondary text-xs font-label rounded-full"
                          >
                            {alt}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Bento Grid */}
        {(purchaseList.fillerGreenery?.length > 0 || purchaseList.tools?.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {purchaseList.fillerGreenery?.length > 0 && (
              <div className="bg-surface-container-low p-7 rounded-xl">
                <h3 className="font-headline text-xl text-primary mb-4">绿植填充</h3>
                <ul className="space-y-3">
                  {purchaseList.fillerGreenery.map((g, i) => (
                    <li key={i} className="flex items-center gap-2 text-secondary text-sm font-body">
                      <span className="material-symbols-outlined text-base">park</span>
                      {g}
                    </li>
                  ))}
                </ul>
                <p className="text-[10px] text-secondary/60 font-label uppercase tracking-widest mt-6">
                  Greenery
                </p>
              </div>
            )}
            {purchaseList.tools?.length > 0 && (
              <div className="bg-surface-container p-7 rounded-xl">
                <h3 className="font-headline text-xl text-primary mb-4">工具准备</h3>
                <ul className="space-y-3">
                  {purchaseList.tools.map((t, i) => (
                    <li key={i} className="flex items-center gap-2 text-secondary text-sm font-body">
                      <span className="material-symbols-outlined text-base">content_cut</span>
                      {t}
                    </li>
                  ))}
                </ul>
                <p className="text-[10px] text-secondary/60 font-label uppercase tracking-widest mt-6">
                  Tools
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons (outside export area) */}
      <div className="flex flex-col gap-4 mt-8">
        <button
          onClick={handleExport}
          disabled={exporting}
          className="w-full py-5 bg-primary text-on-primary rounded-full font-semibold flex items-center justify-center gap-3 hover:bg-primary-container transition-colors shadow-sm disabled:opacity-60"
        >
          {exporting ? (
            <>
              <span className="material-symbols-outlined animate-spin-slow">refresh</span>
              正在导出…
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">ios_share</span>
              导出图片
            </>
          )}
        </button>
        <button
          onClick={onRedo}
          className="w-full py-5 border border-outline-variant/20 text-primary rounded-full font-semibold flex items-center justify-center gap-3 hover:bg-surface-container-low transition-colors"
        >
          <span className="material-symbols-outlined">refresh</span>
          重新推荐
        </button>
      </div>
    </main>
  );
}
