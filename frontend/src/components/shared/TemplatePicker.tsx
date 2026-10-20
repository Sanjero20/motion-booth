import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { GalleryVerticalIcon, Grid2X2, Smartphone } from "lucide-react";

const TEMPLATES = [
  { icon: GalleryVerticalIcon, label: "Classic" },
  { icon: Grid2X2, label: "Grid" },
  { icon: Smartphone, label: "Story" },
];

function TemplatePicker() {
  const [selected, setSelected] = useState<string[]>(["Classic"]);

  return (
    <ToggleGroup
      value={selected}
      onValueChange={(value) => {
        if (value) setSelected(value);
      }}
      className="grid w-full grid-cols-3 gap-3"
    >
      {TEMPLATES.map((template) => {
        const TemplateIcon = template.icon;

        return (
          <ToggleGroupItem
            key={template.label}
            value={template.label}
            aria-label={template.label}
            className="bg-card aria-pressed:border-primary aria-pressed:bg-card aria-pressed:text-foreground flex h-auto flex-col gap-1.5 rounded-lg border py-3"
          >
            <TemplateIcon size={32} />
            <span>{template.label}</span>
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
}

export default TemplatePicker;
