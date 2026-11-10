import type { TemplateLayout } from "../types/template";
import { useEffect, useRef, useState } from "react";

interface Props {
  layout: TemplateLayout;
}

function TemplateEditor({ layout }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScale = () => {
      const { width, height } = container.getBoundingClientRect();

      setScale(Math.min(width / layout.width, height / layout.height, 1));
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(container);

    return () => observer.disconnect();
  }, [layout.width, layout.height]);

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full items-center justify-center overflow-hidden"
    >
      <div
        style={{
          width: layout.width,
          height: layout.height,
          transform: `scale(${scale})`,
          transformOrigin: "center",
        }}
        className="shrink-0 bg-white"
      />
    </div>
  );
}

export default TemplateEditor;
