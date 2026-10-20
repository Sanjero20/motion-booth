interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  body?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div
      className={`flex max-w-2xl flex-col gap-3 ${centered ? "mx-auto items-center text-center" : ""}`}
    >
      <span className="text-primary font-mono text-xs tracking-[0.2em] uppercase">
        {eyebrow}
      </span>
      <h2 className="font-display text-4xl leading-[1.05] font-medium tracking-tight lg:text-5xl">
        {title}
      </h2>
      {body && <p className="text-muted-foreground text-base">{body}</p>}
    </div>
  );
}
