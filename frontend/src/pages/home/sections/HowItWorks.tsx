import { SectionHeading } from "@/components/shared/SectionHeading";
import { Camera, QrCode, LayoutTemplate } from "lucide-react";

const STEPS = [
  {
    icon: LayoutTemplate,
    title: "Pick a template",
    body: "Classic strip, 2 × 2 grid or a 9:16 story — chosen before the first flash.",
  },
  {
    icon: Camera,
    title: "Strike four poses",
    body: "A 3-2-1 countdown for each shot. The booth quietly keeps the 5 seconds before every click.",
  },
  {
    icon: QrCode,
    title: "Take it home",
    body: "Scan the QR or download on the spot — an 8-second motion video and a print-ready photo.",
  },
];

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
