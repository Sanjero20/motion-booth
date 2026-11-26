import PhotoBooth from "@/features/booth/components/PhotoBooth";
import { useEvent } from "@/features/events/hooks/useEvent";
import type { Template } from "@/features/templates/types/template";
import { useParams } from "react-router";

function EventBoothPage() {
  const { eventId } = useParams();

  const { data: event, isLoading } = useEvent(eventId!);

  if (isLoading) {
    return <>Loading...</>;
  }

  if (!event) {
    return <>Event not found</>;
  }
  const template: Template = {
    id: event.id,
    name: event.name,
    layout: event.template.layout,
    slots: event.template.slots,
    backgroundImage: event.template.backgroundImage,
  };

  return <PhotoBooth template={template} backgroundSource="event" />;
}

export default EventBoothPage;
