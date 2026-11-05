/* eslint-disable react-hooks/set-state-in-effect */
import { useNavigate, useParams } from "react-router";
import { useEvent } from "@/features/events/hooks/useEvent";
import { useUpdateEvent } from "@/features/events/hooks/useUpdateEvent";
import EventFormHeader from "@/features/events/components/EventFormHeader";
import EventForm from "@/features/events/components/EventForm";
import EventTemplateCustomizer from "@/features/events/components/EventTemplateCustomizer";
import { useEffect, useState } from "react";

function EditEventPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const { data: event, isLoading } = useEvent(eventId!);
  const mutation = useUpdateEvent();

  const [name, setName] = useState("");
  const [eventDate, setEventDate] = useState("");

  useEffect(() => {
    if (event) {
      setName(event.name);
      setEventDate(event.eventDate);
    }
  }, [event]);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!eventId) return;

    const eventDateTime = new Date(`${eventDate}T00:00:00`).toISOString();

    mutation.mutate(
      {
        id: eventId,
        data: {
          name: name.trim(),
          eventDate: eventDateTime,
        },
      },
      {
        onSuccess: () => {
          navigate(`/events/${eventId}`);
        },
      },
    );
  };

  if (isLoading) return <div>Loading event...</div>;
  if (!event) return <div>Event not found.</div>;

  return (
    <div className="space-y-4">
      <EventFormHeader
        isEditing={true}
        isSubmitting={mutation.isPending}
        onCancel={() => navigate(`/events/${event.id}`)}
      />

      <EventForm
        name={name}
        eventDate={eventDate}
        onNameChange={setName}
        onEventDateChange={setEventDate}
        onSubmit={handleSubmit}
      />

      <EventTemplateCustomizer />
    </div>
  );
}

export default EditEventPage;
