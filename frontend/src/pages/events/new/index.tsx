import { useState } from "react";
import { useNavigate } from "react-router";
import { Separator } from "@/components/ui/separator";

import EventFormHeader from "@/features/events/components/EventFormHeader";
import EventForm from "@/features/events/components/EventForm";
import CustomTemplateEditor from "@/features/templates/components/CustomTemplateEditor";
import TemplateSourcePicker from "@/features/templates/components/TemplateSourcePicker";
import EventTemplatePicker from "@/features/templates/components/EventTemplatePicker";

import useTemplateEditor from "@/features/templates/hooks/useTemplateEditor";
import { useTemplates } from "@/features/templates/hooks/useTemplates";
import { useCreateEvent } from "@/features/events/hooks/useCreateEvent";

import type { EventTemplate } from "@/features/templates/types/template";

function CreateEventPage() {
  const navigate = useNavigate();
  const mutation = useCreateEvent();

  const { data: templates, isLoading, isError } = useTemplates();

  const [source, setSource] = useState(["scratch"]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  );

  const [name, setName] = useState("");
  const [eventDate, setEventDate] = useState("");

  const selectedTemplate = templates?.find(
    (template) => template.id === selectedTemplateId,
  );

  const templateEditor = useTemplateEditor(
    selectedTemplate,
    source[0] === "existing"
      ? (selectedTemplateId ?? "existing-empty")
      : "scratch",
  );

  function handleSourceChange(value: string[]) {
    if (!value.length) return;

    setSource(value);

    if (value[0] === "scratch") {
      setSelectedTemplateId(null);
    }
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const template: EventTemplate = {
      layout: { ...templateEditor.selectedLayout },
      slots: templateEditor.slots.map((slot) => ({ ...slot })),
      backgroundImage: templateEditor.backgroundImage,
    };

    mutation.mutate(
      {
        name: name.trim(),
        template,
        eventDate,
      },
      {
        onSuccess: () => navigate("/events"),
      },
    );
  }

  return (
    <div className="space-y-6">
      <EventFormHeader
        isEditing={false}
        isSubmitting={mutation.isPending}
        onCancel={() => navigate("/events")}
      />

      {/* Event Details */}
      <EventForm
        name={name}
        eventDate={eventDate}
        onNameChange={setName}
        onEventDateChange={setEventDate}
        onSubmit={handleSubmit}
      />

      <Separator />

      <TemplateSourcePicker value={source} onChange={handleSourceChange} />

      {source[0] === "existing" && (
        <div className="space-y-3">
          {isLoading ? (
            <p className="text-muted-foreground text-sm">
              Loading templates...
            </p>
          ) : isError ? (
            <p className="text-destructive text-sm">
              Failed to load templates. Please try again.
            </p>
          ) : templates?.length ? (
            <EventTemplatePicker
              templates={templates}
              value={selectedTemplateId ? [selectedTemplateId] : []}
              onChange={(value) => setSelectedTemplateId(value[0] ?? null)}
            />
          ) : (
            <p className="text-muted-foreground text-sm">
              You don't have any saved templates yet.
            </p>
          )}
        </div>
      )}

      {(source[0] === "scratch" || selectedTemplate) && (
        <CustomTemplateEditor {...templateEditor} />
      )}
    </div>
  );
}

export default CreateEventPage;
