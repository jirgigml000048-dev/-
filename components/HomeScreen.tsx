import React from 'react';
import { ActiveTab, FlowerStyle } from '../types';
import { getUnsplashUrl, FEATURED_BOUQUET_ID, COLLECTION_ITEMS } from '../constants/flowers';

interface HomeScreenProps {
  onNavigate: (tab: ActiveTab) => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  return (
    <main className="pt-24 px-6 max-w-screen-md mx-auto pb-32">
      {/* Editorial Section: Today's Recommendation */}
      <section className="mb-12">
        <div className="mb-4">
          <span className="font-label text-secondary text-xs uppercase tracking-widest font-semibold">
            Specimen of the Day
          </span>
          <h2 className="font-headline text-3xl mt-2 text-primary font-bold">今日推荐：晨露牡丹</h2>
        </div>
        <div className="relative overflow-hidden rounded-xl aspect-[4/5] md:aspect-video group">
          <img
            src={getUnsplashUrl(FEATURED_BOUQUET_ID, 800)}
            alt="今日推荐花束"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <p className="font-headline text-lg italic leading-relaxed opacity-90 max-w-xs">
              「唯有牡丹真国色，花开时节动京城。」<br />
              晨曦微露，花瓣轻颤，记录那一抹稍纵即逝的灵动。
            </p>
          </div>
        </div>
      </section>

      {/* Main Entry Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-12">
        <button
          onClick={() => onNavigate('style')}
          className="flex flex-col items-start justify-between p-8 bg-surface-container-low rounded-xl aspect-square hover:bg-surface-container transition-colors text-left group"
        >
          <div className="p-3 bg-primary text-white rounded-full group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined">palette</span>
          </div>
          <div>
            <h3 className="font-headline text-xl font-bold text-primary mb-1">风格推荐</h3>
            <p className="text-sm text-secondary font-label">寻找属于你的植物美学</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('identify')}
          className="flex flex-col items-start justify-between p-8 bg-primary text-white rounded-xl aspect-square hover:bg-primary-container transition-colors text-left group"
        >
          <div className="p-3 bg-white/20 rounded-full group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined">center_focus_strong</span>
          </div>
          <div>
            <h3 className="font-headline text-xl font-bold mb-1">拍照识别</h3>
            <p className="text-sm text-white/70 font-label">即刻洞察自然的秘密</p>
          </div>
        </button>
      </div>

      {/* Curated Collections */}
      <section className="mb-12">
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="font-label text-secondary text-xs uppercase tracking-widest font-semibold">
              Collections
            </span>
            <h2 className="font-headline text-2xl mt-1 text-primary">精选专题</h2>
          </div>
          <button
            onClick={() => onNavigate('style')}
            className="text-primary font-label text-sm font-semibold border-b border-primary/20 pb-1"
          >
            查看全部
          </button>
        </div>

        <div className="space-y-4">
          {COLLECTION_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate('style')}
              className="w-full flex gap-6 items-center p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors group text-left"
            >
              <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                <img
                  src={getUnsplashUrl(item.id, 200)}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-headline font-bold text-lg text-primary">{item.title}</h4>
                <p className="text-sm text-secondary font-label mt-1">{item.subtitle}</p>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
