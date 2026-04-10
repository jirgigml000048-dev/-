type HandlerEvent = { httpMethod: string; body: string | null };
type HandlerResponse = { statusCode: number; headers: Record<string, string>; body: string };

const HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

const BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

// Models tried in order; falls back on 429/503/404
// Gemini 3 series — restored from original working config
const MODELS = [
  'gemini-3-flash-preview',
  'gemini-3.1-flash-lite-preview',
  'gemini-flash-latest',
  'gemini-3.1-pro-preview',
];

async function generate(apiKey: string, model: string, contents: unknown[]): Promise<string> {
  const res = await fetch(`${BASE}/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents }),
  });
  if (!res.ok) {
    const text = await res.text();
    const err = new Error(text) as Error & { status: number };
    err.status = res.status;
    throw err;
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

async function callWithFallback(apiKey: string, contents: unknown[]): Promise<string> {
  let lastErr: unknown;
  for (const model of MODELS) {
    try {
      return await generate(apiKey, model, contents);
    } catch (err: unknown) {
      const status = (err as { status?: number }).status;
      if (status === 429 || status === 503 || status === 404) {
        lastErr = err;
        continue;
      }
      throw err;
    }
  }
  throw lastErr;
}

const SCHEMA = `{"title":"2-5字诗意名","style":"","occasion":"","size":"","flowers":[{"nameCN":"","nameLatin":"","quantity":3,"color":"","notes":"新手购买贴士","alternatives":["备选1","备选2"]}],"fillerGreenery":[""],"tools":[""],"tips":"100字内贴士"}`;

export async function handler(event: HandlerEvent): Promise<HandlerResponse> {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: HEADERS, body: '' };
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: HEADERS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = (process.env.GEMINI_API_KEY ?? '').trim();
  if (!apiKey) {
    return { statusCode: 500, headers: HEADERS, body: JSON.stringify({ error: 'GEMINI_API_KEY not configured on server' }) };
  }

  try {
    const body = JSON.parse(event.body ?? '{}');
    const { action } = body;

    // ── generate purchase list from style/occasion/size ──────────────────
    if (action === 'generate_list') {
      const { style, occasion, size } = body;
      const count = size === '小型' ? '3-4种，各2-3枝' : size === '中型' ? '5-6种，各3-5枝' : '7-9种，各5-8枝';
      const prompt = `插花顾问。生成${style}风格、${occasion}场合、${size}花束的购买清单（${count}）。起诗意中文名，备选花材1-2种，贴士面向新手。严格返回JSON：\n${SCHEMA}`;
      const text = await callWithFallback(apiKey, [{ parts: [{ text: prompt }] }]);
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error(`No JSON in response: ${text.slice(0, 200)}`);
      return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ result: JSON.parse(match[0]) }) };
    }

    // ── identify flowers from uploaded image ──────────────────────────────
    if (action === 'identify_flowers') {
      const { base64, mimeType } = body;
      const prompt = `专业花艺师。分析花束照片，识别所有花卉品种（注意区分：玫瑰/芍药/牡丹、绣球/洋桔梗、雏菊/矢车菊），估算枝数比例，每种花提供1-2个备选。起诗意中文名，说明面向新手。严格返回JSON：\n${SCHEMA}`;
      const text = await callWithFallback(apiKey, [{
        parts: [{ text: prompt }, { inlineData: { mimeType, data: base64 } }],
      }]);
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error(`No JSON in response: ${text.slice(0, 200)}`);
      return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ result: JSON.parse(match[0]) }) };
    }

    // ── annotate flower positions with bounding boxes ─────────────────────
    if (action === 'annotate_flowers') {
      const { base64, mimeType, flowerNames } = body;
      const focus = Array.isArray(flowerNames) && flowerNames.length > 0
        ? `只标注以下花卉（每种最多一个框，不重复）：${flowerNames.join('、')}。`
        : '识别图中每种花卉/植物。';
      const prompt = `${focus}每种一个框，label用简短中文花名。box_2d格式[y_min,x_min,y_max,x_max]范围0-1000。只返回JSON数组：[{"label":"花名","box_2d":[y1,x1,y2,x2]}]`;
      const text = await callWithFallback(apiKey, [{
        parts: [{ text: prompt }, { inlineData: { mimeType, data: base64 } }],
      }]);
      const match = text.match(/\[[\s\S]*\]/);
      if (!match) throw new Error(`No JSON array in response: ${text.slice(0, 200)}`);
      return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ result: JSON.parse(match[0]) }) };
    }

    return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ error: `Unknown action: ${action}` }) };

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { statusCode: 500, headers: HEADERS, body: JSON.stringify({ error: msg }) };
  }
}
