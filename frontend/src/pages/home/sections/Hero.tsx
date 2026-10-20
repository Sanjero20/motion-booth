import TemplatePicker from "@/components/shared/TemplatePicker";
import { Button } from "@/components/ui/button";
import { stats } from "@/data/landing";
import { Camera } from "lucide-react";

function Hero() {
  return (
    <section id="hero" className="border-b">
      <div className="mx-auto grid max-w-6xl gap-12 py-12 lg:grid-cols-[1.1fr_1fr]">
        {/* Left  */}
        <div className="flex flex-col gap-5">
          <span className="bg-card text-muted-foreground flex w-fit items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs">
            <span
              className="bg-primary size-1.5 animate-pulse rounded-full"
              aria-hidden="true"
            />
            Every photo comes with its moment
          </span>

          <h1 className="font-display text-5xl leading-[1.02] font-medium tracking-tight lg:text-7xl">
            Catch the laugh
            <br />
            <em className="text-primary">before the pose.</em>
          </h1>
          <p className="text-muted-foreground max-w-md text-base">
            Motion Booth keeps the 5 seconds leading up to each shot and plays
            them back inside your print — so you keep the build-up, not just the
            smile.
          </p>

          <div className="flex max-w-md flex-col gap-3">
            <span className="text-sm font-medium">Pick your template</span>
            <TemplatePicker />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              size="lg"
              onClick={() => {}}
              className="h-14 gap-2 rounded-full px-8 text-base"
            >
              <Camera className="size-5" aria-hidden="true" />
              Tap to start
            </Button>
            <span className="text-muted-foreground text-xs">
              4 shots · about 25 seconds
            </span>
          </div>

          <dl className="grid max-w-md grid-cols-3 gap-4 border-t pt-6">
            {stats.map((s) => (
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
        <div className="bg-secondary min-h-[70vh] rounded-lg p-4"></div>
      </div>
    </section>
  );
}

export default Hero;
