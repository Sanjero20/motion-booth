interface Props {
  eyebrow: string;
  title: string;
  description?: string;
}

function PageHeading({ eyebrow, title, description }: Props) {
  return (
    <div className="space-y-2">
      <span className="text-primary font-mono text-xs tracking-[0.2em] uppercase">
        {eyebrow}
      </span>

      <h2 className="pt-2 text-4xl font-bold">{title}</h2>

      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
    </div>
  );
}

export default PageHeading;
