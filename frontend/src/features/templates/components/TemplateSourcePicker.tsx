import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LayoutTemplate, Plus } from "lucide-react";

type TemplateSourcePickerProps = {
  value: string[];
  onChange: (value: string[]) => void;
};

function TemplateSourcePicker({ value, onChange }: TemplateSourcePickerProps) {
  return (
    <ToggleGroup
      value={value}
      onValueChange={(value) => {
        if (value.length > 0) onChange(value);
      }}
      className="grid w-full grid-cols-2 gap-3"
    >
      <ToggleGroupItem
        value="scratch"
        className="flex h-auto flex-col gap-2 rounded-lg border py-5"
      >
        <Plus size={28} />
        <span className="font-medium">Start from Scratch</span>
        <span className="text-muted-foreground text-xs">
          Create your own layout
        </span>
      </ToggleGroupItem>

      <ToggleGroupItem
        value="existing"
        className="flex h-auto flex-col gap-2 rounded-lg border py-5"
      >
        <LayoutTemplate size={28} />
        <span className="font-medium">Use Existing Template</span>
        <span className="text-muted-foreground text-xs">
          Start with a saved template
        </span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

export default TemplateSourcePicker;
