import PageHeading from "@/components/shared/PageHeading";
import TemplateCanvas from "@/components/shared/TemplateCanvas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { templates } from "@/data/templates";
import { Link } from "react-router";

function TemplatesPage() {
  return (
    <div className="space-y-4">
      <section className="flex items-end justify-between">
        <PageHeading
          eyebrow="Design Library"
          title="Your Templates"
          description="Browse and manage your photo booth layouts and designs."
        />

        <Button nativeButton={false} render={<Link to="/templates/new" />}>
          Create templates
        </Button>
      </section>

      <Separator />

      <h3 className="text-base font-semibold">Built-in Templates</h3>

      <section className="grid grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="flex aspect-4/3 w-full flex-col">
            <CardContent className="flex min-h-0 flex-1 justify-center">
              <TemplateCanvas layout={template} className="border" />
            </CardContent>

            <CardFooter className="flex justify-between pt-0">
              <p className="font-semibold">{template.name}</p>
              <p className="text-muted-foreground text-xs">
                {template.slots.length} photos
              </p>
            </CardFooter>
          </Card>
        ))}
      </section>
    </div>
  );
}

export default TemplatesPage;
