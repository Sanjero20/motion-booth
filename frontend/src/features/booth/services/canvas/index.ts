import type { Photo } from "@/features/booth/types/photo";
import type { Template } from "@/features/templates/types/template";

export function drawImageCover(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | HTMLVideoElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const sourceWidth =
    image instanceof HTMLVideoElement ? image.videoWidth : image.naturalWidth;

  const sourceHeight =
    image instanceof HTMLVideoElement ? image.videoHeight : image.naturalHeight;

  if (!sourceWidth || !sourceHeight) return;

  const scale = Math.max(width / sourceWidth, height / sourceHeight);

  const cropWidth = width / scale;
  const cropHeight = height / scale;
  const sourceX = (sourceWidth - cropWidth) / 2;
  const sourceY = (sourceHeight - cropHeight) / 2;

  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    cropWidth,
    cropHeight,
    x,
    y,
    width,
    height,
  );
}

export function loadBackgroundImage(
  url?: string | null,
): Promise<HTMLImageElement | null> {
  if (!url) return Promise.resolve(null);

  return new Promise((resolve) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = url;
  });
}

export function drawTemplate(
  ctx: CanvasRenderingContext2D,
  layout: Template,
  photos: (HTMLImageElement | null)[] = [],
  background?: HTMLImageElement | null,
) {
  const { width, height, slots, branding } = layout;

  ctx.clearRect(0, 0, width, height);

  // Base background
  ctx.fillStyle = "#FFFCF6";
  ctx.fillRect(0, 0, width, height);

  // Custom background image
  if (background) {
    drawImageCover(ctx, background, 0, 0, width, height);
  }

  // Photo slots
  slots.forEach((slot, index) => {
    const { x, y, w, h } = slot;

    ctx.fillStyle = "#E8E0D4";
    ctx.fillRect(x, y, w, h);

    const image = photos[index];

    if (image) {
      drawImageCover(ctx, image, x, y, w, h);
    }
  });

  // Branding
  if (branding) {
    ctx.fillStyle = "#191916";
    ctx.font = `500 ${width * 0.035}px "Fraunces", serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(branding.toUpperCase(), width / 2, height * 0.95);
  }
}

export function loadPhotoImage(photo: Photo): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = photo.src;
  });
}
