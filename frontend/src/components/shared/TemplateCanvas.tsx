import { drawTemplate, loadPhotoImage } from "@/lib/canvas";
import type { Photo, TemplateLayout } from "@/types/booth";
import { useEffect, useRef } from "react";

interface Props {
  layout: TemplateLayout;
  photos?: Photo[];
  className?: string;
  onCanvasReady?: (canvas: HTMLCanvasElement | null) => void;
}

function TemplateCanvas({
  layout,
  photos = [],
  className,
  onCanvasReady,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    onCanvasReady?.(canvas);

    let cancelled = false;

    drawTemplate(ctx, layout);

    Promise.all(photos.slice(0, layout.slots.length).map(loadPhotoImage)).then(
      (images) => {
        if (!cancelled) {
          drawTemplate(ctx, layout, images);
        }
      },
    );

    return () => {
      cancelled = true;
      onCanvasReady?.(null);
    };
  }, [layout, photos, onCanvasReady]);

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
