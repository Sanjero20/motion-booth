import { useState } from "react";
import { useNavigate } from "react-router";
import { useCreateTemplate } from "@/features/templates/hooks/useCreateTemplate";

import TemplateFormHeader from "@/features/templates/components/TemplateFormHeader";
import CustomTemplateEditor from "@/features/templates/components/CustomTemplateEditor";
import CustomTemplateViewer from "@/features/templates/components/CustomTemplateViewer";

import useTemplateEditor from "@/features/templates/hooks/useTemplateEditor";

import type { CreateTemplateRequest } from "@/features/templates/types/template";
import type { TemplateFormMode } from "@/features/templates/types/form-mode";
import TemplateDetails from "@/features/templates/components/TemplateDetails";

function CreateTemplatePage() {
  const navigate = useNavigate();
  const mutation = useCreateTemplate();

  const [mode, setMode] = useState<TemplateFormMode>("edit");

  const templateEditor = useTemplateEditor();

  const handleSubmit = () => {
    const { name, selectedLayout, slots, backgroundImage } = templateEditor;

    const template: CreateTemplateRequest = {
      name,
      layout: selectedLayout,
      slots: slots,
      backgroundImage: backgroundImage,
    };

    mutation.mutate(template, {
      onSuccess: () => {
        navigate("/templates");
      },
    });
  };

  return (
    <div className="space-y-4">
      <TemplateFormHeader
        mode={mode}
        isEditing={false}
        isSubmitting={false}
        onCancel={() => navigate(`/templates`)}
        onChangeMode={setMode}
        onSubmit={handleSubmit}
      />

      <TemplateDetails
        name={templateEditor.name}
        setName={templateEditor.setName}
      />

      {mode == "edit" ? (
        <CustomTemplateEditor {...templateEditor} />
      ) : (
        <CustomTemplateViewer
          template={{
            id: templateEditor.selectedLayout.format,
            name: templateEditor.selectedLayout.format,
            layout: templateEditor.selectedLayout,
            slots: templateEditor.slots,
            backgroundImage: templateEditor.backgroundImage,
          }}
        />
      )}
    </div>
  );
}

export default CreateTemplatePage;
