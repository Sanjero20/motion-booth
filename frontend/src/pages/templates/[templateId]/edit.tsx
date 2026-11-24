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
import { useUpdateTemplate } from "@/features/templates/hooks/useUpdateTemplate";
import TemplateDetails from "@/features/templates/components/TemplateDetails";

function EditTemplatePage() {
  const [mode, setMode] = useState<TemplateFormMode>("edit");
  const { templateId } = useParams();
  const navigate = useNavigate();

  const { data: template, isLoading } = useTemplate(templateId!);
  const updateMutation = useUpdateTemplate();
  const deleteMutation = useDeleteTemplate();

  const templateEditor = useTemplateEditor(template, template?.id);

  const handleSubmit = () => {
    if (!template) return;

    const {
      name,
      selectedLayout,
      slots,
      backgroundImageFile,
      removeBackgroundImage,
    } = templateEditor;

    updateMutation.mutate(
      {
        id: template.id,
        data: {
          name,
          layout: selectedLayout,
          slots,
          backgroundImageFile,
          removeBackgroundImage,
        },
      },
      {
        onSuccess: () => {
          navigate(`/templates/${templateId}`);
        },
      },
    );
  };

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
        isSubmitting={updateMutation.isPending}
        onCancel={() => navigate(`/templates/${template.id}`)}
        onChangeMode={setMode}
        onSubmit={handleSubmit}
      />
      <Separator />

      {mode === "edit" ? (
        <>
          <TemplateDetails
            name={templateEditor.name}
            setName={templateEditor.setName}
          />

          <CustomTemplateEditor {...templateEditor} />

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
            id: template.id,
            name: templateEditor.name,
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
