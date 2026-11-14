import { DEFAULT_LAYOUTS } from "@/data/layout";
import type { Template } from "@/features/templates/types/template";

export const templates: Template[] = [
  {
    id: "classic-strip",
    name: "Classic Strip",
    layout: DEFAULT_LAYOUTS.find((layout) => layout.format === "strip")!,
    slots: [
      { x: 40, y: 100, w: 520, h: 350 },
      { x: 40, y: 470, w: 520, h: 350 },
      { x: 40, y: 840, w: 520, h: 350 },
      { x: 40, y: 1210, w: 520, h: 350 },
    ],
  },
  {
    id: "grid",
    name: "Grid",
    layout: DEFAULT_LAYOUTS.find((layout) => layout.format === "landscape")!,
    slots: [
      { x: 60, y: 60, w: 820, h: 450 },
      { x: 920, y: 60, w: 820, h: 450 },
      { x: 60, y: 570, w: 820, h: 450 },
      { x: 920, y: 570, w: 820, h: 450 },
    ],
  },
  {
    id: "single",
    name: "Single Shot",
    layout: DEFAULT_LAYOUTS.find((layout) => layout.format === "portrait")!,
    slots: [{ x: 60, y: 60, w: 1080, h: 1500 }],
  },
];
