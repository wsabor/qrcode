import QRCode from "qrcode";
import type { ErrorLevel } from "../types";
import { roundRect } from "./utils";

export const PREVIEW_SIZE = 320;

export interface DrawParams {
  qrContent: string;
  fgColor: string;
  bgColor: string;
  transparentBg: boolean;
  logo: string | null;
  logoSize: number;
  errorLevel: ErrorLevel;
}

export async function drawQRWithLogo(
  canvas: HTMLCanvasElement,
  size: number,
  params: DrawParams,
): Promise<void> {
  const { qrContent, fgColor, bgColor, transparentBg, logo, logoSize, errorLevel } = params;

  if (!qrContent.trim()) {
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, size, size);
    return;
  }

  try {
    await QRCode.toCanvas(canvas, qrContent, {
      width: size,
      margin: 2,
      color: {
        dark: fgColor,
        light: transparentBg ? "#00000000" : bgColor,
      },
      errorCorrectionLevel: errorLevel,
    });

    if (transparentBg) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, size, size);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i] > 240 && data[i + 1] > 240 && data[i + 2] > 240) {
            data[i + 3] = 0;
          }
        }
        ctx.putImageData(imageData, 0, 0);
      }
    }

    if (logo) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = (err) => reject(err);
          img.src = logo;
        });

        const logoSizePx = (size * logoSize) / 100;
        const x = (size - logoSizePx) / 2;
        const y = (size - logoSizePx) / 2;
        const padding = logoSizePx * 0.1;
        const radius = 8 * (size / PREVIEW_SIZE);

        ctx.save();
        ctx.beginPath();
        roundRect(ctx, x - padding, y - padding, logoSizePx + padding * 2, logoSizePx + padding * 2, radius);
        ctx.fillStyle = transparentBg ? "rgba(255,255,255,0.95)" : bgColor;
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        roundRect(ctx, x, y, logoSizePx, logoSizePx, radius * 0.7);
        ctx.clip();
        ctx.drawImage(img, x, y, logoSizePx, logoSizePx);
        ctx.restore();
      }
    }
  } catch {
    // Invalid QR data, ignore
  }
}
