import { PurchaseList, FlowerAnnotation } from '../types';

const PALETTE = [
  '#F9A8D4', '#93C5FD', '#86EFAC', '#FCD34D',
  '#C4B5FD', '#6EE7B7', '#FCA5A5', '#A5F3FC',
];

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload  = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function rrect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Wrap Chinese/English mixed text to fit maxWidth
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const chars = Array.from(text);
  const lines: string[] = [];
  let line = '';
  for (const ch of chars) {
    const test = line + ch;
    if (ctx.measureText(test).width > maxW && line.length > 0) {
      lines.push(line);
      line = ch;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawAnnotations(
  ctx: CanvasRenderingContext2D,
  annotations: FlowerAnnotation[],
  imgX: number, imgY: number, imgW: number, imgH: number,
) {
  annotations.forEach((ann, i) => {
    const [y1, x1, y2, x2] = ann.box_2d;
    const cx = imgX + ((x1 + x2) / 2 / 1000) * imgW;
    const cy = imgY + ((y1 + y2) / 2 / 1000) * imgH;
    const color = PALETTE[i % PALETTE.length];

    const toRight  = (x1 + x2) / 2 < 500;
    const toBottom = (y1 + y2) / 2 < 500;
    const lx = cx + (toRight ? 70 : -70);
    const ly = cy + (toBottom ? 36 : -36);

    // Glow
    ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fillStyle = color + '44'; ctx.fill();

    // Dot
    ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = color; ctx.fill();

    // White core
    ctx.beginPath(); ctx.arc(cx, cy, 2, 0, Math.PI * 2);
    ctx.fillStyle = 'white'; ctx.fill();

    // Dashed line
    ctx.save();
    ctx.setLineDash([3, 2]);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(lx, ly);
    ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.restore();

    // Label pill
    ctx.font = 'bold 10px "PingFang SC","Noto Sans SC",sans-serif';
    const tw = ctx.measureText(ann.label).width;
    const pillW = tw + 16;
    const pillX = toRight ? lx - 4 : lx - pillW + 4;

    rrect(ctx, pillX, ly - 10, pillW, 20, 10);
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fill();
    ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.stroke();

    ctx.fillStyle = color; ctx.textAlign = 'center';
    ctx.fillText(ann.label, pillX + pillW / 2, ly + 4);
    ctx.textAlign = 'left';
  });
}

export async function buildExportImage(
  heroDataUrl: string,
  purchaseList: PurchaseList,
  annotations?: FlowerAnnotation[],
): Promise<string> {
  await document.fonts.ready;

  const SCALE  = 3;
  const W      = 390;
  const PH     = 36;          // horizontal padding
  const PT     = 48;          // top padding
  const PB     = 44;          // bottom padding
  const CW     = W - PH * 2;  // content width = 318
  const IMG_W  = CW;
  const IMG_H  = Math.round(IMG_W * 4 / 3); // 424

  // Shared fonts
  const FONT_BRAND   = 'italic bold 34px "Noto Serif SC","SimSun",serif';
  const FONT_TITLE   = 'bold 20px "Noto Serif SC","SimSun",serif';
  const FONT_FLOWER  = 'bold 14px "Noto Serif SC","SimSun",serif';
  const FONT_LATIN   = 'italic 10px sans-serif';
  const FONT_NOTES   = '11px sans-serif';
  const FONT_TAGS    = '11px sans-serif';
  const FONT_SMALL   = '10px sans-serif';
  const FONT_FOOTER  = 'italic 11px "Noto Serif SC",serif';
  const FONT_SECTION = 'bold 11px sans-serif';

  const LINE_NOTES = 15;
  const flowers    = purchaseList.flowers || [];
  const greenery   = purchaseList.fillerGreenery || [];
  const tools      = purchaseList.tools || [];
  const tips       = purchaseList.tips || '';

  // ── Measure-only pass (no drawing) to compute total height ──────────────────
  const mc = document.createElement('canvas');
  mc.width = W; mc.height = 1;
  const mctx = mc.getContext('2d')!;

  // Tip lines
  mctx.font = FONT_NOTES;
  const tipLines = tips ? wrapText(mctx, tips, CW) : [];

  // Per-flower note lines
  const flowerNoteLinesArr = flowers.map(f => {
    if (!f.notes) return [] as string[];
    mctx.font = FONT_NOTES;
    return wrapText(mctx, f.notes, CW - 14);
  });

  // height of one flower block
  function flowerBlockH(i: number) {
    let h = 22; // name + qty
    h += 15;    // latin
    h += flowerNoteLinesArr[i].length * LINE_NOTES;
    return h;
  }
  const totalFlowerH = flowers.reduce((s, _, i) => s + flowerBlockH(i) + (i < flowers.length - 1 ? 12 : 0), 0);

  // support section (greenery + tools)
  const hasSupport = greenery.length > 0 || tools.length > 0;

  // Total height
  const TOTAL_H = PT
    + 14 + 6 + 42 + 4 + 14 + 30  // brand block ≈ 110
    + IMG_H
    + 28
    + 26 + 8 + 16 + 24            // title + tags + gap
    + (tipLines.length ? tipLines.length * LINE_NOTES + 8 + 20 : 0)
    + (flowers.length ? 14 + 16 + totalFlowerH + 24 : 0)
    + (hasSupport ? 14 + 16 + 24 + 24 : 0)
    + 1 + 24                      // divider + footer
    + PB;

  // ── Create final canvas ───────────────────────────────────────────────────────
  const canvas  = document.createElement('canvas');
  canvas.width  = W * SCALE;
  canvas.height = TOTAL_H * SCALE;
  const ctx     = canvas.getContext('2d')!;
  ctx.scale(SCALE, SCALE);

  // Background
  ctx.fillStyle = '#FDFCF7';
  ctx.fillRect(0, 0, W, TOTAL_H);

  let y = PT;

  // ── Brand ────────────────────────────────────────────────────────────────────
  ctx.font = FONT_SMALL; ctx.fillStyle = '#9CA3AF';
  ctx.fillText('Botanical Intelligence', PH, y + 10);
  y += 14 + 6;

  ctx.font = FONT_BRAND; ctx.fillStyle = '#172f28';
  ctx.fillText('植觉', PH, y + 36);
  y += 42 + 4;

  ctx.font = FONT_SMALL; ctx.fillStyle = '#9CA3AF';
  ctx.fillText('Plant Instinct', PH, y + 11);
  y += 14 + 30;

  // ── Hero image ───────────────────────────────────────────────────────────────
  const imgY = y;
  const heroImg = await loadImage(heroDataUrl);

  ctx.save();
  rrect(ctx, PH, imgY, IMG_W, IMG_H, 14);
  ctx.clip();
  ctx.drawImage(heroImg, PH, imgY, IMG_W, IMG_H);

  const grad = ctx.createLinearGradient(0, imgY, 0, imgY + IMG_H);
  grad.addColorStop(0.55, 'rgba(0,0,0,0)');
  grad.addColorStop(1,    'rgba(0,0,0,0.28)');
  ctx.fillStyle = grad; ctx.fillRect(PH, imgY, IMG_W, IMG_H);
  ctx.restore();

  if (annotations?.length) {
    ctx.save();
    rrect(ctx, PH, imgY, IMG_W, IMG_H, 14); ctx.clip();
    drawAnnotations(ctx, annotations, PH, imgY, IMG_W, IMG_H);
    ctx.restore();
  }
  y += IMG_H + 28;

  // ── Title ────────────────────────────────────────────────────────────────────
  ctx.font = FONT_TITLE; ctx.fillStyle = '#172f28';
  ctx.fillText(purchaseList.title || '专属花束清单', PH, y + 20);
  y += 26 + 8;

  ctx.font = FONT_TAGS; ctx.fillStyle = '#9CA3AF';
  ctx.fillText(`${purchaseList.style} · ${purchaseList.occasion} · ${purchaseList.size}`, PH, y + 11);
  y += 16 + 24;

  // ── Tips ─────────────────────────────────────────────────────────────────────
  if (tipLines.length) {
    ctx.font = 'italic 11px "Noto Serif SC",serif'; ctx.fillStyle = '#6B7280';
    tipLines.forEach(line => {
      ctx.fillText(`「${line}」`, PH, y + 11);
      y += LINE_NOTES;
    });
    y += 8 + 20;
  }

  // ── Flower list ───────────────────────────────────────────────────────────────
  if (flowers.length) {
    // Section label
    ctx.font = FONT_SECTION; ctx.fillStyle = '#9CA3AF';
    ctx.fillText('花 材 清 单', PH, y + 11);
    y += 14;

    // Thin rule
    ctx.beginPath(); ctx.moveTo(PH, y + 4); ctx.lineTo(W - PH, y + 4);
    ctx.strokeStyle = 'rgba(23,47,40,0.1)'; ctx.lineWidth = 1; ctx.stroke();
    y += 16;

    flowers.forEach((f, i) => {
      const color = PALETTE[i % PALETTE.length];

      // Colored dot
      ctx.beginPath(); ctx.arc(PH + 5, y + 8, 3, 0, Math.PI * 2);
      ctx.fillStyle = color; ctx.fill();

      // Flower name + color
      ctx.font = FONT_FLOWER; ctx.fillStyle = '#172f28';
      const nameText = f.color ? `${f.nameCN}  ${f.color}` : f.nameCN;
      ctx.fillText(nameText, PH + 14, y + 14);

      // Quantity (right-aligned)
      ctx.font = FONT_TAGS; ctx.fillStyle = '#9CA3AF';
      ctx.textAlign = 'right';
      ctx.fillText(`×${f.quantity}`, W - PH, y + 14);
      ctx.textAlign = 'left';
      y += 22;

      // Latin name
      if (f.nameLatin) {
        ctx.font = FONT_LATIN; ctx.fillStyle = '#9CA3AF';
        ctx.fillText(f.nameLatin, PH + 14, y + 10);
        y += 15;
      }

      // Notes (wrapped)
      if (flowerNoteLinesArr[i].length) {
        ctx.font = FONT_NOTES; ctx.fillStyle = '#6B7280';
        flowerNoteLinesArr[i].forEach(line => {
          ctx.fillText(line, PH + 14, y + 11);
          y += LINE_NOTES;
        });
      }

      if (i < flowers.length - 1) y += 12; // gap between flowers
    });
    y += 24;
  }

  // ── Greenery + Tools ─────────────────────────────────────────────────────────
  if (hasSupport) {
    ctx.font = FONT_SECTION; ctx.fillStyle = '#9CA3AF';
    ctx.fillText('配草 & 工具', PH, y + 11);
    y += 14;

    ctx.beginPath(); ctx.moveTo(PH, y + 4); ctx.lineTo(W - PH, y + 4);
    ctx.strokeStyle = 'rgba(23,47,40,0.1)'; ctx.lineWidth = 1; ctx.stroke();
    y += 16;

    if (greenery.length) {
      ctx.font = FONT_SMALL; ctx.fillStyle = '#9CA3AF';
      ctx.fillText('配草', PH, y + 10);
      ctx.font = FONT_NOTES; ctx.fillStyle = '#172f28';
      ctx.fillText(greenery.join('、'), PH + 32, y + 10);
      y += 20;
    }
    if (tools.length) {
      ctx.font = FONT_SMALL; ctx.fillStyle = '#9CA3AF';
      ctx.fillText('工具', PH, y + 10);
      ctx.font = FONT_NOTES; ctx.fillStyle = '#172f28';
      ctx.fillText(tools.join('、'), PH + 32, y + 10);
      y += 20;
    }
    y += 24;
  }

  // ── Divider + Footer ─────────────────────────────────────────────────────────
  ctx.beginPath(); ctx.moveTo(PH, y); ctx.lineTo(W - PH, y);
  ctx.strokeStyle = 'rgba(23,47,40,0.1)'; ctx.lineWidth = 1; ctx.stroke();
  y += 20;

  ctx.font = FONT_FOOTER; ctx.fillStyle = '#9CA3AF';
  ctx.fillText('植觉 Plant Instinct', PH, y + 11);

  ctx.font = FONT_SMALL; ctx.fillStyle = '#C4C4C4'; ctx.textAlign = 'right';
  ctx.fillText('Botanical', W - PH, y + 11);
  ctx.textAlign = 'left';

  return canvas.toDataURL('image/png');
}
