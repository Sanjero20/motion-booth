import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Separator } from "@/components/ui/separator";

import TemplateFormHeader from "@/features/templates/components/TemplateFormHeader";
import CustomTemplateEditor from "@/features/templates/components/CustomTemplateEditor";
import CustomTemplateViewer from "@/features/templates/components/CustomTemplateViewer";
import DangerZone from "@/components/shared/DangerZone";

import { useTemplate } from "@/features/templates/hooks/useTemplate";
import { useDeleteTemplate } from "@/features/templates/hooks/useDeleteTemplate";
import useTemplateEditor from "@/features/templates/hooks/useTemplateEditor";

import type { TemplateFormMode } from "@/features/templates/types/form-mode";

function EditTemplatePage() {
  const [mode, setMode] = useState<TemplateFormMode>("edit");
  const { templateId } = useParams();
  const navigate = useNavigate();

  const { data: template, isLoading } = useTemplate(templateId!);
  const deleteMutation = useDeleteTemplate();

  const templateEditor = useTemplateEditor(template);

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
      <TemplateFormHeader
        mode={mode}
        isEditing={true}
        isSubmitting={false}
        onCancel={() => navigate(`/templates/${template.id}`)}
        onChangeMode={setMode}
        onSubmit={() => {}}
      />

      <Separator />

      {mode === "edit" ? (
        <>
          <CustomTemplateEditor {...templateEditor} />

          <Separator />

          <DangerZone
            resourceName="template"
            description="Permanently delete this template. This action cannot be undone."
            isDeleting={deleteMutation.isPending}
            onConfirm={handleDelete}
          />
        </>
      ) : (
        <CustomTemplateViewer
          template={{
            id: "",
            name: "Untitled Template",
            layout: templateEditor.selectedLayout,
            slots: templateEditor.slots,
            backgroundImage: templateEditor.backgroundImage,
          }}
        />
      )}
    </div>
  );
}

export default EditTemplatePage;
