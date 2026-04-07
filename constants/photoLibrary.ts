import { PhotoEntry, FlowerStyle, FlowerOccasion, FlowerColor, MainFlower, FlowerSeason, StyleSelections } from '../types';

export const PHOTO_LIBRARY: PhotoEntry[] = [
  {
    id: 'p001', url: '/images/p001.jpg', name: '窗台絮语',
    styles: ['自然田园', '浪漫唯美'], occasions: ['日常', '友情'],
    colors: ['紫色系', '混色'], mainFlowers: ['绣球', '其他'], season: '夏',
  },
  {
    id: 'p002', url: '/images/p002.jpg', name: '秋野繁盛',
    styles: ['自然田园', '复古典雅'], occasions: ['节日', '日常'],
    colors: ['黄橙系', '混色'], mainFlowers: ['其他'], season: '秋',
  },
  {
    id: 'p003', url: '/images/p003.jpg', name: '粉百合疏影',
    styles: ['现代简约', '日式侘寂'], occasions: ['爱情', '日常'],
    colors: ['粉色系', '红色系'], mainFlowers: ['其他'], season: '四季',
  },
  {
    id: 'p004', url: '/images/p004.jpg', name: '暖橘晨光',
    styles: ['浪漫唯美', '自然田园'], occasions: ['爱情', '友情', '节日'],
    colors: ['粉色系', '黄橙系'], mainFlowers: ['玫瑰', '其他'], season: '四季',
  },
  {
    id: 'p005', url: '/images/p005.jpg', name: '白紫轻吟',
    styles: ['现代简约', '浪漫唯美'], occasions: ['日常', '爱情'],
    colors: ['白色系', '紫色系'], mainFlowers: ['绣球', '其他'], season: '四季',
  },
  {
    id: 'p006', url: '/images/p006.jpg', name: '向阳暗夜',
    styles: ['自然田园'], occasions: ['友情', '日常'],
    colors: ['黄橙系', '混色'], mainFlowers: ['向日葵', '其他'], season: '夏',
  },
  {
    id: 'p007', url: '/images/p007.jpg', name: '粉紫云絮',
    styles: ['浪漫唯美', '复古典雅'], occasions: ['爱情', '友情'],
    colors: ['紫色系', '粉色系'], mainFlowers: ['玫瑰', '满天星'], season: '四季',
  },
  {
    id: 'p008', url: '/images/p008.jpg', name: '百花盛宴',
    styles: ['复古典雅', '浪漫唯美'], occasions: ['节日'],
    colors: ['混色'], mainFlowers: ['牡丹', '绣球', '向日葵'], season: '夏',
  },
  {
    id: 'p009', url: '/images/p009.jpg', name: '自由野束',
    styles: ['自然田园', '日式侘寂'], occasions: ['日常', '友情'],
    colors: ['红色系', '混色'], mainFlowers: ['其他', '玫瑰'], season: '秋',
  },
  {
    id: 'p010', url: '/images/p010.jpg', name: '金玉满堂',
    styles: ['复古典雅', '浪漫唯美'], occasions: ['节日', '爱情'],
    colors: ['黄橙系', '混色'], mainFlowers: ['玫瑰', '向日葵', '满天星'], season: '四季',
  },
  {
    id: 'p011', url: '/images/p011.jpg', name: '蕨野微火',
    styles: ['日式侘寂', '自然田园'], occasions: ['日常'],
    colors: ['红色系', '混色'], mainFlowers: ['其他'], season: '夏',
  },
];

// ── Shuffle helper ────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Filter with automatic fallback ───────────────────────────────────────────
export function filterPhotos(sel: StyleSelections, count = 4): PhotoEntry[] {
  const { style, occasion, color, mainFlower, season } = sel;

  // Level 1: all filters
  let results = PHOTO_LIBRARY.filter(p =>
    p.styles.includes(style) &&
    p.occasions.includes(occasion) &&
    (!color || p.colors.includes(color)) &&
    (!mainFlower || p.mainFlowers.includes(mainFlower)) &&
    (!season || p.season === season || p.season === '四季')
  );

  // Level 2: style + occasion only
  if (results.length < 2) {
    results = PHOTO_LIBRARY.filter(p =>
      p.styles.includes(style) && p.occasions.includes(occasion)
    );
  }

  // Level 3: style only
  if (results.length < 2) {
    results = PHOTO_LIBRARY.filter(p => p.styles.includes(style));
  }

  // Level 4: full library fallback
  if (results.length < 2) {
    results = PHOTO_LIBRARY;
  }

  return shuffle(results).slice(0, count);
}
