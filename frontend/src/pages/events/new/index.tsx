import { useState } from "react";
import { useNavigate } from "react-router";
import { useCreateEvent } from "@/features/events/hooks/useCreateEvent";

import EventFormHeader from "@/features/events/components/EventFormHeader";
import EventForm from "@/features/events/components/EventForm";

function CreateEventPage() {
  const navigate = useNavigate();
  const mutation = useCreateEvent();

  const [name, setName] = useState("");
  const [eventDate, setEventDate] = useState("");

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
    </div>
  );
}

export default CreateEventPage;
