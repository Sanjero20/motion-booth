/* eslint-disable react-hooks/set-state-in-effect */

import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useEvent } from "@/features/events/hooks/useEvent";
import { useUpdateEvent } from "@/features/events/hooks/useUpdateEvent";

import EventFormHeader from "@/features/events/components/EventFormHeader";
import EventForm from "@/features/events/components/EventForm";
import EventTemplateCustomizer from "@/features/events/components/EventTemplateCustomizer";
import DeleteConfirmationDialog from "@/components/shared/dialog/DeleteConfirmationDialog";

import { useDeleteEvent } from "@/features/events/hooks/useDeleteEvent";

function EditEventPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const { data: event, isLoading } = useEvent(eventId!);
  const updateMutation = useUpdateEvent();
  const deleteMutation = useDeleteEvent();

  const [name, setName] = useState("");
  const [eventDate, setEventDate] = useState("");

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

      <EventTemplateCustomizer />

      <Separator />

      <section className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Danger Zone</h3>
          <p className="text-muted-foreground text-sm">
            Permanently delete this event and its associated data. This action
            cannot be undone.
          </p>
        </div>

        <Button
          variant="destructive"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          <Trash />
          Delete Event
        </Button>
      </section>

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Event?"
        description="Are you sure you want to delete this event? This action cannot be undone."
        confirmLabel="Delete"
        isDeleting={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default EditEventPage;
