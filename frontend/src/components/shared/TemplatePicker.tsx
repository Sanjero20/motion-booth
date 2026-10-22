import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { GalleryVerticalIcon, Grid2X2, Smartphone } from "lucide-react";
import { templates } from "@/data/templates";
import { cn } from "cn";

const TEMPLATE_ICONS = {
  "classic-strip": GalleryVerticalIcon,
  grid: Grid2X2,
  single: Smartphone,
};

type TemplatePickerProps = {
  selectedId: string[];
  onSelect: (id: string[]) => void;
  layout?: "grid" | "vertical";
};

function TemplatePicker({
  selectedId,
  onSelect,
  layout = "grid",
}: TemplatePickerProps) {
  return (
    <ToggleGroup
      value={selectedId}
      onValueChange={(value) => {
        if (value.length > 0) {
          onSelect([value[value.length - 1]]);
        }
      }}
      className={cn(
        layout === "grid"
          ? "grid w-full grid-cols-3 gap-3"
          : "flex w-full flex-col items-stretch gap-2",
      )}
    >
      {templates.map((template) => {
        const TemplateIcon =
          TEMPLATE_ICONS[template.id as keyof typeof TEMPLATE_ICONS];

        return (
          <ToggleGroupItem
            key={template.id}
            value={template.id}
            aria-label={template.name}
            className={cn(
              "bg-card aria-pressed:border-primary aria-pressed:bg-card aria-pressed:text-foreground flex h-auto gap-2 rounded-lg border py-3",
              layout === "grid"
                ? "flex-col gap-1.5"
                : "w-full justify-start px-4",
            )}
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
