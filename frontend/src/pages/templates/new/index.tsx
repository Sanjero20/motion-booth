import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCreateTemplate } from "@/features/templates/hooks/useCreateTemplate";

import PageHeading from "@/components/shared/PageHeading";
import CustomTemplateEditor from "@/features/templates/components/CustomTemplateEditor";
import CustomTemplateViewer from "@/features/templates/components/CustomTemplateViewer";

import useTemplateEditor from "@/features/templates/hooks/useTemplateEditor";
import type { CreateTemplateRequest } from "@/features/templates/types/template";

type Mode = "edit" | "test";

function CreateTemplatePage() {
  const navigate = useNavigate();
  const mutation = useCreateTemplate();

  const [mode, setMode] = useState<Mode>("edit");

  const templateEditor = useTemplateEditor();

  const handleSubmit = () => {
    const { selectedLayout, slots, backgroundImage } = templateEditor;

    const template: CreateTemplateRequest = {
      name: selectedLayout.format,
      layout: selectedLayout,
      slots: slots,
      backgroundImage: backgroundImage,
    };

    console.log("submit", template);

    mutation.mutate(template, {
      onSuccess: () => {
        navigate("/templates");
      },
    });
  };

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
            <Button onClick={handleSubmit}>Create template</Button>
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
          template={{
            id: "",
            name: "",
            layout: {
              format: "strip",
              width: 0,
              height: 0,
            },
            slots: [],
            backgroundImage: undefined,
          }}
        />
      )}
    </div>
  );
}

export default CreateTemplatePage;
