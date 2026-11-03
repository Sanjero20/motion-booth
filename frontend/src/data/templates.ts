import type { TemplateLayout } from "@/features/templates/types/template";

export const templates: TemplateLayout[] = [
  {
    id: "classic-strip",
    name: "Classic Strip",
    width: 600,
    height: 1800,
    branding: "Motion Booth",
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
    width: 1800,
    height: 1200,
    branding: "Motion Booth",
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
    width: 900,
    height: 1200,
    branding: "Motion Booth",
    slots: [{ x: 60, y: 60, w: 780, h: 960 }],
  },
];
