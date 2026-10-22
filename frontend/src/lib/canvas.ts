import type { Photo, TemplateLayout } from "@/types/booth";

export function drawImageCover(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const scale = Math.max(
    width / image.naturalWidth,
    height / image.naturalHeight,
  );

  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  const sourceX = (image.naturalWidth - sourceWidth) / 2;
  const sourceY = (image.naturalHeight - sourceHeight) / 2;

  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    width,
    height,
  );
}

export function drawTemplate(
  ctx: CanvasRenderingContext2D,
  layout: TemplateLayout,
  photos: (HTMLImageElement | null)[] = [],
) {
  const { width, height, slots, branding } = layout;

  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "#FFFCF6";
  ctx.fillRect(0, 0, width, height);

  slots.forEach((slot, index) => {
    const { x, y, w, h } = slot;

    ctx.fillStyle = "#E8E0D4";
    ctx.fillRect(x, y, w, h);

    const image = photos[index];

    if (image) {
      drawImageCover(ctx, image, x, y, w, h);
    }
  });

  ctx.fillStyle = "#191916";
  ctx.font = `500 ${width * 0.035}px "Fraunces", serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(branding.toUpperCase(), width / 2, height * 0.95);
}

export function loadPhotoImage(photo: Photo): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = photo.src;
  });
}
