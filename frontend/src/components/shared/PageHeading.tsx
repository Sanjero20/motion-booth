import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  backTo?: string;
  backLabel?: string;
}

export default PageHeading;
function PageHeading({
  eyebrow,
  title,
  description,
  backTo,
  backLabel = "Back",
}: Props) {
  return (
    <div className="space-y-4">
      {backTo && (
        <Link
          to={backTo}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" />
          {backLabel}
        </Link>
      )}

      <div className="space-y-1">
        {eyebrow && (
          <p className="text-primary text-xs font-medium tracking-wider uppercase">
            {eyebrow}
          </p>
        )}

        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>

        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
    </div>
  );
}
