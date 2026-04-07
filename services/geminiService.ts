import { GoogleGenAI } from "@google/genai";
import { FlowerStyle, FlowerOccasion, BouquetSize, PurchaseList, FlowerAnnotation } from "../types";

function getClient(): GoogleGenAI {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key missing");
  return new GoogleGenAI({ apiKey });
}

const PURCHASE_LIST_SCHEMA = `{"title":"2-5字诗意名","style":"","occasion":"","size":"","flowers":[{"nameCN":"","nameLatin":"","quantity":3,"color":"","notes":"新手购买贴士","alternatives":["备选1","备选2"]}],"fillerGreenery":[""],"tools":[""],"tips":"100字内贴士"}`;

export async function generateBouquetRecommendation(
  style: FlowerStyle,
  occasion: FlowerOccasion,
  size: BouquetSize
): Promise<PurchaseList> {
  const ai = getClient();
  const count = size === '小型' ? '3-4种，各2-3枝' : size === '中型' ? '5-6种，各3-5枝' : '7-9种，各5-8枝';
  const prompt = `插花顾问。生成${style}风格、${occasion}场合、${size}花束的购买清单（${count}）。起诗意中文名，备选花材1-2种，贴士面向新手。严格返回JSON：\n${PURCHASE_LIST_SCHEMA}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  const text = response.text ?? '';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error(`No JSON. Raw: ${text.slice(0, 200)}`);
  return JSON.parse(match[0]) as PurchaseList;
}

export async function identifyFlowersFromImage(
  base64: string,
  mimeType: string
): Promise<PurchaseList> {
  const ai = getClient();
  const prompt = `专业花艺师。分析花束照片，识别所有花卉品种（注意区分：玫瑰/芍药/牡丹、绣球/洋桔梗、雏菊/矢车菊），估算枝数比例，每种花提供1-2个备选。起诗意中文名，说明面向新手。严格返回JSON：\n${PURCHASE_LIST_SCHEMA}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ role: 'user', parts: [{ text: prompt }, { inlineData: { mimeType, data: base64 } }] }],
  });
  const text = response.text ?? '';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error(`No JSON. Raw: ${text.slice(0, 200)}`);
  return JSON.parse(match[0]) as PurchaseList;
}

export async function annotateFlowersInImage(
  base64: string,
  mimeType: string
): Promise<FlowerAnnotation[]> {
  const ai = getClient();
  const prompt = `识别图中每种花卉/植物的位置，每种一个框。label用简短中文花名。box_2d格式[y_min,x_min,y_max,x_max]范围0-1000。只返回JSON数组：[{"label":"花名","box_2d":[y1,x1,y2,x2]}]`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ role: 'user', parts: [{ text: prompt }, { inlineData: { mimeType, data: base64 } }] }],
  });
  const text = response.text ?? '';
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error(`No JSON. Raw: ${text.slice(0, 200)}`);
  return JSON.parse(match[0]) as FlowerAnnotation[];
}
