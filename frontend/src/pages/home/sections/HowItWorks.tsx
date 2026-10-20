import { SectionHeading } from "@/components/shared/SectionHeading";
import { STEPS } from "@/data/landing";

function HowItWorks() {
  return (
    <section id="how" className="bg-card py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <SectionHeading
          eyebrow="How It Works"
          title="Three steps, twenty-five seconds."
          body="No buttons to fumble, no app to install. Step in, smile, scan."
        />

        <ol className="grid gap-5 md:grid-cols-3">
          {STEPS.map((step, index) => {
            const Icon = step.icon;

            return (
              <li
                key={step.title}
                className="bg-background flex flex-col gap-5 rounded-2xl border p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="bg-primary text-primary-foreground flex size-11 items-center justify-center rounded-xl">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>

                  <span className="text-muted-foreground font-mono text-sm">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export default HowItWorks;
