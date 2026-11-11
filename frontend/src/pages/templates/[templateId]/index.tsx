import PageHeading from "@/components/shared/PageHeading";
import { Separator } from "@/components/ui/separator";

function TemplateDetailsPage() {
  return (
    <div className="space-y-4">
      <PageHeading
        eyebrow="Design Overview"
        title={"Template Name"}
        description="Preview your template and review its layout configuration."
        backTo="/templates"
        backLabel="Back to Templates"
      />

      <Separator />
    </div>
  );
}

export default TemplateDetailsPage;
