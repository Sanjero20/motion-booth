import { useState } from "react";
import { Link, useParams } from "react-router";
import { Camera, Edit, Eye } from "lucide-react";

import PageHeading from "@/components/shared/PageHeading";
import TemplateCanvas from "@/components/shared/TemplateCanvas";
import CustomTemplateViewer from "@/features/templates/components/CustomTemplateViewer";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { useTemplate } from "@/features/templates/hooks/useTemplate";

function TemplateDetailsPage() {
  const [isTestMode, setIsTestMode] = useState(false);

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

          <Button
            variant={isTestMode ? "outline" : "default"}
            onClick={() => setIsTestMode((prev) => !prev)}
          >
            {isTestMode ? <Eye size={16} /> : <Camera size={16} />}
            {isTestMode ? "Preview Template" : "Test Template"}
          </Button>
        </div>
      </section>

      <Separator />

      {isTestMode ? (
        <CustomTemplateViewer template={template} />
      ) : (
        <section className="bg-secondary flex h-125 items-center justify-center p-8">
          <TemplateCanvas template={template} />
        </section>
      )}
    </div>
  );
}

export default TemplateDetailsPage;
