import { Link } from "react-router";
import { CalendarPlus, Plus } from "lucide-react";

import MetricCard from "@/components/shared/MetricCard";
import PageHeading from "@/components/shared/PageHeading";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEvents } from "@/features/events/hooks/useEvents";
import { Button } from "@/components/ui/button";
import EventCard from "@/features/events/components/EventCard";

function EventsPage() {
  const { data: events = [], isLoading } = useEvents();

  if (isLoading) {
    return <div>Loading events...</div>;
  }

  const hasEvents = events.length > 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <div className="flex items-end justify-between">
        <PageHeading
          eyebrow="Workspace"
          title="Your Events"
          description="Manage your events and keep track of every booth session."
        />

        <Button nativeButton={false} render={<Link to="/events/new" />}>
          Create event
        </Button>
      </div>

      <section className="grid shrink-0 grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard title="Events" value={events.length} />
        <MetricCard title="Upcoming" value={0} />
        <MetricCard title="Photos Taken" value={0} />
        <MetricCard title="Avg. Photos per Event" value={0} />
      </section>

      {hasEvents ? (
        <section className="flex min-h-0 flex-1 flex-col">
          <Tabs defaultValue="all" className="flex min-h-0 flex-1 flex-col">
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <TabsList>
                <TabsTrigger value="all">All Events</TabsTrigger>
                <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="ended">Completed</TabsTrigger>
              </TabsList>

              <Input placeholder="Search events..." className="sm:max-w-xs" />
            </div>

            <Card className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden">
              <CardContent className="min-h-0 flex-1 overflow-y-auto">
                <TabsContent value="all" className="mt-0">
                  <div className="space-y-2">
                    {events.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="ongoing" className="mt-0">
                  Ongoing Events
                </TabsContent>

                <TabsContent value="upcoming" className="mt-0">
                  Upcoming Events
                </TabsContent>

                <TabsContent value="ended" className="mt-0">
                  Completed Events
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </section>
      ) : (
        <Card className="flex min-h-64 flex-1 items-center justify-center border-dashed">
          <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <div className="bg-primary/10 mb-5 flex size-16 items-center justify-center rounded-2xl">
              <CalendarPlus className="text-primary size-8" />
            </div>

            <h3 className="text-xl font-semibold">
              Your first event starts here
            </h3>

            <p className="text-muted-foreground mt-2 max-w-sm text-sm">
              Create an event for your next celebration, customize its booth
              experience, and start capturing memories.
            </p>

            <Link
              to="/events/new"
              className="bg-primary text-primary-foreground hover:bg-primary/90 mt-6 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              <Plus className="size-4" />
              Create your first event
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default EventsPage;
