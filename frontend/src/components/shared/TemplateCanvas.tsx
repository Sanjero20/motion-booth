import type { TemplateLayout } from "@/types/booth";
import { useEffect, useRef } from "react";

interface Props {
  layout: TemplateLayout;
  className?: string;
}

function TemplateCanvas({ layout, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    const { width, height, slots, branding } = layout;

    // Paper background
    ctx.fillStyle = "#FFFCF6";
    ctx.fillRect(0, 0, width, height);

    // Photo placeholders
    ctx.fillStyle = "#E8E0D4";

    slots.forEach(({ x, y, w, h }) => {
      ctx.fillRect(x, y, w, h);
    });

    // Branding
    ctx.fillStyle = "#191916";
    ctx.font = `600 ${width * 0.035}px "Fraunces", serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(branding.toUpperCase(), width / 2, height * 0.92);
  }, [layout]);

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
