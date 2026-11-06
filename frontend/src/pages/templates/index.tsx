import PageHeading from "@/components/shared/PageHeading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
          Create template
        </Button>
      </section>

      <Separator />
    </div>
  );
}

export default TemplatesPage;
