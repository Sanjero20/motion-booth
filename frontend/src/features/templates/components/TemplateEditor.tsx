import { Rnd } from "react-rnd";
import type { Slot, Template } from "../types/template";
import { useEffect, useRef, useState } from "react";

interface Props {
  layout: Template;
  slots: Slot[];
  onSlotsChange: (slots: Slot[]) => void;
  selectedSlot: number | null;
  onSelectSlot: (index: number | null) => void;
  backgroundImage: string | null;
}

function TemplateEditor({
  layout,
  slots,
  onSlotsChange,
  selectedSlot,
  onSelectSlot,
  backgroundImage,
}: Props) {
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

  const updateSlot = (index: number, patch: Partial<Slot>) => {
    const updatedSlots = slots.map((slot, i) =>
      i === index ? { ...slot, ...patch } : slot,
    );

    onSlotsChange(updatedSlots);
  };

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
          backgroundImage: backgroundImage
            ? `url(${backgroundImage})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="relative shrink-0 overflow-hidden bg-white"
      >
        {slots.map((slot, index) => (
          <Rnd
            key={index}
            bounds="parent"
            scale={scale}
            position={{ x: slot.x, y: slot.y }}
            size={{ width: slot.w, height: slot.h }}
            dragGrid={[5, 5]}
            resizeGrid={[5, 5]}
            onDragStart={() => onSelectSlot(index)}
            onResizeStart={() => onSelectSlot(index)}
            onDrag={(_, d) =>
              updateSlot(index, {
                x: d.x,
                y: d.y,
              })
            }
            onResize={(_, __, ref, ___, pos) =>
              updateSlot(index, {
                w: ref.offsetWidth,
                h: ref.offsetHeight,
                x: pos.x,
                y: pos.y,
              })
            }
            enableResizing={{
              bottomRight: true,
            }}
            resizeHandleComponent={{
              bottomRight: (
                <div className="absolute -right-2 -bottom-2 h-4 w-4 rounded-full border-2 border-white bg-orange-500" />
              ),
            }}
            className={`border-2 border-dashed ${
              selectedSlot === index
                ? "border-orange-500 bg-orange-500/20"
                : "border-orange-400 bg-orange-500/10"
            }`}
          >
            <div
              className="flex h-full w-full cursor-move items-center justify-center"
              onClick={() => onSelectSlot(index)}
            >
              <span className="font-display text-5xl font-medium text-orange-600 select-none">
                {index + 1}
              </span>
            </div>
          </Rnd>
        ))}
      </div>
    </div>
  );
}

export default TemplateEditor;
