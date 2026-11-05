import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

function EventTemplateCustomizer() {
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
        <div className="bg-secondary flex min-h-150 items-center justify-center rounded-xl border lg:col-span-3">
          <p className="text-muted-foreground text-sm">Template canvas</p>
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

                <ToggleGroup>
                  <ToggleGroupItem variant="outline" value="strip">
                    Strip
                  </ToggleGroupItem>
                  <ToggleGroupItem variant="outline" value="landscape">
                    Landscape
                  </ToggleGroupItem>
                  <ToggleGroupItem variant="outline" value="portrait">
                    Portrait
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Photo Slots */}
              <div className="space-y-3">
                <p className="text-sm font-medium">Photo Slots</p>

                <ToggleGroup className="grid w-full grid-cols-4">
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

                <div className="bg-secondary border-border h-12 rounded-lg border-2 border-dashed">
                  {/* Background controls */}
                </div>
              </div>

              {/* Selected Slot */}
              <div className="space-y-3">
                <p className="text-sm font-medium">Selected slot</p>
                {/* Selected slot controls */}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </section>
  );
}

export default EventTemplateCustomizer;
