import TemplateCanvas from "@/components/shared/TemplateCanvas";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { templates } from "@/data/templates";

const TEMPLATE_DESCRIPTIONS: Record<string, string> = {
  "classic-strip": "4 frames, tall print strip",
  grid: "4 × 6 landscape print with four frames",
  single: "One large photo, ready to share",
};

function Templates() {
  return (
    <section id="templates" className="bg-secondary px-4 py-20 md:px-0">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <SectionHeading
          eyebrow="Templates"
          title="Three ways to frame the moment."
          body="Every template brings your captured moments together in a finished design, ready to save and share."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <CardContent className="flex h-full flex-col gap-4 p-5">
                <div className="bg-background flex h-72 items-center justify-center overflow-hidden rounded-lg p-4">
                  <div className="flex h-full w-full items-center justify-center">
                    <TemplateCanvas
                      template={template}
                      className="max-h-full max-w-full shadow-lg"
                    />
                  </div>
                </div>

                <div>
                  <p className="text-lg font-bold">{template.name}</p>
                  <span className="text-muted-foreground text-sm">
                    {TEMPLATE_DESCRIPTIONS[template.id]}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Templates;
