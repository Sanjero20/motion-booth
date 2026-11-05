import MetricCard from "@/components/shared/MetricCard";
import PageHeading from "@/components/shared/PageHeading";
import { useEvents } from "@/features/events/hooks/useEvents";

function EventsPage() {
  const { data: events, isLoading } = useEvents();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <PageHeading
        eyebrow="Workspace"
        title="Your Events"
        description="Manage your events and keep track of every booth sessions."
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title={"Events"} value={0} />
        <MetricCard title={"Upcoming"} value={0} />
        <MetricCard title={"Photos Taken"} value={0} />
        <MetricCard title={"Avg photos per event"} value={0} />
      </section>

      {events?.map((event) => (
        <div key={event.id}>
          <p>{event.name}</p>
          <p>{event.eventDate}</p>
        </div>
      ))}
    </div>
  );
}

export default EventsPage;
