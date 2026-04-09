import { FlowerStyle, FlowerOccasion, BouquetSize, PurchaseList, FlowerAnnotation } from "../types";

async function callFunction(body: Record<string, unknown>): Promise<unknown> {
  const response = await fetch('/.netlify/functions/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok || data.error) throw new Error(data.error ?? `HTTP ${response.status}`);
  return data.result;
}

export async function generateBouquetRecommendation(
  style: FlowerStyle,
  occasion: FlowerOccasion,
  size: BouquetSize
): Promise<PurchaseList> {
  return callFunction({ action: 'generate_list', style, occasion, size }) as Promise<PurchaseList>;
}

export async function identifyFlowersFromImage(
  base64: string,
  mimeType: string
): Promise<PurchaseList> {
  return callFunction({ action: 'identify_flowers', base64, mimeType }) as Promise<PurchaseList>;
}

export async function annotateFlowersInImage(
  base64: string,
  mimeType: string,
  flowerNames?: string[]
): Promise<FlowerAnnotation[]> {
  return callFunction({ action: 'annotate_flowers', base64, mimeType, flowerNames }) as Promise<FlowerAnnotation[]>;
}
