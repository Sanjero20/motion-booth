import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import TemplateCanvas from "@/components/shared/TemplateCanvas";
import TemplateEditor from "@/features/templates/components/TemplateEditor";

import type useTemplateEditor from "@/features/templates/hooks/useTemplateEditor";
import { DEFAULT_LAYOUTS } from "@/data/layout";

type Mode = "edit" | "preview";

type Props = ReturnType<typeof useTemplateEditor>;

function CustomTemplateEditor({
  selectedLayout,
  changeLayout,
  slots,
  setSlots,
  changeSlotCount,
  removeSlot,
  backgroundImage,
  uploadBackground,
  removeBackground,
}: Props) {
  const [mode, setMode] = useState<Mode>("edit");
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const handleLayoutChange = (value: string[]) => {
    if (!value.length) return;

    changeLayout(value[0] as typeof selectedLayout.format);
    setSelectedSlot(null);
  };

  const handleSlotCountChange = (value: string[]) => {
    if (!value.length) return;

    changeSlotCount(Number(value[0]));
    setSelectedSlot(null);
  };

  const handleBackgroundChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      uploadBackground(file);
    }

    event.target.value = "";
  };

  const deleteSelectedSlot = () => {
    if (selectedSlot === null) return;

    removeSlot(selectedSlot);
    setSelectedSlot(null);
  };

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
        <div className="bg-secondary relative flex h-150 items-center justify-center overflow-hidden rounded-xl border p-16 lg:col-span-3">
          <div className="absolute top-2 left-2">
            <Tabs
              value={mode}
              onValueChange={(value) => setMode(value as Mode)}
            >
              <TabsList className="bg-white">
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {mode === "edit" ? (
            <TemplateEditor
              layout={selectedLayout}
              slots={slots}
              onSlotsChange={setSlots}
              selectedSlot={selectedSlot}
              onSelectSlot={setSelectedSlot}
              backgroundImage={backgroundImage}
            />
          ) : (
            <TemplateCanvas
              template={{
                id: "",
                name: "",
                layout: {
                  format: "strip",
                  width: 0,
                  height: 0,
                },
                slots: [],
                backgroundImage: undefined,
              }}
            />
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
                  value={[selectedLayout.format]}
                  onValueChange={handleLayoutChange}
                >
                  {DEFAULT_LAYOUTS.map((layout) => (
                    <ToggleGroupItem
                      variant="outline"
                      key={layout.format}
                      value={layout.format}
                    >
                      {layout.format.charAt(0).toUpperCase() +
                        layout.format.slice(1)}
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
                    onClick={removeBackground}
                  >
                    Remove background
                  </Button>
                )}
              </div>

              {/* Selected Slot */}
              <div className="space-y-3 border-t pt-3">
                <p className="text-sm font-medium">Selected Slot</p>

                {selectedSlot !== null && slots[selectedSlot] ? (
                  <>
                    <p className="text-muted-foreground text-xs">
                      Slot {selectedSlot + 1} selected
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs">
                          Position X
                        </p>

                        <p className="text-sm font-medium">
                          {Math.round(slots[selectedSlot].x)} px
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs">
                          Position Y
                        </p>

                        <p className="text-sm font-medium">
                          {Math.round(slots[selectedSlot].y)} px
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs">Width</p>

                        <p className="text-sm font-medium">
                          {Math.round(slots[selectedSlot].w)} px
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs">Height</p>

                        <p className="text-sm font-medium">
                          {Math.round(slots[selectedSlot].h)} px
                        </p>
                      </div>
                    </div>

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

export default CustomTemplateEditor;
