import { GoogleGenAI } from "@google/genai";
import { FlowerStyle, FlowerOccasion, BouquetSize, PurchaseList, FlowerAnnotation } from "../types";

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
      "notes": "购买小贴士，面向新手，通俗易懂",
      "alternatives": ["备选花材1（外形相似或气质相近）", "备选花材2"]
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
    model: 'gemini-3-flash-preview',
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

  const prompt = `你是一位专业的花艺师，擅长精准识别花卉品种。请仔细分析这张花束照片，生成一份完整的复刻购买清单。

【识花要求】
- 逐朵仔细观察：花瓣形状（单瓣/重瓣/球形）、花瓣质感（丝绒/纸质/蜡质）、花芯特征、叶型
- 区分相似品种：如玫瑰 vs 牡丹 vs 芍药、绣球 vs 洋桔梗、雏菊 vs 万寿菊 vs 矢车菊
- 如有把握不足，优先给出最可能的品种，在 notes 里说明不确定性
- 估算每种花的枝数比例

【备选要求】
每种主花都要提供 1-2 种备选（当季买不到主花时的替代方案，选外形相近或气质相似的品种）

给清单起一个诗意的中文名（2-5字）。说明面向新手，通俗易懂。

请严格按以下JSON格式返回（不要有任何其他文字）：
${PURCHASE_LIST_SCHEMA}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
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

export async function annotateFlowersInImage(
  base64: string,
  mimeType: string
): Promise<FlowerAnnotation[]> {
  const ai = getClient();

  const prompt = `请识别图中每一种花卉/植物，并返回它们在图中的位置。

要求：
- 每种花卉标注一个框（选该花最具代表性的位置）
- label 用中文花名（简短，如"玫瑰"、"绣球"、"满天星"）
- box_2d 格式：[y_min, x_min, y_max, x_max]，范围 0-1000（图片左上角为原点）

只返回 JSON 数组，不要有任何其他文字：
[{"label": "花名", "box_2d": [y_min, x_min, y_max, x_max]}, ...]`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
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
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error(`Annotation returned no JSON. Raw: ${text.slice(0, 200)}`);
  return JSON.parse(match[0]) as FlowerAnnotation[];
}
