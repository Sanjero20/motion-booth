import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { GalleryVerticalIcon, Grid2X2, Smartphone } from "lucide-react";
import { templates } from "@/data/templates";

const TEMPLATE_ICONS = {
  "classic-strip": GalleryVerticalIcon,
  grid: Grid2X2,
  single: Smartphone,
};

type TemplatePickerProps = {
  selectedId: string[];
  onSelect: (id: string[]) => void;
};

function TemplatePicker({ selectedId, onSelect }: TemplatePickerProps) {
  return (
    <ToggleGroup
      value={selectedId}
      onValueChange={(value) => {
        if (value.length > 0) {
          onSelect([value[value.length - 1]]);
        }
      }}
      className="grid w-full grid-cols-3 gap-3"
    >
      {templates.map((template) => {
        const TemplateIcon =
          TEMPLATE_ICONS[template.id as keyof typeof TEMPLATE_ICONS];

        return (
          <ToggleGroupItem
            key={template.id}
            value={template.id}
            aria-label={template.name}
            className="bg-card aria-pressed:border-primary aria-pressed:bg-card aria-pressed:text-foreground flex h-auto flex-col gap-1.5 rounded-lg border py-3"
          >
            <TemplateIcon size={32} />
            <span>{template.name}</span>
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
}

export default TemplatePicker;
