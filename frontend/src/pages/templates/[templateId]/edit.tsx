import { useNavigate, useParams } from "react-router";
import { Separator } from "@/components/ui/separator";

import PageHeading from "@/components/shared/PageHeading";
import DangerZone from "@/components/shared/DangerZone";

import { useTemplate } from "@/features/templates/hooks/useTemplate";
import { useDeleteTemplate } from "@/features/templates/hooks/useDeleteTemplate";

function EditTemplatePage() {
  const { templateId } = useParams();
  const navigate = useNavigate();

  const { data: template, isLoading } = useTemplate(templateId!);
  const deleteMutation = useDeleteTemplate();

  const handleDelete = () => {
    if (!templateId) return;

    deleteMutation.mutate(templateId, {
      onSuccess: () => {
        navigate("/templates");
      },
    });
  };

  if (isLoading) return <div>Loading template...</div>;
  if (!template) return <div>Template not found...</div>;

  return (
    <div className="space-y-4">
      <div>
        <PageHeading
          eyebrow="Template Settings"
          title="Edit Template"
          description="Design your photo layout and customize how your event photos are displayed."
        />
      </div>

      <Separator />

      <DangerZone
        resourceName="template"
        description="Permanently delete this template. This action cannot be undone."
        isDeleting={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default EditTemplatePage;
