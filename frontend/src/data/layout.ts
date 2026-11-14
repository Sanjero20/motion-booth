import type { Layout } from "@/features/templates/types/template";

export const DEFAULT_LAYOUTS: Layout[] = [
  {
    format: "strip",
    width: 600,
    height: 1800,
  },
  {
    format: "portrait",
    width: 1200,
    height: 1800,
  },
  {
    format: "landscape",
    width: 1800,
    height: 1200,
  },
];

export const DEFAULT_LAYOUT = DEFAULT_LAYOUTS[0];
