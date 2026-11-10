import {
  drawTemplate,
  drawImageCover,
  loadBackgroundImage,
  loadPhotoImage,
} from "@/features/booth/services/canvas";
import { renderFrame } from "@/features/booth/services/canvas/renderFrame";
import { useEffect, useRef } from "react";

import type { Photo } from "@/features/booth/types/photo";
import type { TemplateLayout } from "@/features/templates/types/template";

interface Props {
  layout: TemplateLayout;
  photos?: Photo[];
  className?: string;
  mode?: "photo" | "motion";
  holdMs?: number;
  flashMs?: number;
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
      onCanvasReady?.(canvas);

      void Promise.all([
        loadBackgroundImage(layout.backgroundImage),
        Promise.all(photos.slice(0, layout.slots.length).map(loadPhotoImage)),
      ]).then(([background, images]) => {
        if (cancelled) return;

        drawTemplate(ctx, layout, images, background);
      });

      return cleanup;
    }

    async function setupMotionPreview() {
      const clips = photos.slice(0, layout.slots.length);

      // Load background and still photos.
      const background = await loadBackgroundImage(layout.backgroundImage);

      if (cancelled) return;

      const stills = await Promise.all(clips.map(loadPhotoImage));

      if (cancelled) return;

      // Display the initial still-photo frame.
      drawTemplate(ctx!, layout, stills, background);

      const readyVideos = await Promise.all(
        clips.map(async (photo, index): Promise<HTMLVideoElement | null> => {
          if (!photo.motionClip || cancelled) return null;

          const url = URL.createObjectURL(photo.motionClip.blob);
          urls.push(url);

          const video = document.createElement("video");
          videos[index] = video;

          video.muted = true;
          video.loop = false;
          video.playsInline = true;
          video.preload = "auto";

          const loaded = await new Promise<boolean>((resolve) => {
            let settled = false;

            const finish = (success: boolean) => {
              if (settled) return;
              settled = true;
              window.clearTimeout(timeout);
              video.onloadeddata = null;
              video.onerror = null;
              resolve(success);
            };

            const timeout = window.setTimeout(() => {
              finish(video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA);
            }, 3000);

            video.onloadeddata = () => finish(true);
            video.onerror = () => finish(false);

            video.src = url;
            video.load();
          });

          if (
            cancelled ||
            !loaded ||
            video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA
          ) {
            return null;
          }

          return video;
        }),
      );

      if (cancelled) return;

      readyVideos.forEach((video, index) => {
        videos[index] = video;
      });

      const finishedAt: (number | null)[] = clips.map(() => null);
      let cycleStart = performance.now();

      videos.forEach((video) => {
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

        // Update clip completion times before drawing the shared frame.
        layout.slots.forEach((_, index) => {
          if (finishedAt[index] !== null) return;

          const photo = clips[index];

          if (!photo) {
            finishedAt[index] = now;
            return;
          }

          const video = videos[index];
          const durationMs = photo.motionClip?.durationMs ?? 0;

          if (!video || video.ended || now - cycleStart > durationMs + 300) {
            video?.pause();
            finishedAt[index] = now;
          }
        });

        // Render the background before rendering the motion frame.
        ctx!.clearRect(0, 0, layout.width, layout.height);

        if (background) {
          drawImageCover(ctx!, background, 0, 0, layout.width, layout.height);
        } else {
          ctx!.fillStyle = "#FFFCF6";
          ctx!.fillRect(0, 0, layout.width, layout.height);
        }

        const { allDone, lastFinish } = renderFrame({
          ctx: ctx!,
          layout,
          stills,
          videos,
          finishedAt,
          now,
          flashMs,
        });

        if (clips.length > 0 && allDone && now - lastFinish >= holdMs) {
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
      className={`block h-auto max-h-full w-auto max-w-full object-contain ${className ?? ""}`}
      style={{
        aspectRatio: `${layout.width} / ${layout.height}`,
      }}
    />
  );
}

export default TemplateCanvas;
