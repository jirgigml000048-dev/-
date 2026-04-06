export type FlowerStyle = '现代简约' | '浪漫唯美' | '自然田园' | '日式侘寂' | '复古典雅';
export type FlowerOccasion = '爱情' | '友情' | '节日' | '日常' | '悼念';
export type BouquetSize = '小型' | '中型' | '大型';

export interface FlowerItem {
  nameCN: string;
  nameLatin: string;
  quantity: number;
  color: string;
  notes: string;
}

export interface PurchaseList {
  title: string;
  style: FlowerStyle | string;
  occasion: FlowerOccasion | string;
  size: BouquetSize | string;
  flowers: FlowerItem[];
  fillerGreenery: string[];
  tools: string[];
  tips: string;
}

export type ActiveTab = 'home' | 'style' | 'identify' | 'lists';
export type StyleFlowStep = 'select' | 'gallery' | 'purchase';
export type IdentifyFlowStep = 'upload' | 'result';

export interface StyleSelections {
  style: FlowerStyle;
  occasion: FlowerOccasion;
  size: BouquetSize;
}

export interface UploadedImage {
  base64: string;
  mimeType: string;
  previewUrl: string;
}
