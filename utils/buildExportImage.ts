import { PurchaseList, FlowerAnnotation } from '../types';

const PALETTE = [
  '#F9A8D4', '#93C5FD', '#86EFAC', '#FCD34D',
  '#C4B5FD', '#6EE7B7', '#FCA5A5', '#A5F3FC',
];

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
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

    const toRight = (x1 + x2) / 2 < 500;
    const toBottom = (y1 + y2) / 2 < 500;
    const lx = cx + (toRight ? 70 : -70);
    const ly = cy + (toBottom ? 36 : -36);

    // Glow
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fillStyle = color + '44';
    ctx.fill();

    // Dot
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // White core
    ctx.beginPath();
    ctx.arc(cx, cy, 2, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();

    // Dashed line
    ctx.save();
    ctx.setLineDash([3, 2]);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(lx, ly);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // Label pill
    const label = ann.label;
    ctx.font = 'bold 10px "PingFang SC", "Noto Sans SC", sans-serif';
    const tw = ctx.measureText(label).width;
    const pillW = tw + 16;
    const pillX = toRight ? lx - 4 : lx - pillW + 4;
    const pillY = ly - 10;

    rrect(ctx, pillX, pillY, pillW, 20, 10);
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.fillText(label, pillX + pillW / 2, pillY + 14);
    ctx.textAlign = 'left';
  });
}

export async function buildExportImage(
  heroDataUrl: string,
  purchaseList: PurchaseList,
  annotations?: FlowerAnnotation[],
): Promise<string> {
  // Wait for all fonts to be ready
  await document.fonts.ready;

  const SCALE = 3;
  const W = 390;
  const PAD_H = 36;
  const PAD_TOP = 48;
  const PAD_BOT = 44;
  const IMG_W = W - PAD_H * 2;        // 318
  const IMG_H = Math.round(IMG_W * 4 / 3); // 424

  // Load hero image
  const heroImg = await loadImage(heroDataUrl);

  // === Layout calculation ===
  let y = PAD_TOP;

  // Brand
  const brandCapY = y + 10;   y += 16;
  const brandNameY = y + 36;  y += 46;
  const brandSubY  = y + 11;  y += 30; // gap below

  // Image
  const imgY = y;              y += IMG_H + 28;

  // Title + tags
  const titleY = y + 20;       y += 28;
  const tagsY  = y + 11;       y += 20 + 20; // gap after tags

  // Flowers grid
  const flowersY = y;
  const flowers = purchaseList.flowers || [];
  const numRows = Math.ceil(flowers.length / 2);
  const ROW_H = 28;
  y += numRows * ROW_H + 24;

  // Divider + footer
  const divY    = y;           y += 1 + 20;
  const footerY = y + 11;      y += 20 + PAD_BOT;

  const TOTAL_H = y;

  // === Create canvas ===
  const canvas = document.createElement('canvas');
  canvas.width  = W * SCALE;
  canvas.height = TOTAL_H * SCALE;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(SCALE, SCALE);

  // Background
  ctx.fillStyle = '#FDFCF7';
  ctx.fillRect(0, 0, W, TOTAL_H);

  // === Brand ===
  ctx.font = '10px sans-serif';
  ctx.fillStyle = '#9CA3AF';
  ctx.fillText('Botanical Intelligence', PAD_H, brandCapY);

  ctx.font = 'italic bold 36px "Noto Serif SC", "SimSun", serif';
  ctx.fillStyle = '#172f28';
  ctx.fillText('植觉', PAD_H, brandNameY);

  ctx.font = '11px sans-serif';
  ctx.fillStyle = '#9CA3AF';
  ctx.fillText('Plant Instinct', PAD_H, brandSubY);

  // === Hero image with rounded clip ===
  ctx.save();
  rrect(ctx, PAD_H, imgY, IMG_W, IMG_H, 14);
  ctx.clip();
  ctx.drawImage(heroImg, PAD_H, imgY, IMG_W, IMG_H);

  // Gradient overlay
  const grad = ctx.createLinearGradient(0, imgY, 0, imgY + IMG_H);
  grad.addColorStop(0.55, 'rgba(0,0,0,0)');
  grad.addColorStop(1,    'rgba(0,0,0,0.28)');
  ctx.fillStyle = grad;
  ctx.fillRect(PAD_H, imgY, IMG_W, IMG_H);
  ctx.restore();

  // === Annotations ===
  if (annotations && annotations.length > 0) {
    ctx.save();
    rrect(ctx, PAD_H, imgY, IMG_W, IMG_H, 14);
    ctx.clip();
    drawAnnotations(ctx, annotations, PAD_H, imgY, IMG_W, IMG_H);
    ctx.restore();
  }

  // === Title + tags ===
  ctx.font = 'bold 20px "Noto Serif SC", "SimSun", serif';
  ctx.fillStyle = '#172f28';
  ctx.fillText(purchaseList.title || '专属花束清单', PAD_H, titleY);

  ctx.font = '11px sans-serif';
  ctx.fillStyle = '#9CA3AF';
  ctx.fillText(`${purchaseList.style} · ${purchaseList.occasion} · ${purchaseList.size}`, PAD_H, tagsY);

  // === Flower grid (2 columns) ===
  const colW = (W - PAD_H * 2) / 2;
  flowers.forEach((f, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const fx = PAD_H + col * colW;
    const fy = flowersY + row * ROW_H + 14;

    // Dot
    ctx.beginPath();
    ctx.arc(fx + 5, fy - 4, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(23,47,40,0.35)';
    ctx.fill();

    // Name
    ctx.font = 'bold 13px "Noto Serif SC", "SimSun", serif';
    ctx.fillStyle = '#172f28';
    ctx.fillText(f.nameCN, fx + 14, fy);

    // Quantity
    const nw = ctx.measureText(f.nameCN).width;
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#9CA3AF';
    ctx.fillText(`×${f.quantity}`, fx + 14 + nw + 4, fy);
  });

  // === Divider ===
  ctx.beginPath();
  ctx.moveTo(PAD_H, divY);
  ctx.lineTo(W - PAD_H, divY);
  ctx.strokeStyle = 'rgba(23,47,40,0.1)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // === Footer ===
  ctx.font = 'italic 11px "Noto Serif SC", serif';
  ctx.fillStyle = '#9CA3AF';
  ctx.fillText('植觉 Plant Instinct', PAD_H, footerY);

  ctx.font = '9px sans-serif';
  ctx.fillStyle = '#C4C4C4';
  ctx.textAlign = 'right';
  ctx.fillText('Botanical', W - PAD_H, footerY);
  ctx.textAlign = 'left';

  return canvas.toDataURL('image/png');
}
