export type Slot = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type TemplateLayout = {
  id: string;
  name: string;
  width: number;
  height: number;
  slots: Slot[];
  branding?: string;
  backgroundImage?: string | null;
};
