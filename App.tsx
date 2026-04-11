import React, { useState, useCallback, useEffect } from 'react';
import {
  ActiveTab,
  StyleFlowStep,
  IdentifyFlowStep,
  StyleSelections,
  PurchaseList,
  UploadedImage,
  PhotoEntry,
  FlowerAnnotation,
} from './types';
import { identifyFlowersFromImage, annotateFlowersInImage } from './services/geminiService';
import { getPhotoCache, setPhotoCache } from './utils/supabaseCache';
import { filterPhotos } from './constants/photoLibrary';
import { decodeShare, SharePayload } from './utils/shareUtils';
import TopAppBar from './components/TopAppBar';
import BottomNav from './components/BottomNav';
import HomeScreen from './components/HomeScreen';
import StyleSelector from './components/StyleSelector';
import BouquetGallery from './components/BouquetGallery';
import PurchaseListScreen from './components/PurchaseList';
import PhotoUpload from './components/PhotoUpload';
import LibraryPreview from './components/LibraryPreview';

const isPreview = new URLSearchParams(window.location.search).has('preview');

const DEFAULT_SELECTIONS: StyleSelections = {
  style: '浪漫唯美', occasion: '爱情', size: '中型',
};

function loadSelections(): StyleSelections {
  try {
    const s = localStorage.getItem('pi_selections');
    return s ? { ...DEFAULT_SELECTIONS, ...JSON.parse(s) } : DEFAULT_SELECTIONS;
  } catch { return DEFAULT_SELECTIONS; }
}

function loadLastList(): { purchaseList: PurchaseList; selectedPhoto: string } | null {
  try {
    const s = localStorage.getItem('pi_last_list');
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

// Fetch a local image URL and return base64 + mimeType
async function fetchImageAsBase64(url: string): Promise<{ base64: string; mimeType: string }> {
  const res = await fetch(url);
  const blob = await res.blob();
  const mimeType = blob.type || 'image/jpeg';
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const dataUrl = e.target?.result as string;
      resolve({ base64: dataUrl.split(',')[1], mimeType });
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default function App() {
  if (isPreview) return <LibraryPreview />;

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [styleStep, setStyleStep] = useState<StyleFlowStep>('select');
  const [identifyStep, setIdentifyStep] = useState<IdentifyFlowStep>('upload');

  const [selections, setSelections] = useState<StyleSelections>(loadSelections);
  const [recommendedPhotos, setRecommendedPhotos] = useState<PhotoEntry[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');
  const [purchaseList, setPurchaseList] = useState<PurchaseList | null>(null);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [annotations, setAnnotations] = useState<FlowerAnnotation[] | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  // Restore from ?share= param (shared link) or last saved list
  useEffect(() => {
    const shareParam = new URLSearchParams(window.location.search).get('share');
    if (shareParam) {
      try {
        const decoded = decodeShare(shareParam) as SharePayload;
        // Support both new SharePayload format and legacy plain PurchaseList
        const list = decoded.purchaseList ?? (decoded as unknown as PurchaseList);
        setPurchaseList(list);
        if (decoded.heroImageUrl) setSelectedPhoto(decoded.heroImageUrl);
        setActiveTab('lists');
        window.history.replaceState({}, '', window.location.pathname);
      } catch {
        // malformed share param — ignore
      }
      return;
    }
    const last = loadLastList();
    if (last) {
      setPurchaseList(last.purchaseList);
      setSelectedPhoto(last.selectedPhoto);
    }
  }, []);

  // Persist selections whenever they change
  useEffect(() => {
    localStorage.setItem('pi_selections', JSON.stringify(selections));
  }, [selections]);

  // Persist last generated list
  useEffect(() => {
    if (purchaseList && selectedPhoto) {
      localStorage.setItem('pi_last_list', JSON.stringify({ purchaseList, selectedPhoto }));
    }
  }, [purchaseList, selectedPhoto]);

  const handleTabChange = useCallback((tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === 'style') setStyleStep('select');
    if (tab === 'identify') setIdentifyStep('upload');
    setError(null);
  }, []);

  // Feature 1: style selected → filter photos locally → gallery (no AI yet)
  const handleStyleConfirm = useCallback((sel: StyleSelections) => {
    setSelections(sel);
    const photos = filterPhotos(sel, 4);
    setRecommendedPhotos(photos);
    setSelectedPhoto(photos[0]?.url ?? '');
    setPurchaseList(null);
    setAnnotations(undefined);
    setStyleStep('gallery');
  }, []);

  // Feature 1b: user picks photo → check cache first, then visually identify
  const handlePhotoConfirm = useCallback(async (photo: PhotoEntry) => {
    setSelectedPhoto(photo.url);
    setAnnotations(undefined);
    setPurchaseList(null);
    setStyleStep('purchase');
    setIsLoading(true);
    setError(null);
    try {
      // Check Supabase cache first
      const cached = await getPhotoCache(photo.id);
      if (cached) {
        setPurchaseList(cached.purchase_list);
        setAnnotations(cached.annotations.length > 0 ? cached.annotations : undefined);
        return;
      }
      // Cache miss → visually identify
      const { base64, mimeType } = await fetchImageAsBase64(photo.url);
      const list = await identifyFlowersFromImage(base64, mimeType);
      setPurchaseList(list);
      setIsLoading(false);
      setIsAnnotating(true);
      const flowerNames = list.flowers.map(f => f.nameCN);
      const anns = await annotateFlowersInImage(base64, mimeType, flowerNames).catch(() => [] as FlowerAnnotation[]);
      const finalAnns = anns.length > 0 ? anns : [];
      setAnnotations(finalAnns.length > 0 ? finalAnns : undefined);
      // Fire-and-forget cache write
      setPhotoCache(photo.id, list, finalAnns);
    } catch (err) {
      setError(`生成失败：${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
      setIsAnnotating(false);
    }
  }, []);

  // Feature 2: upload → identify first, then annotate with known flower names
  const handleAnalyze = useCallback(async (image: UploadedImage) => {
    setUploadedImage(image);
    setIsLoading(true);
    setAnnotations(undefined);
    setError(null);
    try {
      const list = await identifyFlowersFromImage(image.base64, image.mimeType);
      setPurchaseList(list);
      setIdentifyStep('result');
      setIsLoading(false);
      // Annotate only the identified flowers
      setIsAnnotating(true);
      const flowerNames = list.flowers.map(f => f.nameCN);
      const anns = await annotateFlowersInImage(image.base64, image.mimeType, flowerNames).catch(() => [] as FlowerAnnotation[]);
      setAnnotations(anns.length > 0 ? anns : undefined);
    } catch (err) {
      setError(`识别失败：${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
      setIsAnnotating(false);
    }
  }, []);

  // Home screen banner click → go directly to purchase list (same as picking from gallery)
  const handleHomePhotoClick = useCallback((photo: PhotoEntry) => {
    setActiveTab('style');
    handlePhotoConfirm(photo);
  }, [handlePhotoConfirm]);

  const handleRedo = useCallback(() => {
    if (activeTab === 'style') {
      setStyleStep('select');
      setPurchaseList(null);
      setAnnotations(undefined);
    } else {
      setIdentifyStep('upload');
      setUploadedImage(null);
      setPurchaseList(null);
      setAnnotations(undefined);
    }
  }, [activeTab]);

  const showBack =
    (activeTab === 'style' && styleStep !== 'select') ||
    (activeTab === 'identify' && identifyStep !== 'upload');

  const handleBack = useCallback(() => {
    if (activeTab === 'style') {
      if (styleStep === 'purchase') setStyleStep('gallery');
      else if (styleStep === 'gallery') setStyleStep('select');
    } else if (activeTab === 'identify') {
      if (identifyStep === 'result') setIdentifyStep('upload');
    }
  }, [activeTab, styleStep, identifyStep]);

  const renderScreen = () => {
    if (activeTab === 'home') return <HomeScreen onNavigate={handleTabChange} onPhotoClick={handleHomePhotoClick} />;

    if (activeTab === 'style') {
      if (styleStep === 'select')
        return <StyleSelector onConfirm={handleStyleConfirm} isLoading={isLoading} />;
      if (styleStep === 'gallery')
        return (
          <BouquetGallery
            selections={selections}
            purchaseList={purchaseList}
            photos={recommendedPhotos}
            onConfirm={handlePhotoConfirm}
            onBack={() => setStyleStep('select')}
          />
        );
      if (styleStep === 'purchase')
        return (
          <PurchaseListScreen
            purchaseList={purchaseList}
            heroImageUrl={selectedPhoto}
            onRedo={handleRedo}
            annotations={annotations}
            isAnnotating={isAnnotating}
            isLoading={isLoading}
          />
        );
    }

    if (activeTab === 'identify') {
      if (identifyStep === 'upload')
        return <PhotoUpload onAnalyze={handleAnalyze} isLoading={isLoading} />;
      if (identifyStep === 'result' && purchaseList && uploadedImage)
        return (
          <PurchaseListScreen
            purchaseList={purchaseList}
            heroImageUrl={uploadedImage.previewUrl}
            onRedo={handleRedo}
            annotations={annotations}
            isAnnotating={isAnnotating}
          />
        );
    }

    if (activeTab === 'lists') {
      if (purchaseList)
        return (
          <PurchaseListScreen
            purchaseList={purchaseList}
            heroImageUrl={selectedPhoto || uploadedImage?.previewUrl || ''}
            onRedo={handleRedo}
            annotations={annotations}
            isAnnotating={isAnnotating}
          />
        );
      return <HomeScreen onNavigate={handleTabChange} />;
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <TopAppBar showBack={showBack} onBack={handleBack} />
      {error && (
        <div className="fixed top-20 left-0 right-0 z-40 px-6 max-w-2xl mx-auto">
          <div className="bg-error-container text-on-error-container px-5 py-4 rounded-xl flex items-center gap-3 shadow-lg">
            <span className="material-symbols-outlined text-error shrink-0">error</span>
            <p className="text-sm font-label flex-1">{error}</p>
            <button onClick={() => setError(null)}>
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>
      )}
      {renderScreen()}
      <BottomNav activeTab={activeTab} onChange={handleTabChange} />
    </div>
  );
}
