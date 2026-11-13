import type { Template } from "@/features/templates/types/template";

export const templateFormats: Template[] = [
  {
    id: "strip",
    name: "Strip",
    width: 600,
    height: 1800,
    slots: [],
    branding: "",
  },
  {
    id: "portrait",
    name: "Portrait",
    width: 1200,
    height: 1800,
    slots: [],
    branding: "",
  },
  {
    id: "landscape",
    name: "Landscape",
    width: 1800,
    height: 1200,
    slots: [],
    branding: "",
  },
];

export const DEFAULT_TEMPLATE_ID = templateFormats[0].id;
