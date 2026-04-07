import React, { useRef, useState } from 'react';
import { UploadedImage } from '../types';
import { SAMPLE_IMAGES } from '../constants/flowers';

interface PhotoUploadProps {
  onAnalyze: (image: UploadedImage) => void;
  isLoading: boolean;
}

export default function PhotoUpload({ onAnalyze, isLoading }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [pending, setPending] = useState<UploadedImage | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('请上传图片文件（JPG、PNG 等）');
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const base64 = dataUrl.split(',')[1];
      setPreview(dataUrl);
      setPending({ base64, mimeType: file.type, previewUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <main className="pt-24 pb-32 px-6 max-w-md mx-auto flex flex-col items-center gap-10">
      {/* Header */}
      <div className="text-center space-y-3 w-full">
        <span className="text-secondary font-label uppercase tracking-widest text-xs font-bold">
          The Digital Herbarium
        </span>
        <h2 className="font-headline text-3xl font-bold leading-tight px-4 text-primary">
          探索自然之美
        </h2>
        <p className="text-secondary text-sm font-medium">上传花束照片，AI 即刻识别花卉</p>
      </div>

      {/* Upload Area */}
      <div className="w-full relative group">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={`aspect-square w-full rounded-full border-2 border-dashed flex flex-col items-center justify-center gap-6 p-8 relative overflow-hidden transition-all duration-500 cursor-pointer ${
            dragOver
              ? 'border-primary bg-surface-container'
              : 'border-outline-variant bg-surface-container-low hover:bg-surface-container-high'
          }`}
          onClick={() => !preview && inputRef.current?.click()}
        >
          {preview ? (
            /* Image preview fills the circle */
            <>
              <img
                src={preview}
                alt="上传的花束"
                className="absolute inset-0 w-full h-full object-cover rounded-full"
              />
              <div className="absolute inset-0 bg-primary/20 rounded-full" />
              <button
                onClick={(e) => { e.stopPropagation(); setPreview(null); setPending(null); }}
                className="relative z-10 p-2 bg-white/90 rounded-full text-primary hover:bg-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </>
          ) : (
            /* Default upload prompt */
            <>
              {/* Background hint image */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <img
                  src={SAMPLE_IMAGES[0]}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="size-20 rounded-full bg-surface-container-highest flex items-center justify-center text-primary transition-transform group-hover:scale-110 duration-500">
                  <span className="material-symbols-outlined text-4xl">photo_camera</span>
                </div>
                <div className="text-center">
                  <p className="font-headline text-lg font-bold text-on-surface">
                    点击或拖拽上传花束照片
                  </p>
                  <p className="text-secondary text-sm mt-1">支持 JPG、PNG 格式</p>
                </div>
                <button
                  className="mt-2 px-8 py-3 bg-surface-container-highest text-on-surface rounded-full text-sm font-bold border border-outline-variant/20 hover:bg-surface-dim transition-colors"
                  onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                >
                  选择照片
                </button>
              </div>
            </>
          )}
        </div>

        {/* Floating label */}
        <div className="absolute -bottom-4 -right-2 bg-surface-container-highest px-5 py-3 rounded-xl border border-outline-variant/15 shadow-sm transform rotate-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm">filter_vintage</span>
            <span className="text-xs font-bold uppercase tracking-tighter text-secondary">
              Specimen ID: 001
            </span>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />

      {/* Error message */}
      {error && (
        <p className="text-error text-sm font-label text-center">{error}</p>
      )}

      {/* Sample thumbnails */}
      <div className="w-full grid grid-cols-3 gap-4">
        {SAMPLE_IMAGES.map((src, i) => (
          <div key={src} className="aspect-square rounded-xl overflow-hidden bg-surface-container border border-outline-variant/10">
            <img
              src={src}
              alt={`示例 ${i + 1}`}
              className="w-full h-full object-cover opacity-80 grayscale hover:grayscale-0 transition-all cursor-pointer"
            />
          </div>
        ))}
      </div>

      {/* Analyze Button */}
      <div className="w-full">
        <button
          onClick={() => pending && onAnalyze(pending)}
          disabled={!pending || isLoading}
          className="w-full bg-primary text-on-primary py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary/10 hover:bg-primary-container transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <span className="material-symbols-outlined animate-spin-slow">refresh</span>
              AI 正在识别…
            </>
          ) : (
            <>
              <span>开始识别</span>
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </>
          )}
        </button>
      </div>
    </main>
  );
}
