import PageHeading from "@/components/shared/PageHeading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import EventTemplateCustomizer from "@/features/events/components/EventTemplateCustomizer";
import { Link } from "react-router";

function CreateTemplatePage() {
  return (
    <div className="space-y-4">
      <section className="flex items-end justify-between gap-4">
        <PageHeading
          eyebrow="New Design"
          title="Create Template"
          description="Design and customize a photo booth layout for your events."
        />

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link to="/templates" />}
          >
            Cancel
          </Button>
          <Button>Create template</Button>
        </div>
      </section>

      <Separator />

      <EventTemplateCustomizer />
    </div>
  );
}

export default CreateTemplatePage;
