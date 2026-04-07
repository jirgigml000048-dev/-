import React, { useState, useCallback } from 'react';
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
import { generateBouquetRecommendation, identifyFlowersFromImage, annotateFlowersInImage } from './services/geminiService';
import { filterPhotos } from './constants/photoLibrary';
import TopAppBar from './components/TopAppBar';
import BottomNav from './components/BottomNav';
import HomeScreen from './components/HomeScreen';
import StyleSelector from './components/StyleSelector';
import BouquetGallery from './components/BouquetGallery';
import PurchaseListScreen from './components/PurchaseList';
import PhotoUpload from './components/PhotoUpload';
import LibraryPreview from './components/LibraryPreview';

const isPreview = new URLSearchParams(window.location.search).has('preview');

export default function App() {
  if (isPreview) return <LibraryPreview />;
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [styleStep, setStyleStep] = useState<StyleFlowStep>('select');
  const [identifyStep, setIdentifyStep] = useState<IdentifyFlowStep>('upload');

  const [selections, setSelections] = useState<StyleSelections>({
    style: '浪漫唯美',
    occasion: '爱情',
    size: '中型',
  });
  const [recommendedPhotos, setRecommendedPhotos] = useState<PhotoEntry[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');
  const [purchaseList, setPurchaseList] = useState<PurchaseList | null>(null);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [annotations, setAnnotations] = useState<FlowerAnnotation[] | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const handleTabChange = useCallback((tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === 'style') setStyleStep('select');
    if (tab === 'identify') setIdentifyStep('upload');
    setError(null);
  }, []);

  // Feature 1: style selected → Gemini → gallery
  const handleStyleConfirm = useCallback(async (sel: StyleSelections) => {
    setSelections(sel);
    setIsLoading(true);
    setError(null);
    try {
      const list = await generateBouquetRecommendation(sel.style, sel.occasion, sel.size);
      const photos = filterPhotos(sel, 4);
      setPurchaseList(list);
      setRecommendedPhotos(photos);
      setSelectedPhoto(photos[0]?.url ?? '');
      setStyleStep('gallery');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(`推荐失败：${msg}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Feature 1: user picks photo → show purchase list
  const handlePhotoConfirm = useCallback((photoUrl: string) => {
    setSelectedPhoto(photoUrl);
    setStyleStep('purchase');
  }, []);

  // Feature 2: upload image → Gemini Vision → purchase list
  const handleAnalyze = useCallback(async (image: UploadedImage) => {
    setUploadedImage(image);
    setIsLoading(true);
    setError(null);
    try {
      const list = await identifyFlowersFromImage(image.base64, image.mimeType);
      setPurchaseList(list);
      setIdentifyStep('result');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(`识别失败：${msg}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRequestAnnotation = useCallback(async () => {
    if (!uploadedImage) return;
    setIsAnnotating(true);
    setError(null);
    try {
      const result = await annotateFlowersInImage(uploadedImage.base64, uploadedImage.mimeType);
      setAnnotations(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(`标注失败：${msg}`);
    } finally {
      setIsAnnotating(false);
    }
  }, [uploadedImage]);

  const handleRedo = useCallback(() => {
    if (activeTab === 'style') {
      setStyleStep('select');
      setPurchaseList(null);
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
    if (activeTab === 'home') {
      return <HomeScreen onNavigate={handleTabChange} />;
    }

    if (activeTab === 'style') {
      if (styleStep === 'select') {
        return <StyleSelector onConfirm={handleStyleConfirm} isLoading={isLoading} />;
      }
      if (styleStep === 'gallery') {
        return (
          <BouquetGallery
            selections={selections}
            purchaseList={purchaseList}
            photos={recommendedPhotos}
            onConfirm={handlePhotoConfirm}
            onBack={() => setStyleStep('select')}
          />
        );
      }
      if (styleStep === 'purchase' && purchaseList) {
        return (
          <PurchaseListScreen
            purchaseList={purchaseList}
            heroImageUrl={selectedPhoto}
            onRedo={handleRedo}
          />
        );
      }
    }

    if (activeTab === 'identify') {
      if (identifyStep === 'upload') {
        return <PhotoUpload onAnalyze={handleAnalyze} isLoading={isLoading} />;
      }
      if (identifyStep === 'result' && purchaseList && uploadedImage) {
        return (
          <PurchaseListScreen
            purchaseList={purchaseList}
            heroImageUrl={uploadedImage.previewUrl}
            onRedo={handleRedo}
            annotations={annotations}
            onRequestAnnotation={handleRequestAnnotation}
            isAnnotating={isAnnotating}
          />
        );
      }
    }

    if (activeTab === 'lists') {
      if (purchaseList) {
        return (
          <PurchaseListScreen
            purchaseList={purchaseList}
            heroImageUrl={selectedPhoto || uploadedImage?.previewUrl || ''}
            onRedo={handleRedo}
          />
        );
      }
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
