import PageHeading from "@/components/shared/PageHeading";
import { Separator } from "@/components/ui/separator";

function CreateTemplatePage() {
  return (
    <div className="space-y-4">
      <PageHeading
        eyebrow="New Design"
        title="Create Template"
        description="Design and customize a photo booth layout for your events."
        backTo="/templates"
        backLabel="Back to Templates"
      />

      <Separator />
    </div>
  );
}

export default CreateTemplatePage;
