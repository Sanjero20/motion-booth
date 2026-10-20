import { SectionHeading } from "@/components/shared/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";

const TEMPLATES = [
  { title: "Classic Strip", description: "4 frames, tall print strip" },
  { title: "Grid", description: "2 × 2 square-ish print" },
  { title: "Story", description: "Vertical 9:16 for socials" },
];

function Templates() {
  return (
    <section id="templates" className="bg-secondary px-4 py-20 md:px-0">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <SectionHeading
          eyebrow="Templates"
          title="Three ways to frame the moment."
          body="Every template plays all four moments together, then holds on the finished print."
        />

        {/*  */}
        <div className="grid gap-8 md:grid-cols-3">
          {TEMPLATES.map((template) => (
            <Card key={template.title} className="h-110">
              <CardContent className="flex h-full flex-col gap-2 px-5">
                <div className="bg-background foreground h-full rounded-lg">
                  {/* Template View */}
                </div>
                <div>
                  <p className="text-lg font-bold">{template.title}</p>
                  <span className="text-muted-foreground">
                    {template.description}
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
