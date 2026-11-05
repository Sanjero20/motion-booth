import { useState } from "react";
import { useNavigate, Link } from "react-router";

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

import { useCreateEvent } from "@/features/events/hooks/useCreateEvent";

function CreateEventPage() {
  const navigate = useNavigate();
  const mutation = useCreateEvent();

  const [name, setName] = useState("");
  const [eventDate, setEventDate] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const eventDateTime = new Date(`${eventDate}T00:00:00`).toISOString();

    mutation.mutate(
      {
        name: name.trim(),
        eventDate: eventDateTime,
      },
      {
        onSuccess: () => {
          navigate("/events");
        },
      },
    );
  }

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex items-end justify-between">
        <PageHeading
          eyebrow="Workspace / Events / New"
          title="Create an event"
          description="Set up your event and prepare it for capturing memories."
        />

        <div className="flex gap-2">
          <Button variant="outline" render={<Link to="/events" />}>
            Cancel
          </Button>

          <Button
            type="submit"
            form="create-event-form"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating..." : "Create event"}
          </Button>
        </div>
      </div>

      {/* Event Details */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Event Details</CardTitle>
            <CardDescription>
              Give your event a name and add the basic details.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form id="create-event-form" onSubmit={handleSubmit}>
              <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="name">Event Name</FieldLabel>
                  <Input
                    id="name"
                    placeholder="e.g. Sarah & John's Wedding"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={100}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="eventDate">Date</FieldLabel>
                  <Input
                    id="eventDate"
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                  />
                </Field>
              </FieldGroup>
            </form>

            {mutation.isError && (
              <p className="text-destructive mt-4 text-sm" role="alert">
                Failed to create event. Please try again.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Custom Layouts */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Layout</h3>
          <p className="text-muted-foreground text-sm">
            Upload your background and arrange your photo slots. Drag to move
            and resize them using the orange handle.
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
    </div>
  );
}

export default CreateEventPage;
