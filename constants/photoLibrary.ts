import { PhotoEntry, FlowerStyle, FlowerOccasion, FlowerColor, MainFlower, FlowerSeason, StyleSelections } from '../types';

// ── 如何添加图片 ──────────────────────────────────────────────────────────────
// 1. Unsplash：搜索 "flower bouquet arrangement"，点击一张完整花束照片
//    复制地址栏 ID：unsplash.com/photos/{ID}  →  url 写法见下
// 2. 自定义图床（七牛/OSS/Cloudflare R2 等）：上传后直接粘贴 CDN URL
// 3. 本地图片：放入 public/images/，url 写 '/images/xxx.jpg'
// 4. 每张图支持多标签（styles / occasions / colors / mainFlowers 均为数组）
// 5. 添加后访问 your-app.vercel.app?preview 预览确认是完整花束
// ─────────────────────────────────────────────────────────────────────────────

function u(id: string): string {
  // Unsplash shorthand helper
  return `https://images.unsplash.com/photo-${id}?w=600&fit=crop&auto=format`;
}

export const PHOTO_LIBRARY: PhotoEntry[] = [
  // ── 浪漫唯美 · 粉色系 ────────────────────────────────────────────────────
  {
    id: 'p001', url: u('1518531933037-91b2f5f229cc'), name: '粉色晨露',
    styles: ['浪漫唯美'], occasions: ['爱情', '节日'],
    colors: ['粉色系'], mainFlowers: ['牡丹', '玫瑰'], season: '春',
  },
  {
    id: 'p002', url: u('1561181286-d3f9a2a35d66'), name: '蜜桃絮语',
    styles: ['浪漫唯美', '复古典雅'], occasions: ['爱情', '友情'],
    colors: ['粉色系', '红色系'], mainFlowers: ['玫瑰'], season: '四季',
  },
  {
    id: 'p003', url: u('1496861083958-175bb2ede3e8'), name: '柔光花影',
    styles: ['浪漫唯美'], occasions: ['爱情', '日常'],
    colors: ['粉色系', '白色系'], mainFlowers: ['绣球', '玫瑰'], season: '春',
  },
  {
    id: 'p004', url: u('1491404866317-f9e2e1c8d0b8'), name: '初春浅粉',
    styles: ['浪漫唯美'], occasions: ['爱情', '节日'],
    colors: ['粉色系'], mainFlowers: ['郁金香', '满天星'], season: '春',
  },
  {
    id: 'p005', url: u('1565618754664-accc8ae3d46b'), name: '玫瑰庄园',
    styles: ['浪漫唯美'], occasions: ['爱情', '节日'],
    colors: ['粉色系', '红色系'], mainFlowers: ['玫瑰'], season: '四季',
  },
  {
    id: 'p006', url: u('1490750967868-88df5691cc6e'), name: '云淡风轻',
    styles: ['浪漫唯美', '现代简约'], occasions: ['友情', '日常'],
    colors: ['白色系', '粉色系'], mainFlowers: ['绣球', '满天星'], season: '四季',
  },

  // ── 现代简约 · 白色系 ────────────────────────────────────────────────────
  {
    id: 'p007', url: u('1566958769-fe7b27571e8c'), name: '极简白调',
    styles: ['现代简约'], occasions: ['日常', '节日'],
    colors: ['白色系'], mainFlowers: ['玫瑰', '其他'], season: '四季',
  },
  {
    id: 'p008', url: u('1487530811176-3780de880c2d'), name: '素雅清晨',
    styles: ['现代简约'], occasions: ['日常', '友情'],
    colors: ['白色系'], mainFlowers: ['满天星', '其他'], season: '四季',
  },
  {
    id: 'p009', url: u('1599598425947-5202edd56bdb'), name: '纯白序曲',
    styles: ['现代简约'], occasions: ['日常', '节日'],
    colors: ['白色系'], mainFlowers: ['玫瑰'], season: '四季',
  },
  {
    id: 'p010', url: u('1491895200222-0fc4a4c35e18'), name: '白月光',
    styles: ['现代简约', '日式侘寂'], occasions: ['日常'],
    colors: ['白色系'], mainFlowers: ['其他'], season: '四季',
  },
  {
    id: 'p011', url: u('1508610048763-aaad56b35657'), name: '单枝禅意',
    styles: ['现代简约', '日式侘寂'], occasions: ['日常'],
    colors: ['白色系'], mainFlowers: ['其他'], season: '四季',
  },

  // ── 自然田园 · 黄橙系 / 混色 ────────────────────────────────────────────
  {
    id: 'p012', url: u('1471086569351-87b9f4f0d7f8'), name: '向阳而生',
    styles: ['自然田园'], occasions: ['友情', '日常', '节日'],
    colors: ['黄橙系'], mainFlowers: ['向日葵'], season: '夏',
  },
  {
    id: 'p013', url: u('1468929823679-4b5ebb4d9a5f'), name: '野花田',
    styles: ['自然田园'], occasions: ['日常', '友情'],
    colors: ['混色'], mainFlowers: ['雏菊', '其他'], season: '春',
  },
  {
    id: 'p014', url: u('1469474968028-56623f02e42e'), name: '乡间清晨',
    styles: ['自然田园'], occasions: ['日常', '友情'],
    colors: ['混色', '黄橙系'], mainFlowers: ['其他'], season: '夏',
  },
  {
    id: 'p015', url: u('1497366216548-37526070297c'), name: '草地风吟',
    styles: ['自然田园'], occasions: ['日常'],
    colors: ['混色'], mainFlowers: ['雏菊', '满天星'], season: '春',
  },
  {
    id: 'p016', url: u('1558350861-dba7ee5b9e87'), name: '园中摘',
    styles: ['自然田园'], occasions: ['日常', '友情'],
    colors: ['混色'], mainFlowers: ['其他'], season: '夏',
  },
  {
    id: 'p017', url: u('1490750967868-88df5691cc6e'), name: '小雏菊',
    styles: ['自然田园'], occasions: ['友情', '日常'],
    colors: ['黄橙系', '白色系'], mainFlowers: ['雏菊'], season: '春',
  },

  // ── 日式侘寂 ─────────────────────────────────────────────────────────────
  {
    id: 'p018', url: u('1508184964240-ee96bb9677a9'), name: '枯荣之间',
    styles: ['日式侘寂'], occasions: ['日常'],
    colors: ['混色'], mainFlowers: ['其他'], season: '秋',
  },
  {
    id: 'p019', url: u('1516912481800-e2e071c17e3d'), name: '一枝秋',
    styles: ['日式侘寂'], occasions: ['日常'],
    colors: ['混色'], mainFlowers: ['其他'], season: '秋',
  },
  {
    id: 'p020', url: u('1535083783855-aaafc1c5e511'), name: '留白',
    styles: ['日式侘寂', '现代简约'], occasions: ['日常'],
    colors: ['白色系', '混色'], mainFlowers: ['其他'], season: '冬',
  },
  {
    id: 'p021', url: u('1590502160462-58b41354f588'), name: '一枝独秀',
    styles: ['日式侘寂'], occasions: ['日常'],
    colors: ['混色'], mainFlowers: ['其他'], season: '冬',
  },
  {
    id: 'p022', url: u('1522335789203-aabd1fc54bc9'), name: '茅草幽香',
    styles: ['日式侘寂'], occasions: ['日常'],
    colors: ['混色'], mainFlowers: ['其他'], season: '秋',
  },

  // ── 复古典雅 · 红色系 / 紫色系 ──────────────────────────────────────────
  {
    id: 'p023', url: u('1566662169989-c3f71e89f3ec'), name: '复古玫瑰',
    styles: ['复古典雅'], occasions: ['爱情', '节日'],
    colors: ['红色系'], mainFlowers: ['玫瑰'], season: '四季',
  },
  {
    id: 'p024', url: u('1548388888-9b1c7a3c89c5'), name: '深红礼赞',
    styles: ['复古典雅'], occasions: ['爱情', '节日'],
    colors: ['红色系'], mainFlowers: ['玫瑰', '牡丹'], season: '四季',
  },
  {
    id: 'p025', url: u('1489549132488-d00b7eee2190'), name: '古典雅韵',
    styles: ['复古典雅'], occasions: ['节日', '日常'],
    colors: ['红色系', '紫色系'], mainFlowers: ['玫瑰'], season: '四季',
  },
  {
    id: 'p026', url: u('1543466835-00a7907e9de1'), name: '暗香浮动',
    styles: ['复古典雅'], occasions: ['爱情'],
    colors: ['紫色系', '红色系'], mainFlowers: ['玫瑰', '绣球'], season: '四季',
  },

  // ── 绣球专题 ─────────────────────────────────────────────────────────────
  {
    id: 'p027', url: u('1603313007690-3b2b3b3b3b3b'), name: '绣球盛放',
    styles: ['浪漫唯美'], occasions: ['友情', '节日'],
    colors: ['紫色系', '粉色系'], mainFlowers: ['绣球'], season: '夏',
  },
  {
    id: 'p028', url: u('1465146344425-f00d5f5c8f07'), name: '紫色梦境',
    styles: ['浪漫唯美', '复古典雅'], occasions: ['友情', '爱情'],
    colors: ['紫色系'], mainFlowers: ['绣球', '玫瑰'], season: '夏',
  },

  // ── 郁金香专题 ───────────────────────────────────────────────────────────
  {
    id: 'p029', url: u('1522338242992-17364c955c4b'), name: '荷兰春色',
    styles: ['浪漫唯美', '现代简约'], occasions: ['爱情', '节日'],
    colors: ['粉色系', '红色系'], mainFlowers: ['郁金香'], season: '春',
  },
  {
    id: 'p030', url: u('1555912289-dc33b50cbbd7'), name: '春之使者',
    styles: ['自然田园', '浪漫唯美'], occasions: ['友情', '日常'],
    colors: ['黄橙系', '混色'], mainFlowers: ['郁金香'], season: '春',
  },

  // ── 牡丹专题 ─────────────────────────────────────────────────────────────
  {
    id: 'p031', url: u('1497534446932-5f08e5fd4c43'), name: '国色天香',
    styles: ['浪漫唯美', '复古典雅'], occasions: ['节日', '爱情'],
    colors: ['粉色系', '白色系'], mainFlowers: ['牡丹'], season: '春',
  },
  {
    id: 'p032', url: u('1558618666-fcd25c85cd64'), name: '芍药华彩',
    styles: ['浪漫唯美'], occasions: ['爱情', '节日'],
    colors: ['粉色系'], mainFlowers: ['牡丹'], season: '春',
  },

  // ── 悼念 / 素净 ──────────────────────────────────────────────────────────
  {
    id: 'p033', url: u('1566958769-fe7b27571e8c'), name: '素白哀思',
    styles: ['现代简约', '日式侘寂'], occasions: ['悼念'],
    colors: ['白色系'], mainFlowers: ['其他'], season: '四季',
  },
  {
    id: 'p034', url: u('1487530811176-3780de880c2d'), name: '静默',
    styles: ['日式侘寂'], occasions: ['悼念'],
    colors: ['白色系', '混色'], mainFlowers: ['满天星'], season: '四季',
  },

  // ── 节日大束 ─────────────────────────────────────────────────────────────
  {
    id: 'p035', url: u('1561181286-d3f9a2a35d66'), name: '盛典花礼',
    styles: ['浪漫唯美', '复古典雅'], occasions: ['节日'],
    colors: ['红色系', '粉色系'], mainFlowers: ['玫瑰', '牡丹'], season: '四季',
  },
  {
    id: 'p036', url: u('1518531933037-91b2f5f229cc'), name: '节日缤纷',
    styles: ['自然田园'], occasions: ['节日', '友情'],
    colors: ['混色'], mainFlowers: ['向日葵', '雏菊'], season: '夏',
  },

  // ── 满天星专题 ───────────────────────────────────────────────────────────
  {
    id: 'p037', url: u('1496861083958-175bb2ede3e8'), name: '星河漫漫',
    styles: ['浪漫唯美', '现代简约'], occasions: ['友情', '爱情'],
    colors: ['白色系'], mainFlowers: ['满天星'], season: '四季',
  },

  // ── 黄橙系节日 ───────────────────────────────────────────────────────────
  {
    id: 'p038', url: u('1471086569351-87b9f4f0d7f8'), name: '阳光礼遇',
    styles: ['自然田园'], occasions: ['节日', '友情'],
    colors: ['黄橙系'], mainFlowers: ['向日葵', '其他'], season: '夏',
  },
  {
    id: 'p039', url: u('1469474968028-56623f02e42e'), name: '秋日暖阳',
    styles: ['自然田园', '复古典雅'], occasions: ['节日', '日常'],
    colors: ['黄橙系', '红色系'], mainFlowers: ['其他'], season: '秋',
  },

  // ── 混搭大束 ─────────────────────────────────────────────────────────────
  {
    id: 'p040', url: u('1558350861-dba7ee5b9e87'), name: '百花齐放',
    styles: ['自然田园', '浪漫唯美'], occasions: ['节日', '友情'],
    colors: ['混色'], mainFlowers: ['玫瑰', '雏菊', '满天星'], season: '春',
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
