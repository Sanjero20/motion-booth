import TemplateCanvas from "@/components/shared/TemplateCanvas";
import type { Slot, TemplateLayout } from "../types/template";

interface Props {
  layout: TemplateLayout;
  slots: Slot[];
  backgroundImage: string | null;
}

function CustomTemplateViewer({ layout, slots, backgroundImage }: Props) {
  return (
    <div className="bg-secondary flex h-150 items-center justify-center p-8">
      <TemplateCanvas layout={{ ...layout, slots, backgroundImage }} />
    </div>
  );
}

export default CustomTemplateViewer;
