/* eslint-disable react-hooks/set-state-in-effect */

import { Separator } from "@/components/ui/separator";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useEvent } from "@/features/events/hooks/useEvent";
import { useUpdateEvent } from "@/features/events/hooks/useUpdateEvent";
import { useDeleteEvent } from "@/features/events/hooks/useDeleteEvent";

import EventFormHeader from "@/features/events/components/EventFormHeader";
import EventForm from "@/features/events/components/EventForm";

import CustomTemplateEditor from "@/features/templates/components/CustomTemplateEditor";
import useTemplateEditor from "@/features/templates/hooks/useTemplateEditor";

import DangerZone from "@/components/shared/DangerZone";

function EditEventPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const { data: event, isLoading } = useEvent(eventId!);
  const updateMutation = useUpdateEvent();
  const deleteMutation = useDeleteEvent();

  const templateEditor = useTemplateEditor();

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

    updateMutation.mutate(
      {
        id: eventId,
        data: {
          name: name.trim(),
          eventDate,
        },
      },
      {
        onSuccess: () => {
          navigate(`/events/${eventId}`);
        },
      },
    );
  };

  const handleDelete = () => {
    if (!eventId) return;

    deleteMutation.mutate(eventId, {
      onSuccess: () => {
        navigate("/events");
      },
    });
  };

  if (isLoading) return <div>Loading event...</div>;
  if (!event) return <div>Event not found.</div>;

  return (
    <div className="space-y-4">
      <EventFormHeader
        isEditing={true}
        isSubmitting={updateMutation.isPending}
        onCancel={() => navigate(`/events/${event.id}`)}
      />

      <EventForm
        name={name}
        eventDate={eventDate}
        onNameChange={setName}
        onEventDateChange={setEventDate}
        onSubmit={handleSubmit}
      />

      <CustomTemplateEditor {...templateEditor} />

      <Separator />

      <DangerZone
        resourceName="Event"
        description="Permanently delete this event and its associated data. This action cannot be undone."
        isDeleting={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default EditEventPage;
