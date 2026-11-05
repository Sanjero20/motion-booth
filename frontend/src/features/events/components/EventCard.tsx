import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { Link } from "react-router";

import type { Event } from "@/features/events/types/event";

interface Props {
  event: Event;
}

function EventCard({ event }: Props) {
  const date = new Date(event.eventDate);

  const month = date.toLocaleDateString("en-US", {
    month: "short",
  });

  const day = date.getDate();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Event information */}
      <div className="flex items-center gap-4">
        {/* Date */}
        <div className="font-display bg-muted flex aspect-square min-w-16 flex-col items-center justify-center rounded-lg">
          <span className="text-muted-foreground text-xs font-medium uppercase">
            {month}
          </span>
          <span className="text-2xl font-bold">{day}</span>
        </div>

        {/* Details */}
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold">{event.name}</p>
          <p className="text-muted-foreground text-sm">Classic Film Template</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:shrink-0">
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link to={`/events/${event.id}`} />}
        >
          Manage
        </Button>

        <Button nativeButton={false} render={<Link to={"/booth"} />}>
          <Camera size={16} />
          Launch
        </Button>
      </div>
    </div>
  );
}

export default EventCard;
