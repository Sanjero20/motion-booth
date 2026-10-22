import { drawImageCover, drawTemplate, loadPhotoImage } from "@/lib/canvas";
import type { Photo, TemplateLayout } from "@/types/booth";
import { useEffect, useRef } from "react";

interface Props {
  layout: TemplateLayout;
  photos?: Photo[];
  className?: string;
  mode?: "photo" | "motion";
  onCanvasReady?: (canvas: HTMLCanvasElement | null) => void;
}

function TemplateCanvas({
  layout,
  photos = [],
  className,
  mode = "photo",
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

      const readyVideos = await Promise.all(
        clips.map(async (photo) => {
          if (!photo.motionClip) return null;

          const url = URL.createObjectURL(photo.motionClip.blob);
          urls.push(url);

          const video = document.createElement("video");
          video.src = url;
          video.muted = true;
          video.loop = true;
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
      );

      if (cancelled) return;

      readyVideos.forEach((video, index) => {
        videos[index] = video;

        if (video) {
          void video.play().catch(() => {});
        }
      });

      const render = () => {
        if (cancelled) return;

        drawTemplate(ctx!, layout);

        layout.slots.forEach((slot, index) => {
          const video = videos[index];

          if (video && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
            drawImageCover(ctx!, video, slot.x, slot.y, slot.w, slot.h);
          }
        });

        animationFrame = requestAnimationFrame(render);
      };

      render();
    }

    void setupMotionPreview();

    return cleanup;
  }, [layout, photos, mode, onCanvasReady]);

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
