import type { Slot, Template } from "../types/template";
import PhotoBooth from "@/features/booth/components/PhotoBooth";

interface Props {
  layout: Template;
  slots: Slot[];
  backgroundImage: string | null;
}

function CustomTemplateViewer({ layout, slots, backgroundImage }: Props) {
  return <PhotoBooth template={{ ...layout, slots, backgroundImage }} />;
}

export default CustomTemplateViewer;
