import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Check, LayoutTemplate } from "lucide-react";

import type { Template } from "@/features/templates/types/template";

type EventTemplatePickerProps = {
  templates: Template[];
  value: string[];
  onChange: (value: string[]) => void;
};

function EventTemplatePicker({
  templates,
  value,
  onChange,
}: EventTemplatePickerProps) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-medium">Choose a Template</h3>
        <p className="text-muted-foreground text-sm">
          Select a saved template to use as your starting point.
        </p>
      </div>

      <ToggleGroup
        value={value}
        onValueChange={(selectedId) => {
          if (selectedId.length > 0) onChange(selectedId);
        }}
        className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {templates.map((template) => {
          const isSelected = value[0] === template.id;

          return (
            <ToggleGroupItem
              key={template.id}
              value={template.id}
              className="data-[state=on]:border-primary data-[state=on]:bg-primary/5 relative flex h-auto flex-col items-start gap-3 rounded-lg border p-4 text-left"
            >
              <div className="flex w-full items-start justify-between">
                <div className="bg-muted flex size-10 items-center justify-center rounded-md">
                  <LayoutTemplate className="size-5" />
                </div>

                {isSelected && <Check className="text-primary size-4" />}
              </div>

              <div className="w-full space-y-1">
                <p className="font-medium">{template.name}</p>
                <p className="text-muted-foreground text-xs capitalize">
                  {template.layout.format} · {template.slots.length} photo slots
                </p>
              </div>
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </div>
  );
}

export default EventTemplatePicker;
