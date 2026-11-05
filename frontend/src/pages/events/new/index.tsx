import PageHeading from "@/components/shared/PageHeading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Link } from "react-router";

function CreateEventPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <PageHeading
          eyebrow="Workspace / Events / New"
          title="Create an event"
          description="Set up your event and preparte it for capturing memories."
        />

        <div className="space-x-2">
          <Button variant={"outline"} render={<Link to="/events" />}>
            Cancel
          </Button>
          <Button>Create event</Button>
        </div>
      </div>

      {/* Form */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Event Details</CardTitle>
            <CardDescription>
              Give your event a name and add the basic details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <FieldGroup className="grid grid-cols-3">
                <Field>
                  <FieldLabel htmlFor="name">Event Name</FieldLabel>
                  <Input id="name" placeholder="" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="eventDate">Date</FieldLabel>
                  <Input id="eventDate" type="date" placeholder="" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="venue">Venue</FieldLabel>
                  <Input id="venue" placeholder="" required />
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* Custom Layouts */}
      <section className="space-y-4">
        {/* Section Heading */}
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Layout</h3>
          <p className="text-muted-foreground text-sm">
            Upload your background and arrange your photo slots. Drag to move
            and resize them using the orange handle.
          </p>
        </div>

        {/* Editor */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          {/* Canvas */}
          <div className="bg-secondary flex min-h-150 items-center justify-center rounded-xl border lg:col-span-3">
            {/* Custom template canvas */}
            <p className="text-muted-foreground text-sm">Template canvas</p>
          </div>

          {/* Settings Panel */}
          <aside className="col-span-1">
            <Card className="h-full py-4">
              <CardContent className="space-y-4 px-4">
                {/* Settings */}
                <div className="space-y-1 border-b pb-1">
                  <p className="font-semibold">Settings</p>
                  <p className="text-muted-foreground text-xs">
                    Configure your template layout.
                  </p>
                </div>

                {/* Print Format */}
                <div className="space-y-3">
                  <p className="text-sm font-medium">Print Format</p>
                  <div>
                    <ToggleGroup>
                      <ToggleGroupItem variant="outline">Strip</ToggleGroupItem>
                      <ToggleGroupItem variant="outline">
                        Landscape
                      </ToggleGroupItem>
                      <ToggleGroupItem variant="outline">
                        Portrait
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </div>

                {/* Photo Slots */}
                <div className="space-y-3">
                  <p className="text-sm font-medium">Photo Slots</p>
                  <div>
                    <ToggleGroup className={"grid w-full grid-cols-4"}>
                      <ToggleGroupItem variant="outline">1</ToggleGroupItem>
                      <ToggleGroupItem variant="outline">2</ToggleGroupItem>
                      <ToggleGroupItem variant="outline">3</ToggleGroupItem>
                      <ToggleGroupItem variant="outline">4</ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </div>

                {/* Background */}
                <div className="space-y-3">
                  <p className="text-sm font-medium">Background</p>
                  <div className="bg-secondary border-border h-12 rounded-lg border-2 border-dashed">
                    {/* Background controls */}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium">Selected slot</p>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default CreateEventPage;
