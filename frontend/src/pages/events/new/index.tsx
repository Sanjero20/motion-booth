import { useState } from "react";
import { useNavigate } from "react-router";
import { useCreateEvent } from "@/features/events/hooks/useCreateEvent";

import EventFormHeader from "@/features/events/components/EventFormHeader";
import EventForm from "@/features/events/components/EventForm";
import CustomTemplateEditor from "@/features/templates/components/CustomTemplateEditor";
import useTemplateEditor from "@/features/templates/hooks/useTemplateEditor";

function CreateEventPage() {
  const navigate = useNavigate();
  const mutation = useCreateEvent();

  const [name, setName] = useState("");
  const [eventDate, setEventDate] = useState("");

  const templateEditor = useTemplateEditor();

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    mutation.mutate(
      {
        name: name.trim(),
        eventDate,
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

      <CustomTemplateEditor {...templateEditor} />
    </div>
  );
}

export default CreateEventPage;
