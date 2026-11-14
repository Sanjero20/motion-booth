import PageHeading from "@/components/shared/PageHeading";
import { Button } from "@/components/ui/button";
import type { TemplateFormMode } from "../types/form-mode";

interface Props {
  mode: TemplateFormMode;
  isEditing: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onChangeMode: (mode: TemplateFormMode) => void;
  onSubmit: () => void;
}

function TemplateFormHeader({
  mode,
  isEditing,
  isSubmitting,
  onCancel,
  onChangeMode,
  onSubmit,
}: Props) {
  return (
    <div className="flex items-end justify-between gap-4">
      <PageHeading
        eyebrow={isEditing ? "Template Settings" : "New Design"}
        title={isEditing ? "Edit Template" : "Create Template"}
        description="Design and customize a photo booth layout for your events."
      />

      {mode == "edit" ? (
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>

          <Button variant="outline" onClick={() => onChangeMode("test")}>
            Test Template
          </Button>

          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Save changes"
                : "Create event"}
          </Button>
        </div>
      ) : (
        <Button variant="outline" onClick={() => onChangeMode("edit")}>
          Back to editing
        </Button>
      )}
    </div>
  );
}

export default TemplateFormHeader;
