export type FlowerStyle = '现代简约' | '浪漫唯美' | '自然田园' | '日式侘寂' | '复古典雅';
export type FlowerOccasion = '爱情' | '友情' | '节日' | '日常' | '悼念';
export type BouquetSize = '小型' | '中型' | '大型';
export type FlowerColor = '白色系' | '粉色系' | '红色系' | '紫色系' | '黄橙系' | '混色';
export type MainFlower = '玫瑰' | '牡丹' | '向日葵' | '绣球' | '郁金香' | '雏菊' | '满天星' | '其他';
export type FlowerSeason = '春' | '夏' | '秋' | '冬' | '四季';

export interface PhotoEntry {
  id: string;                   // 唯一标识，如 'p001'
  url: string;                  // 任意图片 URL（Unsplash / 自定义图床 / /public/images/...）
  name: string;                 // 花束名称，显示在 gallery 卡片
  styles: FlowerStyle[];
  occasions: FlowerOccasion[];
  colors: FlowerColor[];
  mainFlowers: MainFlower[];
  season: FlowerSeason;
}

export interface FlowerItem {
  nameCN: string;
  nameLatin: string;
  quantity: number;
  color: string;
  notes: string;
  alternatives?: string[]; // 备选花材，当主花买不到时
}

export interface FlowerAnnotation {
  label: string;        // 花名
  box_2d: [number, number, number, number]; // [y_min, x_min, y_max, x_max]，0-1000 归一化
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
  color?: FlowerColor;
  mainFlower?: MainFlower;
  season?: FlowerSeason;
}

export interface UploadedImage {
  base64: string;
  mimeType: string;
  previewUrl: string;
}
