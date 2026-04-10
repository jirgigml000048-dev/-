# Plant Instinct — Agent Knowledge Document

> Structured reference for agents helping build similar AI-powered mobile web apps.
> Schema inspired by vibe-retrospect knowledge format.

---

## Project Identity

```yaml
name: Plant Instinct (植觉)
type: AI-powered mobile web app (花艺助手)
url: https://plantinstinct.netlify.app
repo: jirgigml000048-dev/-
stack: React 19 + TypeScript + Vite 6 + Tailwind CSS + Gemini API + Supabase + Netlify
target_users: Chinese flower arrangement hobbyists
primary_language: Chinese (中文), bilingual UI
```

---

## Architecture

### State Machine (No Router)
The app uses a flat state machine in `App.tsx` instead of react-router.
Two flows share the same `PurchaseList` component:

```
activeTab='style'   + styleStep='select'    → StyleSelector
activeTab='style'   + styleStep='gallery'   → BouquetGallery
activeTab='style'   + styleStep='purchase'  → PurchaseList
activeTab='identify'+ identifyStep='upload' → PhotoUpload
activeTab='identify'+ identifyStep='result' → PurchaseList
activeTab='lists'   + purchaseList!=null    → PurchaseList
activeTab='home'                            → HomeScreen
```

### API Proxy Pattern
All AI calls go through a Netlify serverless function to bypass China firewall:
```
Browser → /.netlify/functions/gemini → generativelanguage.googleapis.com
```
The function uses raw `fetch` (not @google/genai SDK) against the REST API.
**Critical**: REST API uses camelCase (`inlineData`, `mimeType`), NOT snake_case.

### Caching Layer
Supabase `photo_cache` table stores AI results per photo ID.
Cache-hit path: no AI call, instant response.
Cache-miss path: AI call → store result → return.
RLS policies allow anonymous read + insert (no auth required).

---

## Key Data Types

```typescript
interface PurchaseList {
  title: string;          // 2-5 char poetic Chinese name
  style: FlowerStyle;
  occasion: FlowerOccasion;
  size: BouquetSize;
  flowers: FlowerItem[];
  fillerGreenery: string[];
  tools: string[];
  tips: string;
}

interface FlowerItem {
  nameCN: string;
  nameLatin: string;
  quantity: number;
  color: string;
  notes: string;          // beginner buying tips
  alternatives: string[]; // 1-2 substitute flowers
}

interface PhotoEntry {
  id: string;             // 'p001' to 'p086'
  url: string;            // '/images/*.jpg' or '/image/*.jpg'
  name: string;
  styles: FlowerStyle[];
  occasions: FlowerOccasion[];
  colors: FlowerColor[];
  mainFlowers: MainFlower[];
  season: FlowerSeason;
}

interface SharePayload {
  purchaseList: PurchaseList;
  heroImageUrl?: string;  // only non-base64 URLs; omit for uploaded images
}
```

---

## Critical Implementation Rules

### Export Image (Canvas 2D)
**NEVER use html-to-image for local images.** It fails silently with CORS errors.
Use Canvas 2D (`buildExportImage.ts`):
1. Pre-load image as base64 via `fetch` + `FileReader.readAsDataURL`
2. Draw everything manually: `drawImageCover()` for aspect-ratio-safe rendering
3. Render annotations with same algorithm as SVG overlay

### Flower Annotation Algorithm
Both SVG overlay (page view) and Canvas (export) MUST use identical logic:
```typescript
// Push label to edge, not toward flower center
const toLeft = (x1 + x2) / 2 < 500;
const lx = toLeft ? 0.1 * imageWidth : 0.9 * imageWidth;

// Collision avoidance: sort same-side labels by Y, push apart
const MIN_GAP = 0.054 * imageHeight;  // same in both SVG (54/1000) and Canvas
```

### Share Link Encoding
Encode `SharePayload`, NOT raw `PurchaseList`:
```typescript
const payload: SharePayload = {
  purchaseList,
  ...(heroImageUrl && !heroImageUrl.startsWith('data:') ? { heroImageUrl } : {}),
};
encodeShare(payload);  // base64url encode
```
On decode: `payload.purchaseList ?? (payload as PurchaseList)` for backward compat.

### Netlify Environment Variables
When using Netlify Functions, environment variables need **Functions scope**,
not just **Build scope**. Trim API keys to guard against whitespace:
```typescript
const apiKey = (process.env.GEMINI_API_KEY ?? '').trim();
```

---

## Common Failure Modes

| Symptom | Cause | Fix |
|---------|-------|-----|
| Export image is blank | html-to-image + local images | Use Canvas 2D with base64 pre-loading |
| Annotation labels overlap | Labels pushed toward center (cx ± 70px) | Push to image edges (10% / 90%) with collision avoidance |
| Share link has no hero image | SharePayload not encoded, only PurchaseList | Include heroImageUrl in SharePayload |
| API returns "The string did not match" | @google/genai SDK Node.js validation | Replace SDK with raw fetch to REST API |
| REST API returns 400 for vision requests | Wrong field names (inline_data vs inlineData) | Use camelCase: `inlineData`, `mimeType` |
| Functions can't read env var | Env var scope is Build-only | Add Functions scope in Netlify dashboard |
| Models return 404 after "upgrading" | Replaced working preview models with deprecated stable ones | Don't change working model names without testing |

---

## Gemini API Integration

### Netlify Function Endpoint
```
POST /.netlify/functions/gemini
Content-Type: application/json

Body: { action, ...params }
Actions: 'generate_list' | 'identify_flowers' | 'annotate_flowers'
```

### Model Fallback Chain
```typescript
const MODELS = [
  'gemini-3-flash-preview',       // primary
  'gemini-3.1-flash-lite-preview',
  'gemini-flash-latest',
  'gemini-3.1-pro-preview',       // last resort
];
// Retry on HTTP 429 | 503 | 404
```

### Vision Request Format (REST API)
```json
{
  "contents": [{
    "parts": [
      { "text": "your prompt" },
      { "inlineData": { "mimeType": "image/jpeg", "data": "base64..." } }
    ]
  }]
}
```

### Annotation Prompt
```
只标注以下花卉（每种最多一个框，不重复）：{flowerNames}。
每种一个框，label用简短中文花名。
box_2d格式[y_min,x_min,y_max,x_max]范围0-1000。
只返回JSON数组：[{"label":"花名","box_2d":[y1,x1,y2,x2]}]
```

---

## Supabase Setup

```sql
CREATE TABLE public.photo_cache (
  photo_id      TEXT        PRIMARY KEY,
  purchase_list JSONB       NOT NULL,
  annotations   JSONB       NOT NULL DEFAULT '[]',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.photo_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_select" ON public.photo_cache FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert" ON public.photo_cache FOR INSERT TO anon WITH CHECK (true);
```

Environment variables needed: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

---

## Build Configuration

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[functions]
  node_bundler = "esbuild"
```

```typescript
// vite.config.ts — no API key injection needed (key is server-side)
export default defineConfig(() => ({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, '.') } }
}));
```

---

## Design System

```
Primary: #172f28 (deep forest green)
Surface: #fbf9f4 (warm white)
Secondary: #546252 (muted green)
Font Headline: Noto Serif SC (Chinese serif for titles)
Font Body/Label: Manrope (clean Latin for metadata)
Icons: Material Symbols Outlined
Border radius: 2xl (16px) for cards, full for chips
```

### Bilingual Typography Rule
Chinese content: headline serif, large, prominent
English content: label font, small caps, tracking-[0.2em], opacity-50
Pattern: `<h2 class="font-headline">标题</h2><span class="font-label text-[10px] uppercase tracking-[0.2em] opacity-50">SUBTITLE</span>`

---

## What Worked Well

1. **State machine without router** — Simple, no URL management complexity for a single-page tool
2. **Supabase cache** — Eliminates 90%+ of AI API costs once library photos are warmed up
3. **Netlify Functions as thin proxy** — Keeps API key server-side, solves China firewall, easy to debug
4. **Canvas 2D for export** — More reliable than DOM-capture libraries for complex layouts
5. **base64url share links** — Works without backend storage, shareable immediately

## What To Improve

1. **Shared annotation algorithm** — SVG and Canvas versions should import from one function
2. **Image compression before upload** — Large photos may hit Netlify's 1MB function body limit
3. **Error boundary** — A single try/catch in App.tsx catches everything; finer-grained error states would improve UX
4. **Progressive loading** — The photo gallery loads all 86 images; virtual scrolling would help on slow connections

---

*Generated: 2026-04-10*  
*Plant Instinct · 植觉 — Botanical Intelligence*
