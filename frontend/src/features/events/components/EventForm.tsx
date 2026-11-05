import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface Props {
  name: string;
  eventDate: string;
  onNameChange: (value: string) => void;
  onEventDateChange: (value: string) => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
}

function EventForm({
  name,
  eventDate,
  onNameChange,
  onEventDateChange,
  onSubmit,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Event Details</CardTitle>
        <CardDescription>
          Give your event a name and add the basic details.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="event-form" onSubmit={onSubmit}>
          <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="name">Event Name</FieldLabel>
              <Input
                id="name"
                placeholder="e.g. Sarah & John's Wedding"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                required
                maxLength={100}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="eventDate">Date</FieldLabel>
              <Input
                id="eventDate"
                type="date"
                value={eventDate}
                onChange={(e) => onEventDateChange(e.target.value)}
                required
              />
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

export default EventForm;
