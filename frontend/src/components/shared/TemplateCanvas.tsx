import { drawImageCover, drawTemplate, loadPhotoImage } from "@/lib/canvas";
import type { Photo, TemplateLayout } from "@/types/booth";
import { useEffect, useRef } from "react";

interface Props {
  layout: TemplateLayout;
  photos?: Photo[];
  className?: string;
  mode?: "photo" | "motion";
  holdMs?: number; // how long the still photo is held before replaying
  flashMs?: number; // flash fade duration
  onCanvasReady?: (canvas: HTMLCanvasElement | null) => void;
}

function TemplateCanvas({
  layout,
  photos = [],
  className,
  mode = "photo",
  holdMs = 3000,
  flashMs = 300,
  onCanvasReady,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    if (mode === "photo") {
      onCanvasReady?.(canvas);
    }

    let cancelled = false;
    let animationFrame = 0;

    const videos: (HTMLVideoElement | null)[] = [];
    const urls: string[] = [];

    const cleanup = () => {
      cancelled = true;
      cancelAnimationFrame(animationFrame);

      videos.forEach((video) => {
        if (!video) return;

        video.pause();
        video.removeAttribute("src");
        video.load();
      });

      urls.forEach((url) => URL.revokeObjectURL(url));

      if (mode === "photo") {
        onCanvasReady?.(null);
      }
    };

    if (mode === "photo") {
      drawTemplate(ctx, layout);

      Promise.all(
        photos.slice(0, layout.slots.length).map(loadPhotoImage),
      ).then((images) => {
        if (!cancelled) {
          drawTemplate(ctx, layout, images);
        }
      });

      return cleanup;
    }

    async function setupMotionPreview() {
      drawTemplate(ctx!, layout);

      const clips = photos.slice(0, layout.slots.length);

      const [readyVideos, stills] = await Promise.all([
        Promise.all(
          clips.map(async (photo) => {
            if (!photo.motionClip) return null;

            const url = URL.createObjectURL(photo.motionClip.blob);
            urls.push(url);

            const video = document.createElement("video");
            video.src = url;
            video.muted = true;
            video.loop = false; // play once, then flash + hold
            video.playsInline = true;
            video.preload = "auto";

            await new Promise<void>((resolve) => {
              video.onloadeddata = () => resolve();
              video.onerror = () => resolve();
            });

            return video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA
              ? video
              : null;
          }),
        ),
        Promise.all(clips.map(loadPhotoImage)),
      ]);

      if (cancelled) return;

      const finishedAt: (number | null)[] = clips.map(() => null);
      let cycleStart = performance.now();

      readyVideos.forEach((video, index) => {
        videos[index] = video;
        if (video) void video.play().catch(() => {});
      });

      const restart = (now: number) => {
        cycleStart = now;
        finishedAt.fill(null);

        videos.forEach((video) => {
          if (!video) return;
          video.currentTime = 0;
          void video.play().catch(() => {});
        });
      };

      const render = () => {
        if (cancelled) return;

        const now = performance.now();
        drawTemplate(ctx!, layout);

        let activeSlots = 0;
        let allDone = true;
        let lastFinish = 0;

        layout.slots.forEach((slot, index) => {
          const photo = clips[index];
          if (!photo) return;

          activeSlots++;

          const video = videos[index];
          const still = stills[index];
          const durationMs = photo.motionClip?.durationMs ?? 0;

          // Clip is done when it ends (with a time-based fallback,
          // since MediaRecorder webm files can be unreliable).
          if (finishedAt[index] === null) {
            const clipFinished =
              !video || video.ended || now - cycleStart > durationMs + 300;

            if (clipFinished) {
              video?.pause();
              finishedAt[index] = now;
            }
          }

          const doneAt = finishedAt[index];

          if (doneAt === null) {
            allDone = false;

            if (
              video &&
              video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA
            ) {
              drawImageCover(ctx!, video, slot.x, slot.y, slot.w, slot.h);
            }
            return;
          }

          lastFinish = Math.max(lastFinish, doneAt);

          // Held still photo
          if (still) {
            drawImageCover(ctx!, still, slot.x, slot.y, slot.w, slot.h);
          } else if (video) {
            drawImageCover(ctx!, video, slot.x, slot.y, slot.w, slot.h);
          }

          // Flash fading out over the still
          const flashElapsed = now - doneAt;

          if (flashElapsed < flashMs) {
            ctx!.save();
            ctx!.globalAlpha = 1 - flashElapsed / flashMs;
            ctx!.fillStyle = "#ffffff";
            ctx!.fillRect(slot.x, slot.y, slot.w, slot.h);
            ctx!.restore();
          }
        });

        if (activeSlots > 0 && allDone && now - lastFinish >= holdMs) {
          restart(now);
        }

        animationFrame = requestAnimationFrame(render);
      };

      render();
    }

    void setupMotionPreview();

    return cleanup;
  }, [layout, photos, mode, holdMs, flashMs, onCanvasReady]);

  return (
    <canvas
      ref={canvasRef}
      width={layout.width}
      height={layout.height}
      role="img"
      aria-label={`${layout.name} template preview`}
      className={`block h-auto max-h-full w-auto max-w-full ${className ?? ""}`}
      style={{
        aspectRatio: `${layout.width} / ${layout.height}`,
      }}
    />
  );
}

export default TemplateCanvas;
