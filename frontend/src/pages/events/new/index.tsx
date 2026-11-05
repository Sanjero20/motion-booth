import PageHeading from "@/components/shared/PageHeading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

function CreateEventPage() {
  return (
    <div className="space-y-4">
      <PageHeading
        eyebrow="Workspace / Events / New"
        title="Create an event"
        description="Set up your event and preparte it for capturing memories."
      />

      {/* Form */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Event Details</CardTitle>
            <CardDescription>
              Give your event a name and add the basic details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <FieldGroup className="grid grid-cols-3">
                <Field>
                  <FieldLabel htmlFor="name">Event Name</FieldLabel>
                  <Input id="name" placeholder="" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="eventDate">Date</FieldLabel>
                  <Input id="eventDate" type="date" placeholder="" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="venue">Venue</FieldLabel>
                  <Input id="venue" placeholder="" required />
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default CreateEventPage;
