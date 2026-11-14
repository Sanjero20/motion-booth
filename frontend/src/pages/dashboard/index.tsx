import {
  ArrowRight,
  Calendar,
  Camera,
  Images,
  LayoutTemplate,
} from "lucide-react";
import { Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { templates } from "@/data/templates";
import MetricCard from "@/components/shared/MetricCard";
import PageHeading from "@/components/shared/PageHeading";
import TemplateCanvas from "@/components/shared/TemplateCanvas";
import EventCard from "@/features/events/components/EventCard";
import type { Event } from "@/features/events/types/event";

const upcomingEvents: Event[] = [
  {
    id: "event-1",
    name: "Sarah & James Wedding",
    eventDate: "2026-11-11",
    createdAt: "2026-11-04",
  },
  {
    id: "event-2",
    name: "Alex's 18th Birthday",
    eventDate: "2026-11-21",
    createdAt: "2026-11-04",
  },
];

function DashboardPage() {
  return (
    <div className="space-y-4">
      <PageHeading
        eyebrow={"Dashboard"}
        title={"Hi, there!"}
        description="Your events, sessions and prints at a glance."
      />

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Upcoming events"
          icon={Calendar}
          value={0}
          description="Next event in 0 days"
        />
        <MetricCard
          title="Sessions"
          icon={Camera}
          value={0}
          description="Across all events"
        />
        <MetricCard
          title="Templates"
          icon={LayoutTemplate}
          value={0}
          description="Your saved designs"
        />
        <MetricCard
          title="Exports"
          icon={Images}
          value={0}
          description="Photos and videos saved"
        />
      </section>

      {/* Upcoming Events */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Upcoming events</h3>

          <Link
            to="/events"
            className="text-muted-foreground hover:text-primary flex items-center gap-1 text-sm transition-colors"
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        <Card>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Recent Sessions */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h3 className="text-base font-semibold">Recent sessions</h3>
          <Link
            to="/events"
            className="text-muted-foreground hover:text-primary flex items-center gap-1 text-sm transition-colors"
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card className="aspect-4/3 w-full">
            <div className="flex h-full w-full justify-center">
              <TemplateCanvas template={templates[0]} className="border" />
            </div>
          </Card>

          <Card className="aspect-4/3 w-full">
            <div className="flex h-full w-full justify-center">
              <TemplateCanvas template={templates[1]} className="border" />
            </div>
          </Card>

          <Card className="aspect-4/3 w-full">
            <div className="flex h-full w-full justify-center">
              <TemplateCanvas template={templates[2]} className="border" />
            </div>
          </Card>

          <Card className="aspect-4/3 w-full">
            <div className="flex h-full w-full justify-center">
              <TemplateCanvas template={templates[1]} className="border" />
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
