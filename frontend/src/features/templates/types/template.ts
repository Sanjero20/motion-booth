export type Format = "strip" | "portrait" | "landscape";

export type Layout = {
  format: Format;
  width: number;
  height: number;
};

export type Slot = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type Template = {
  id: string;
  name: string;
  layout: Layout;
  slots: Slot[];
  backgroundImage?: string | null;
};

export type EventTemplate = {
  layout: Layout;
  slots: Slot[];
  backgroundImage?: string | null;
};

export type TemplateConfiguration = {
  id?: string;
  name?: string;
  layout: Layout;
  slots: Slot[];
  backgroundImage?: string | null;
};

// DTOs
export type SaveTemplateRequest = {
  name: string;
  layout: Layout;
  slots: Slot[];
  backgroundImageFile?: File | null;
  removeBackgroundImage?: boolean;
};
