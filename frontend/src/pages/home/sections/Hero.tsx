import TemplateCanvas from "@/components/shared/TemplateCanvas";
import TemplatePicker from "@/components/shared/TemplatePicker";
import { Button } from "@/components/ui/button";
import { STATS } from "@/data/landing";
import { templates } from "@/data/templates";
import { Camera } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

function Hero() {
  const [selectedId, setSelectedId] = useState<string[]>([templates[0].id]);

  const selectedTemplate =
    templates.find((template) => template.id === selectedId[0]) ?? templates[0];

  return (
    <section id="hero" className="border-b">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 md:px-0 lg:grid-cols-[1.1fr_1fr]">
        {/* Left  */}
        <div className="flex flex-col gap-5">
          <span className="bg-card text-muted-foreground flex w-fit items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs">
            <span
              className="bg-primary size-1.5 animate-pulse rounded-full"
              aria-hidden="true"
            />
            A DIFFERENT KIND OF PHOTOBOOTH
          </span>

          <h1 className="font-display text-5xl leading-[1.02] font-medium tracking-tight lg:text-6xl">
            Catch the moment
            <br />
            <em className="text-primary">before the snap.</em>
          </h1>
          <p className="text-muted-foreground max-w-md text-base">
            Five seconds of laughter, movement, and everything in between.
            Motion Booth turns those fleeting moments into a photostrip you can
            replay, save, and share.
          </p>

          <div className="flex max-w-md flex-col gap-3">
            <span className="text-sm font-medium">Pick your template</span>
            <TemplatePicker selectedId={selectedId} onSelect={setSelectedId} />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to="/booth">
              <Button
                size="lg"
                onClick={() => {}}
                className="h-14 gap-2 rounded-full px-8 text-base"
              >
                <Camera className="size-5" aria-hidden="true" />
                Tap to start
              </Button>
            </Link>
            <span className="text-muted-foreground text-xs">
              4 shots · about 25 seconds
            </span>
          </div>

          <dl className="grid max-w-md grid-cols-3 gap-4 border-t pt-6">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-4xl font-medium tracking-tight">
                  {s.value}
                </dd>
                <dd className="text-muted-foreground text-xs">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right */}
        <div className="bg-secondary min-h-[70vh] rounded-lg p-4">
          <div className="flex h-full min-h-0 w-full min-w-0 items-center justify-center">
            <div className="flex h-full max-h-130 w-full max-w-96 items-center justify-center">
              <TemplateCanvas
                layout={selectedTemplate}
                className="max-h-full max-w-full drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
