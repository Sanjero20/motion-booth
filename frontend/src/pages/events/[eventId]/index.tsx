import PageHeading from "@/components/shared/PageHeading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEvent } from "@/features/events/hooks/useEvent";
import { Camera, Settings } from "lucide-react";
import { useParams } from "react-router";

function EventDetailsPage() {
  const { eventId } = useParams();

  const { data: event } = useEvent(eventId!);

  if (!event) {
    return <></>;
  }

  return (
    <div className="space-y-4">
      <section className="flex items-end justify-between">
        <PageHeading eyebrow={"Event Overview"} title={event?.name} />

        <div className="space-x-2">
          <Button variant="outline">
            <Settings size={16} />
            Settings
          </Button>
          <Button>
            <Camera />
            Launch
          </Button>
        </div>
      </section>

      <Separator />

      {/* Template View */}
      <section>
        <div className="grid grid-cols-4">
          <div className="bg-secondary border-border col-span-3 aspect-4/3 rounded-lg border"></div>
          <aside></aside>
        </div>
      </section>
    </div>
  );
}

export default EventDetailsPage;
