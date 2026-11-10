import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";

import TemplateEditor from "@/features/templates/components/TemplateEditor";
import type { Slot, TemplateLayout } from "@/features/templates/types/template";
import { DEFAULT_TEMPLATE_ID, templateFormats } from "@/data/templateFormat";

function createSlots(width: number, height: number, count: number): Slot[] {
  const margin = 40;
  const gap = 20;

  const slotWidth = width - margin * 2;
  const slotHeight = (height - margin * 2 - gap * (count - 1)) / count;

  return Array.from({ length: count }, (_, index) => ({
    x: margin,
    y: margin + index * (slotHeight + gap),
    w: slotWidth,
    h: slotHeight,
  }));
}

function EventTemplateCustomizer() {
  const [selectedTemplateId, setSelectedTemplateId] = useState([
    DEFAULT_TEMPLATE_ID,
  ]);

  const selectedLayout = templateFormats.find(
    (template) => template.id === selectedTemplateId[0],
  )!;

  const [slots, setSlots] = useState<Slot[]>(() =>
    createSlots(selectedLayout.width, selectedLayout.height, 3),
  );

  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  const handleTemplateChange = (value: string[]) => {
    if (!value.length) return;

    const layout = templateFormats.find((template) => template.id === value[0]);

    if (!layout) return;

    setSelectedTemplateId(value);
    setSlots(createSlots(layout.width, layout.height, slots.length));
    setSelectedSlot(null);
  };

  const handleSlotCountChange = (value: string[]) => {
    if (!value.length) return;

    setSlots(
      createSlots(
        selectedLayout.width,
        selectedLayout.height,
        Number(value[0]),
      ),
    );

    setSelectedSlot(null);
  };

  const handleBackgroundChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      setBackgroundImage(URL.createObjectURL(file));
    }
  };

  const deleteSelectedSlot = () => {
    if (selectedSlot === null) return;

    setSlots(slots.filter((_, index) => index !== selectedSlot));
    setSelectedSlot(null);
  };

  const customTemplate: TemplateLayout = {
    id: "",
    name: "Custom",
    width: selectedLayout.width,
    height: selectedLayout.height,
    slots: slots,
    branding: "",
  };

  console.clear();
  console.log(customTemplate);

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">Layout</h3>
        <p className="text-muted-foreground text-sm">
          Upload your background and arrange your photo slots. Drag to move and
          resize them using the orange handle.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {/* Canvas */}
        <div className="bg-secondary relative flex h-150 items-center justify-center rounded-xl border p-4 lg:col-span-3">
          <TemplateEditor
            layout={selectedLayout}
            slots={slots}
            onSlotsChange={setSlots}
            selectedSlot={selectedSlot}
            onSelectSlot={setSelectedSlot}
            backgroundImage={backgroundImage}
          />
        </div>

        {/* Settings Panel */}
        <aside className="col-span-1">
          <Card className="h-full py-4">
            <CardContent className="space-y-4 px-4">
              {/* Settings */}
              <div className="space-y-1 border-b pb-3">
                <p className="font-semibold">Settings</p>
                <p className="text-muted-foreground text-xs">
                  Configure your template layout.
                </p>
              </div>

              {/* Print Format */}
              <div className="space-y-3">
                <p className="text-sm font-medium">Print Format</p>

                <ToggleGroup
                  value={selectedTemplateId}
                  onValueChange={handleTemplateChange}
                >
                  {templateFormats.map((template) => (
                    <ToggleGroupItem
                      variant="outline"
                      key={template.id}
                      value={template.id}
                    >
                      {template.name}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              {/* Photo Slots */}
              <div className="space-y-3">
                <p className="text-sm font-medium">Photo Slots</p>

                <ToggleGroup
                  className="grid w-full grid-cols-4"
                  value={[String(slots.length)]}
                  onValueChange={handleSlotCountChange}
                >
                  {[1, 2, 3, 4].map((count) => (
                    <ToggleGroupItem
                      key={count}
                      variant="outline"
                      value={String(count)}
                    >
                      {count}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              {/* Background */}
              <div className="space-y-3">
                <p className="text-sm font-medium">Background</p>

                <label className="bg-secondary border-border hover:bg-muted flex h-12 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed text-sm">
                  Upload background
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBackgroundChange}
                  />
                </label>

                {backgroundImage && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setBackgroundImage(null)}
                  >
                    Remove background
                  </Button>
                )}
              </div>

              {/* Selected Slot */}
              <div className="space-y-3 border-t pt-3">
                <p className="text-sm font-medium">Selected Slot</p>

                {selectedSlot !== null ? (
                  <>
                    <p className="text-muted-foreground text-xs">
                      Slot {selectedSlot + 1} selected
                    </p>

                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={deleteSelectedSlot}
                    >
                      Delete slot
                    </Button>
                  </>
                ) : (
                  <p className="text-muted-foreground text-xs">
                    Select a slot on the canvas to edit it.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </section>
  );
}

export default EventTemplateCustomizer;
