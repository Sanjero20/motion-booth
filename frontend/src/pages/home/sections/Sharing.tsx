import { SectionHeading } from "@/components/shared/SectionHeading";
import { EVENTS, SHARING_FEATURES } from "@/data/landing";

function Sharing() {
  return (
    <section id="sharing" className="px-4 py-20 md:px-0">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <SectionHeading
          eyebrow="Sharing"
          title="From booth to feed in one scan."
          body="Guests leave with the moment on their phone before they've left the backdrop"
        />

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SHARING_FEATURES.map(({ icon: Icon, title, body }) => (
            <li
              key={title}
              className="bg-card flex flex-col gap-4 rounded-2xl border p-6"
            >
              <span className="bg-accent text-accent-foreground flex size-10 items-center justify-center rounded-lg">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-semibold">{title}</h3>
                <p className="text-muted-foreground text-sm">{body}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Banner */}
        <div className="bg-card flex flex-col items-start gap-6 rounded-3xl border p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
          <div className="flex max-w-sm flex-col gap-2">
            <h3 className="font-display text-3xl font-medium tracking-tight">
              Made for every kind of celebration
            </h3>
            <p className="text-muted-foreground text-sm">
              Set it up anywhere there's a backdrop and a crowd.
            </p>
          </div>
          <ul className="flex flex-wrap gap-2 lg:max-w-lg lg:justify-end">
            {EVENTS.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="bg-background flex items-center gap-2 rounded-full border px-4 py-2 text-sm"
              >
                <Icon className="text-primary size-4" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Sharing;
