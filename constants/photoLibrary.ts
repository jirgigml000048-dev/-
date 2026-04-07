import { PhotoEntry, FlowerStyle, FlowerOccasion, FlowerColor, MainFlower, FlowerSeason, StyleSelections } from '../types';

export const PHOTO_LIBRARY: PhotoEntry[] = [
  // ── 原始 p001-p011 ──────────────────────────────────────────────────────────
  {
    id: 'p001', url: '/images/johanne-pold-jacobsen-jKO_cXvui_E-unsplash.jpg', name: '窗台絮语',
    styles: ['自然田园', '浪漫唯美'], occasions: ['日常', '友情'],
    colors: ['紫色系', '混色'], mainFlowers: ['绣球', '其他'], season: '夏',
  },
  {
    id: 'p002', url: '/images/hailey-wagner-4icV47LjYc4-unsplash.jpg', name: '秋野繁盛',
    styles: ['自然田园', '复古典雅'], occasions: ['节日', '日常'],
    colors: ['黄橙系', '混色'], mainFlowers: ['其他'], season: '秋',
  },
  {
    id: 'p003', url: '/images/johanne-pold-jacobsen-5o14nQMwHdU-unsplash.jpg', name: '粉百合疏影',
    styles: ['现代简约', '日式侘寂'], occasions: ['爱情', '日常'],
    colors: ['粉色系', '红色系'], mainFlowers: ['其他'], season: '四季',
  },
  {
    id: 'p004', url: '/images/kitera-dent-oKTbuBOyz_E-unsplash.jpg', name: '暖橘晨光',
    styles: ['浪漫唯美', '自然田园'], occasions: ['爱情', '友情', '节日'],
    colors: ['粉色系', '黄橙系'], mainFlowers: ['玫瑰', '其他'], season: '四季',
  },
  {
    id: 'p005', url: '/images/karin-boon-v5MFEeyD7lQ-unsplash.jpg', name: '白紫轻吟',
    styles: ['现代简约', '浪漫唯美'], occasions: ['日常', '爱情'],
    colors: ['白色系', '紫色系'], mainFlowers: ['绣球', '其他'], season: '四季',
  },
  {
    id: 'p006', url: '/images/madeline-liu-bN9OJUzpQAE-unsplash.jpg', name: '向阳暗夜',
    styles: ['自然田园'], occasions: ['友情', '日常'],
    colors: ['黄橙系', '混色'], mainFlowers: ['向日葵', '其他'], season: '夏',
  },
  {
    id: 'p007', url: '/images/linh-le-j05zD0YtZBw-unsplash.jpg', name: '粉紫云絮',
    styles: ['浪漫唯美', '复古典雅'], occasions: ['爱情', '友情'],
    colors: ['紫色系', '粉色系'], mainFlowers: ['玫瑰', '满天星'], season: '四季',
  },
  {
    id: 'p008', url: '/images/marcella-marcella-hn6CC9aosEk-unsplash.jpg', name: '百花盛宴',
    styles: ['复古典雅', '浪漫唯美'], occasions: ['节日'],
    colors: ['混色'], mainFlowers: ['牡丹', '绣球', '向日葵'], season: '夏',
  },
  {
    id: 'p009', url: '/images/micheile-henderson-A5W9yhQBb6A-unsplash.jpg', name: '自由野束',
    styles: ['自然田园', '日式侘寂'], occasions: ['日常', '友情'],
    colors: ['红色系', '混色'], mainFlowers: ['其他', '玫瑰'], season: '秋',
  },
  {
    id: 'p010', url: '/images/nguy-n-hi-p-2RXeSYkKM8Y-unsplash.jpg', name: '金玉满堂',
    styles: ['复古典雅', '浪漫唯美'], occasions: ['节日', '爱情'],
    colors: ['黄橙系', '混色'], mainFlowers: ['玫瑰', '向日葵', '满天星'], season: '四季',
  },
  {
    id: 'p011', url: '/images/nordwood-themes-Xp2w3veqgUQ-unsplash.jpg', name: '蕨野微火',
    styles: ['日式侘寂', '自然田园'], occasions: ['日常'],
    colors: ['红色系', '混色'], mainFlowers: ['其他'], season: '夏',
  },

  // ── 新增 p012-p036 ──────────────────────────────────────────────────────────
  {
    id: 'p012', url: '/images/ally-s9Mg1uPY4Zg-unsplash.jpg', name: '粉紫晨柜',
    styles: ['浪漫唯美', '自然田园'], occasions: ['友情', '爱情'],
    colors: ['粉色系', '紫色系'], mainFlowers: ['玫瑰', '其他'], season: '春',
  },
  {
    id: 'p013', url: '/images/angelina-jollivet-mNEpmNiFdXs-unsplash.jpg', name: '蜜桃园玫',
    styles: ['浪漫唯美', '复古典雅'], occasions: ['爱情', '节日'],
    colors: ['粉色系', '黄橙系'], mainFlowers: ['玫瑰', '其他'], season: '四季',
  },
  {
    id: 'p014', url: '/images/bin-white-m5LO15SDUJk-unsplash.jpg', name: '秋门枯荣',
    styles: ['日式侘寂', '复古典雅'], occasions: ['日常'],
    colors: ['黄橙系', '混色'], mainFlowers: ['其他'], season: '秋',
  },
  {
    id: 'p015', url: '/images/by-pils-9y3dim8LaJk-unsplash.jpg', name: '暗夜芳华',
    styles: ['复古典雅', '日式侘寂'], occasions: ['爱情', '日常'],
    colors: ['粉色系', '混色'], mainFlowers: ['玫瑰', '满天星'], season: '四季',
  },
  {
    id: 'p016', url: '/images/charlotte-cowell-taYqBXFrrfY-unsplash.jpg', name: '热带盛放',
    styles: ['自然田园'], occasions: ['节日', '日常'],
    colors: ['混色', '红色系'], mainFlowers: ['其他'], season: '夏',
  },
  {
    id: 'p017', url: '/images/duong-ngan-RJudoZ6qJ3o-unsplash.jpg', name: '白毛茛晨',
    styles: ['自然田园', '现代简约'], occasions: ['日常', '友情'],
    colors: ['白色系', '黄橙系'], mainFlowers: ['其他'], season: '春',
  },
  {
    id: 'p018', url: '/images/duong-ngan-_WeqRrIpQKI-unsplash.jpg', name: '白玫月光',
    styles: ['现代简约', '浪漫唯美'], occasions: ['爱情', '日常'],
    colors: ['白色系', '粉色系'], mainFlowers: ['玫瑰'], season: '四季',
  },
  {
    id: 'p019', url: '/images/earl-wilcox-JlxGSmEy6bs-unsplash.jpg', name: '白百合素颂',
    styles: ['现代简约', '日式侘寂'], occasions: ['日常', '悼念'],
    colors: ['白色系'], mainFlowers: ['其他'], season: '四季',
  },
  {
    id: 'p020', url: '/images/earl-wilcox-LsRpyRYaN-8-unsplash.jpg', name: '奶菊柔光',
    styles: ['浪漫唯美', '复古典雅'], occasions: ['爱情', '友情'],
    colors: ['黄橙系', '粉色系'], mainFlowers: ['其他'], season: '秋',
  },
  {
    id: 'p021', url: '/images/earl-wilcox-dxZfhmC3yEM-unsplash.jpg', name: '深红大丽',
    styles: ['复古典雅', '浪漫唯美'], occasions: ['爱情', '节日'],
    colors: ['红色系', '紫色系'], mainFlowers: ['其他'], season: '秋',
  },
  {
    id: 'p022', url: '/images/egor-myznik-T5VLwMWN1yE-unsplash.jpg', name: '白绿正式',
    styles: ['现代简约', '复古典雅'], occasions: ['节日', '悼念'],
    colors: ['白色系'], mainFlowers: ['玫瑰', '郁金香'], season: '四季',
  },
  {
    id: 'p023', url: '/images/elvira-syamsir-mUmGFI8B5g0-unsplash.jpg', name: '粉玫球阵',
    styles: ['浪漫唯美', '复古典雅'], occasions: ['爱情', '节日'],
    colors: ['粉色系', '白色系'], mainFlowers: ['玫瑰', '其他'], season: '四季',
  },
  {
    id: 'p024', url: '/images/evie-fjord-QrnL7ljcb18-unsplash.jpg', name: '蓝风信子春',
    styles: ['自然田园', '浪漫唯美'], occasions: ['友情', '日常'],
    colors: ['紫色系', '白色系'], mainFlowers: ['郁金香', '其他'], season: '春',
  },
  {
    id: 'p025', url: '/images/filipp-romanovski-raK1TJ9T0R8-unsplash.jpg', name: '春野彩束',
    styles: ['自然田园', '浪漫唯美'], occasions: ['友情', '节日'],
    colors: ['红色系', '混色'], mainFlowers: ['其他', '郁金香'], season: '春',
  },
  {
    id: 'p026', url: '/images/h-ng-xuan-van-oCGA46LgCLA-unsplash.jpg', name: '黄剑兰街角',
    styles: ['日式侘寂', '自然田园'], occasions: ['日常'],
    colors: ['黄橙系'], mainFlowers: ['其他'], season: '夏',
  },
  {
    id: 'p027', url: '/images/jennifer-kalenberg-9LizgNfLKsE-unsplash.jpg', name: '红白礼台',
    styles: ['复古典雅', '浪漫唯美'], occasions: ['节日', '爱情'],
    colors: ['红色系', '混色'], mainFlowers: ['玫瑰', '其他'], season: '四季',
  },
  {
    id: 'p028', url: '/images/jennifer-kalenberg-F4bYJg8BsZw-unsplash.jpg', name: '暖秋礼台',
    styles: ['复古典雅'], occasions: ['节日', '爱情'],
    colors: ['黄橙系', '混色'], mainFlowers: ['玫瑰', '其他'], season: '秋',
  },
  {
    id: 'p029', url: '/images/kenan-soltanov-v-jZhEaa5bs-unsplash.jpg', name: '蓝绿春意',
    styles: ['自然田园', '浪漫唯美'], occasions: ['友情', '节日'],
    colors: ['紫色系', '白色系', '混色'], mainFlowers: ['其他', '玫瑰'], season: '春',
  },
  {
    id: 'p030', url: '/images/marcella-marcella-NvwPGq4WLNY-unsplash.jpg', name: '静物百花',
    styles: ['复古典雅'], occasions: ['节日'],
    colors: ['混色'], mainFlowers: ['玫瑰', '向日葵', '牡丹'], season: '夏',
  },
  {
    id: 'p031', url: '/images/megumi-nachev-OdIWcryyge0-unsplash.jpg', name: '橙非洲菊秋',
    styles: ['自然田园'], occasions: ['友情', '日常'],
    colors: ['黄橙系', '红色系'], mainFlowers: ['雏菊', '其他'], season: '秋',
  },
  {
    id: 'p032', url: '/images/micheile-henderson-PTLBXS2zM0o-unsplash.jpg', name: '洋桔梗工作台',
    styles: ['自然田园', '现代简约'], occasions: ['日常', '友情'],
    colors: ['粉色系', '紫色系'], mainFlowers: ['其他'], season: '四季',
  },
  {
    id: 'p033', url: '/images/rachel-yang-KQhjgp4vlHw-unsplash.jpg', name: '黄橙节日台',
    styles: ['复古典雅', '日式侘寂'], occasions: ['节日'],
    colors: ['黄橙系', '红色系'], mainFlowers: ['其他'], season: '秋',
  },
  {
    id: 'p034', url: '/images/shop-hoa-t-i-flowertalk-frxkXY8w-x4-unsplash.jpg', name: '粉紫花店',
    styles: ['浪漫唯美'], occasions: ['爱情', '节日', '友情'],
    colors: ['紫色系', '粉色系'], mainFlowers: ['玫瑰', '雏菊'], season: '四季',
  },
  {
    id: 'p035', url: '/images/simon-godfrey-q9jWzKu2Dho-unsplash.jpg', name: '白小苍兰',
    styles: ['现代简约', '日式侘寂'], occasions: ['日常'],
    colors: ['白色系'], mainFlowers: ['其他'], season: '春',
  },
  {
    id: 'p036', url: '/images/yan-y-aUDgJ7cwTjY-unsplash.jpg', name: '红火鹤混搭',
    styles: ['现代简约', '复古典雅'], occasions: ['节日', '日常'],
    colors: ['红色系', '白色系'], mainFlowers: ['其他', '玫瑰'], season: '四季',
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
