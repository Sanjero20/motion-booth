import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";

import TemplateEditor from "@/features/templates/components/TemplateEditor";
import type { Slot, TemplateLayout } from "@/features/templates/types/template";
import { DEFAULT_TEMPLATE_ID, templateFormats } from "@/data/templateFormat";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TemplateCanvas from "@/components/shared/TemplateCanvas";

type Format = "strip" | "portrait" | "landscape";

// Columns per photo count, chosen so slots stay close to a normal photo shape.
const COLUMNS: Record<Format, Record<number, number>> = {
  strip: { 1: 1, 2: 1, 3: 1, 4: 1 },
  portrait: { 1: 1, 2: 1, 3: 2, 4: 2 },
  landscape: { 1: 1, 2: 2, 3: 2, 4: 2 },
};

// Share of the canvas height kept free at the bottom for a logo or caption.
const FOOTER: Record<Format, number> = {
  strip: 0.12,
  portrait: 0.12,
  landscape: 0.08,
};

function getFormat(width: number, height: number): Format {
  const ratio = height / width;
  if (ratio >= 2) return "strip"; // 2x6
  return ratio > 1 ? "portrait" : "landscape"; // 4x6 / 6x4
}

function createSlots(width: number, height: number, count: number): Slot[] {
  const n = Math.min(Math.max(Math.round(count), 1), 4);
  const format = getFormat(width, height);

  // Spacing scales with the canvas so it looks the same at any resolution.
  const margin = Math.round(Math.min(width, height) * 0.06);
  const gap = Math.round(margin / 2);

  const columns = COLUMNS[format][n];
  const rows = Math.ceil(n / columns);

  const availableWidth = width - margin * 2;
  const availableHeight =
    height - margin * 2 - Math.round(height * FOOTER[format]);

  const slotWidth = Math.round(
    (availableWidth - gap * (columns - 1)) / columns,
  );
  const slotHeight = Math.round((availableHeight - gap * (rows - 1)) / rows);

  return Array.from({ length: n }, (_, index) => {
    const row = Math.floor(index / columns);
    const column = index % columns;

    // Center a short last row (e.g. the 3rd slot in a 2-column grid).
    const itemsInRow = Math.min(columns, n - row * columns);
    const rowWidth = itemsInRow * slotWidth + (itemsInRow - 1) * gap;
    const rowStart = margin + Math.round((availableWidth - rowWidth) / 2);

    return {
      x: rowStart + column * (slotWidth + gap),
      y: margin + row * (slotHeight + gap),
      w: slotWidth,
      h: slotHeight,
    };
  });
}

type Mode = "edit" | "preview";

function EventTemplateCustomizer() {
  const [mode, setMode] = useState<Mode>("edit");

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
    backgroundImage: backgroundImage,
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
        <div className="bg-secondary relative flex h-150 items-center justify-center rounded-xl border p-16 lg:col-span-3">
          <div className="absolute top-2 left-2">
            <Tabs value={mode} onValueChange={(value: Mode) => setMode(value)}>
              <TabsList className="bg-white">
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {mode == "edit" ? (
            <TemplateEditor
              layout={selectedLayout}
              slots={slots}
              onSlotsChange={setSlots}
              selectedSlot={selectedSlot}
              onSelectSlot={setSelectedSlot}
              backgroundImage={backgroundImage}
            />
          ) : (
            <TemplateCanvas layout={customTemplate} />
          )}
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

                    {(() => {
                      const slot = slots[selectedSlot];

                      return (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <p className="text-muted-foreground text-xs">
                              Position X
                            </p>
                            <p className="text-sm font-medium">
                              {Math.round(slot.x)} px
                            </p>
                          </div>

                          <div className="space-y-1">
                            <p className="text-muted-foreground text-xs">
                              Position Y
                            </p>
                            <p className="text-sm font-medium">
                              {Math.round(slot.y)} px
                            </p>
                          </div>

                          <div className="space-y-1">
                            <p className="text-muted-foreground text-xs">
                              Width
                            </p>
                            <p className="text-sm font-medium">
                              {Math.round(slot.w)} px
                            </p>
                          </div>

                          <div className="space-y-1">
                            <p className="text-muted-foreground text-xs">
                              Height
                            </p>
                            <p className="text-sm font-medium">
                              {Math.round(slot.h)} px
                            </p>
                          </div>
                        </div>
                      );
                    })()}

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
