import { FlowerStyle } from '../types';

// Curated Unsplash photo IDs per style
// Format: https://images.unsplash.com/photo-{ID}?w=600&fit=crop&auto=format
export const BOUQUET_PHOTO_IDS: Record<FlowerStyle, string[]> = {
  '现代简约': [
    '1566958769-fe7b27571e8c', // white minimal bouquet
    '1487530811176-3780de880c2d', // simple white flowers
    '1490750967868-88df5691cc6e', // minimalist anemones
    '1599598425947-5202edd56bdb', // clean white roses
    '1508610048763-aaad56b35657', // single stem minimal
    '1491895200222-0fc4a4c35e18', // white lily arrangement
  ],
  '浪漫唯美': [
    '1518531933037-91b2f5f229cc', // pink peonies romantic
    '1561181286-d3f9a2a35d66', // blush roses bouquet
    '1565618754664-accc8ae3d46b', // pink flower arrangement
    '1491404866317-f9e2e1c8d0b8', // soft pink romantic
    '1496861083958-175bb2ede3e8', // pastel bouquet
    '1487530811176-3780de880c2d', // dreamy florals
  ],
  '自然田园': [
    '1468929823679-4b5ebb4d9a5f', // wildflower meadow
    '1490750967868-88df5691cc6e', // daisy field flowers
    '1471086569351-87b9f4f0d7f8', // sunflower bouquet
    '1469474968028-56623f02e42e', // countryside flowers
    '1497366216548-37526070297c', // natural wildflowers
    '1558350861-dba7ee5b9e87', // garden fresh
  ],
  '日式侘寂': [
    '1508184964240-ee96bb9677a9', // wabi-sabi dried
    '1516912481800-e2e071c17e3d', // zen arrangement
    '1535083783855-aaafc1c5e511', // japanese ikebana style
    '1590502160462-58b41354f588', // minimal branch
    '1522335789203-aabd1fc54bc9', // dried grass wabi
    '1478827536114-da961b7f86d2', // austere flowers
  ],
  '复古典雅': [
    '1561181286-d3f9a2a35d66', // vintage rose bouquet
    '1566662169989-c3f71e89f3ec', // antique floral
    '1548388888-9b1c7a3c89c5', // deep red vintage
    '1489549132488-d00b7eee2190', // classic elegant roses
    '1543466835-00a7907e9de1', // burgundy bouquet
    '1487530811176-3780de880c2d', // vintage dark florals
  ],
};

// Today's featured bouquet for HomeScreen
export const FEATURED_BOUQUET_ID = '1518531933037-91b2f5f229cc';

// Sample bouquets for HomeScreen collections
export const COLLECTION_ITEMS = [
  {
    id: '1468929823679-4b5ebb4d9a5f',
    title: '极简主义',
    subtitle: '适合现代居家的低维护花束清单',
    style: '现代简约' as FlowerStyle,
  },
  {
    id: '1508184964240-ee96bb9677a9',
    title: '侘寂美学',
    subtitle: '探寻枯荣之间的禅意之美',
    style: '日式侘寂' as FlowerStyle,
  },
];

// Sample thumbnails for PhotoUpload page
export const SAMPLE_PHOTO_IDS = [
  '1471086569351-87b9f4f0d7f8',
  '1518531933037-91b2f5f229cc',
  '1468929823679-4b5ebb4d9a5f',
];

export function getUnsplashUrl(id: string, w = 600): string {
  return `https://images.unsplash.com/photo-${id}?w=${w}&fit=crop&auto=format`;
}

export function getRandomPhotos(style: FlowerStyle, count = 4): string[] {
  const ids = [...BOUQUET_PHOTO_IDS[style]];
  // Fisher-Yates shuffle
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids.slice(0, count).map(id => getUnsplashUrl(id));
}
