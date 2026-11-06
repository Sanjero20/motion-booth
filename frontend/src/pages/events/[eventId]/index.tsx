import PageHeading from "@/components/shared/PageHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEvent } from "@/features/events/hooks/useEvent";
import {
  Camera,
  Edit,
  Calendar,
  MapPin,
  Images,
  Download,
  LayoutTemplate,
  Clock,
} from "lucide-react";
import { Link, useParams } from "react-router";

function EventDetailsPage() {
  const { eventId } = useParams();
  const { data: event, isLoading } = useEvent(eventId!);

  if (isLoading) return <div>Loading event...</div>;
  if (!event) return <div>Event not found.</div>;

  return (
    <div className="space-y-6">
      {/* Heading */}
      <section className="flex items-end justify-between">
        <PageHeading
          eyebrow="Event Overview"
          title={event.name}
          description="View your event information and manage its photo booth setup."
          backTo="/events"
          backLabel="Back to Events"
        />

        <div className="flex gap-2">
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link to={`/events/${event.id}/edit`} />}
          >
            <Edit size={16} />
            Edit
          </Button>

          <Button>
            <Camera size={16} />
            Launch Booth
          </Button>
        </div>
      </section>

      <Separator />

      {/* Template Preview */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Booth Template</h3>
          <p className="text-muted-foreground text-sm">
            Preview the layout currently assigned to this event.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          {/* Template Canvas */}
          <div className="bg-secondary flex min-h-125 items-center justify-center rounded-xl border lg:col-span-3">
            <div className="space-y-2 text-center">
              <LayoutTemplate className="text-muted-foreground mx-auto size-8" />
              <p className="text-muted-foreground text-sm">
                Template preview will appear here
              </p>
            </div>
          </div>

          {/* Event Information */}
          <aside>
            <Card className="h-full">
              <CardContent className="space-y-5">
                {/* Event Details */}
                <div className="space-y-3">
                  <h3 className="text-base font-bold">Event Details</h3>

                  <div className="flex items-start gap-3">
                    <Calendar className="text-muted-foreground mt-0.5 size-4" />
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">
                        Event date
                      </p>
                      <p className="text-sm font-medium">
                        {new Date(event.eventDate).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="text-muted-foreground mt-0.5 size-4" />
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">Venue</p>
                      <p className="text-sm font-medium">Not specified</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="text-muted-foreground mt-0.5 size-4" />
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">Schedule</p>
                      <p className="text-sm font-medium">Not specified</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Template Configuration */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Template Configuration</h3>

                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">
                      Print format
                    </p>
                    <p className="text-sm font-medium">2 × 6 inches</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Photo slots</p>
                    <p className="text-sm font-medium">4 frames</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>

      {/* Booth Activity */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Booth Activity</h3>
          <p className="text-muted-foreground text-sm">
            A summary of the memories captured at this event.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {[
            { label: "Sessions", value: "0", icon: Camera },
            { label: "Photos Captured", value: "0", icon: Images },
            { label: "Exports", value: "0", icon: Download },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="bg-primary/10 rounded-lg p-3">
                  <stat.icon className="text-primary size-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Sessions */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Recent Sessions</h3>
            <p className="text-muted-foreground text-sm">
              Recently captured booth sessions.
            </p>
          </div>

          <Button variant="outline" size="sm">
            View Gallery
          </Button>
        </div>

        <Card>
          <CardContent className="flex min-h-40 flex-col items-center justify-center gap-2 p-6 text-center">
            <Images className="text-muted-foreground size-8" />
            <p className="font-medium">No sessions yet</p>
            <p className="text-muted-foreground text-sm">
              Launch the booth to start capturing memories for this event.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default EventDetailsPage;
