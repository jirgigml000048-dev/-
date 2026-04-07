import { FlowerStyle } from '../types';

// ── 本地图库：每个风格的封面图（用于 StyleSelector 预览）──────────────────────
export const STYLE_COVER_IMAGES: Record<FlowerStyle, string> = {
  '现代简约': '/images/egor-myznik-T5VLwMWN1yE-unsplash.jpg',    // 白绿正式
  '浪漫唯美': '/images/angelina-jollivet-mNEpmNiFdXs-unsplash.jpg', // 蜜桃园玫
  '自然田园': '/images/duong-ngan-RJudoZ6qJ3o-unsplash.jpg',       // 白毛茛晨
  '日式侘寂': '/images/bin-white-m5LO15SDUJk-unsplash.jpg',        // 秋门枯荣
  '复古典雅': '/images/by-pils-9y3dim8LaJk-unsplash.jpg',          // 暗夜芳华
};

// ── HomeScreen 今日推荐图 ─────────────────────────────────────────────────────
export const FEATURED_IMAGE = '/images/elvira-syamsir-mUmGFI8B5g0-unsplash.jpg';

// ── HomeScreen 精选专题 ───────────────────────────────────────────────────────
export const COLLECTION_ITEMS = [
  {
    image: '/images/egor-myznik-T5VLwMWN1yE-unsplash.jpg',
    title: '极简主义',
    subtitle: '适合现代居家的低维护花束清单',
    style: '现代简约' as FlowerStyle,
  },
  {
    image: '/images/bin-white-m5LO15SDUJk-unsplash.jpg',
    title: '侘寂美学',
    subtitle: '探寻枯荣之间的禅意之美',
    style: '日式侘寂' as FlowerStyle,
  },
];

// ── PhotoUpload 示例缩略图 ────────────────────────────────────────────────────
export const SAMPLE_IMAGES = [
  '/images/ally-s9Mg1uPY4Zg-unsplash.jpg',          // 粉紫晨柜
  '/images/rachel-yang-KQhjgp4vlHw-unsplash.jpg',    // 黄橙节日台
  '/images/evie-fjord-QrnL7ljcb18-unsplash.jpg',     // 蓝风信子春
];

// ── 保留旧接口（部分组件可能仍在引用）────────────────────────────────────────
export function getUnsplashUrl(id: string, w = 600): string {
  return `https://images.unsplash.com/photo-${id}?w=${w}&fit=crop&auto=format`;
}

// Kept for backwards-compat, not actively used
export const FEATURED_BOUQUET_ID = '';
export const SAMPLE_PHOTO_IDS: string[] = [];
export const BOUQUET_PHOTO_IDS: Record<FlowerStyle, string[]> = {
  '现代简约': [], '浪漫唯美': [], '自然田园': [], '日式侘寂': [], '复古典雅': [],
};
export function getRandomPhotos(): string[] { return []; }
