import { useEvents } from "@/features/events/hooks/useEvents";

function EventsPage() {
  const { data: events, isLoading } = useEvents();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h2>Events Page</h2>

      {events?.map((event) => (
        <div key={event.id}>
          <p>{event.name}</p>
          <p>{event.eventDate}</p>
        </div>
      ))}
    </>
  );
}

export default EventsPage;
