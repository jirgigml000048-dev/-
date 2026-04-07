import { GoogleGenAI } from "@google/genai";
import { FlowerStyle, FlowerOccasion, BouquetSize, PurchaseList } from "../types";

function getClient(): GoogleGenAI {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key missing");
  return new GoogleGenAI({ apiKey });
}

const PURCHASE_LIST_SCHEMA = `{
  "title": "诗意的清单名称（2-5个字）",
  "style": "风格名称",
  "occasion": "场合名称",
  "size": "大小",
  "flowers": [
    {
      "nameCN": "中文花名",
      "nameLatin": "英文/拉丁名",
      "quantity": 5,
      "color": "建议颜色",
      "notes": "购买小贴士，面向新手，通俗易懂"
    }
  ],
  "fillerGreenery": ["绿植1", "绿植2"],
  "tools": ["工具1", "工具2"],
  "tips": "整体搭配贴士，100字以内，亲切通俗"
}`;

export async function generateBouquetRecommendation(
  style: FlowerStyle,
  occasion: FlowerOccasion,
  size: BouquetSize
): Promise<PurchaseList> {
  const ai = getClient();

  const flowerCount = size === '小型' ? '3-5种' : size === '中型' ? '5-7种' : '8-10种';
  const stemCount = size === '小型' ? '每种2-3枝' : size === '中型' ? '每种3-5枝' : '每种5-8枝';

  const prompt = `你是一位亲切的插花顾问，专门帮助插花爱好者自制花束。

请根据以下要求，生成一份花束购买清单：
- 风格：${style}
- 场合：${occasion}
- 花束大小：${size}（花材${flowerCount}，${stemCount}）

要求：
1. 给这份清单起一个诗意的中文名（2-5个字，如"晨间森林"、"初夏微风"）
2. 花材说明要通俗易懂，侧重"在花市怎么挑/选什么颜色"
3. 绿植填充建议2-3种
4. 工具建议包括花剪、花瓶、保鲜液等日常易得的工具
5. 整体贴士要简短亲切，适合新手

请严格按以下JSON格式返回（不要有任何其他文字）：
${PURCHASE_LIST_SCHEMA}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  });

  const text = response.text ?? '';
  // Extract JSON from response
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error(`Gemini returned no JSON. Raw: ${text.slice(0, 200)}`);
  return JSON.parse(match[0]) as PurchaseList;
}

export async function identifyFlowersFromImage(
  base64: string,
  mimeType: string
): Promise<PurchaseList> {
  const ai = getClient();

  const prompt = `你是一位专业的插花顾问。请仔细分析这张花束照片，然后生成一份购买清单，帮助用户复制这款花束。

分析要点：
1. 识别图中所有花卉品种（尽可能精确）
2. 估算各花材的数量和比例
3. 识别填充绿植
4. 判断整体风格

给清单起一个诗意的中文名。说明要面向插花新手，通俗易懂。

请严格按以下JSON格式返回（不要有任何其他文字）：
${PURCHASE_LIST_SCHEMA}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [
      {
        role: 'user',
        parts: [
          { text: prompt },
          { inlineData: { mimeType, data: base64 } },
        ],
      },
    ],
  });

  const text = response.text ?? '';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error(`Gemini returned no JSON. Raw: ${text.slice(0, 200)}`);
  return JSON.parse(match[0]) as PurchaseList;
}
