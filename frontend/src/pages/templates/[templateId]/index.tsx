import { Link, useParams } from "react-router";
import PageHeading from "@/components/shared/PageHeading";
import TemplateCanvas from "@/components/shared/TemplateCanvas";
import { Separator } from "@/components/ui/separator";
import { useTemplate } from "@/features/templates/hooks/useTemplate";
import { Button } from "@/components/ui/button";
import { Camera, Edit } from "lucide-react";

function TemplateDetailsPage() {
  const { templateId } = useParams();
  const { data: template, isLoading } = useTemplate(templateId!);

  if (isLoading) return <div>Loading template...</div>;
  if (!template) return <div>Template not found.</div>;

  return (
    <div className="space-y-4">
      <section className="flex items-end justify-between">
        <PageHeading
          eyebrow="Design Overview"
          title={template.name}
          description="Preview your template and review its layout configuration."
          backTo="/templates"
          backLabel="Back to Templates"
        />

        <div className="flex gap-2">
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link to={`/templates/${template.id}/edit`} />}
          >
            <Edit size={16} />
            Edit
          </Button>

          <Button>
            <Camera size={16} />
            Test Template
          </Button>
        </div>
      </section>

      <Separator />

      <section className="bg-secondary flex h-125 items-center justify-center p-8">
        <TemplateCanvas layout={template} />
      </section>
    </div>
  );
}

export default TemplateDetailsPage;
