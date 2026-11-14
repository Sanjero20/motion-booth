import type { Template } from "@/features/templates/types/template";
import { drawImageCover, drawTemplate } from "@/features/booth/services/canvas";

interface RenderFrameOptions {
  ctx: CanvasRenderingContext2D;
  layout: Template;
  stills: (HTMLImageElement | null)[];
  videos: (HTMLVideoElement | null)[];
  finishedAt: (number | null)[];
  now: number;
  flashMs?: number;
  background?: HTMLImageElement | null;
}

/**
 * Draws one frame of the template animation.
 *
 * A video plays until its finishedAt timestamp is set.
 * Once finished, its still image is displayed with a fading flash.
 */
export function renderFrame({
  ctx,
  layout,
  stills,
  videos,
  finishedAt,
  now,
  flashMs = 300,
  background,
}: RenderFrameOptions) {
  // Draw background first.
  drawTemplate(ctx, layout, [], background);

  let allDone = true;
  let lastFinish = 0;

  layout.slots.forEach((slot, index) => {
    const video = videos[index];
    const still = stills[index];
    const doneAt = finishedAt[index];

    if (doneAt === null || doneAt === undefined) {
      allDone = false;

      if (video && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        drawImageCover(ctx, video, slot.x, slot.y, slot.w, slot.h);
      }

      return;
    }

    lastFinish = Math.max(lastFinish, doneAt);

    if (still) {
      drawImageCover(ctx, still, slot.x, slot.y, slot.w, slot.h);
    } else if (video) {
      drawImageCover(ctx, video, slot.x, slot.y, slot.w, slot.h);
    }

    const flashElapsed = now - doneAt;

    if (flashElapsed >= 0 && flashElapsed < flashMs) {
      ctx.save();
      ctx.globalAlpha = 1 - flashElapsed / flashMs;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(slot.x, slot.y, slot.w, slot.h);
      ctx.restore();
    }
  });

  return { allDone, lastFinish };
}
