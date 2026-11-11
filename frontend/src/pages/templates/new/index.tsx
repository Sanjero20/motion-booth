import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import PageHeading from "@/components/shared/PageHeading";
import CustomTemplateEditor from "@/features/templates/components/CustomTemplateEditor";
import CustomTemplateViewer from "@/features/templates/components/CustomTemplateViewer";

import useTemplateEditor from "@/features/templates/hooks/useTemplateEditor";

type Mode = "edit" | "test";

function CreateTemplatePage() {
  const [mode, setMode] = useState<Mode>("edit");

  const templateEditor = useTemplateEditor();

  return (
    <div className="space-y-4">
      <section className="flex items-end justify-between gap-4">
        <PageHeading
          eyebrow="New Design"
          title="Create Template"
          description="Design and customize a photo booth layout for your events."
        />

        {mode === "edit" ? (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link to="/templates" />}
            >
              Cancel
            </Button>
            <Button variant="outline" onClick={() => setMode("test")}>
              Test template
            </Button>
            <Button>Create template</Button>
          </div>
        ) : (
          <Button variant="outline" onClick={() => setMode("edit")}>
            Back to editing
          </Button>
        )}
      </section>

      <Separator />

      {mode == "edit" ? (
        <CustomTemplateEditor {...templateEditor} />
      ) : (
        <CustomTemplateViewer
          layout={templateEditor.selectedLayout}
          slots={templateEditor.slots}
          backgroundImage={templateEditor.backgroundImage}
        />
      )}
    </div>
  );
}

export default CreateTemplatePage;
