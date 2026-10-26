import { drawTemplate, loadPhotoImage } from "@/lib/canvas";
import { renderFrame } from "@/lib/canvas/renderFrame";
import type { Photo, TemplateLayout } from "@/types/booth";
import { useEffect, useRef } from "react";

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

      drawTemplate(ctx, layout);

      void Promise.all(
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
            video.loop = false;
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

          const clipFinished =
            !video || video.ended || now - cycleStart > durationMs + 300;

          if (clipFinished) {
            video?.pause();
            finishedAt[index] = now;
          }
        });

        const { allDone, lastFinish } = renderFrame({
          ctx: ctx!,
          layout,
          stills,
          videos,
          finishedAt,
          now,
          flashMs,
        });

        const activeSlots = clips.length > 0;

        if (activeSlots && allDone && now - lastFinish >= holdMs) {
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
