import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Camera } from "lucide-react";

import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";

const LIMIT = 4;

function BoothPage() {
  // "idle" -> "capturing" -> back to "idle" when all shots are taken
  const [status, setStatus] = useState("idle");

  const handleStart = () => {
    setStatus("capturing");
    // TODO: run the countdown and take LIMIT shots here,
    // then setStatus("idle") when the session finishes.
  };

  return (
    // Mobile: page scrolls. md and up: page is locked to the screen height.
    <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-3 p-3 sm:gap-4 sm:p-5 md:h-dvh md:overflow-hidden">
      {/* Header */}
      <header className="relative flex shrink-0 items-center justify-center">
        <Link
          to="/"
          aria-label="Back to landing page"
          className="absolute left-0"
        >
          <Button variant="ghost" size="sm">
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">Go back</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </Link>

        <Logo />
      </header>

      {/* Camera and outputs: stacked on mobile, side by side from md */}
      <section className="flex min-h-0 flex-1 flex-col gap-3 sm:gap-4 md:flex-row md:items-start md:justify-center">
        {/* Camera preview: always 4:3.
            From md, the width is capped by the available height so the
            preview never grows taller than the screen. */}
        <div className="flex w-full flex-col gap-3 md:max-w-[calc((100dvh-11rem)*4/3)] md:flex-1">
          <div className="bg-secondary border-border relative aspect-4/3 w-full rounded-md border-2">
            {/* Camera feed */}
          </div>

          {/* Start button */}
          <Button
            size="lg"
            className="h-12 w-full rounded-full text-base md:mx-auto md:w-auto md:px-12"
            onClick={handleStart}
            disabled={status !== "idle"}
          >
            <Camera className="size-5" />
            {status === "idle" ? "Start" : "Get ready…"}
          </Button>
        </div>

        {/* Photo outputs: a row of 4 on mobile, a column from md */}
        <aside className="grid shrink-0 grid-cols-4 gap-2 sm:gap-3 md:max-h-full md:w-28 md:grid-cols-1 md:overflow-y-auto lg:w-40">
          {Array.from({ length: LIMIT }).map((_, index) => (
            <div
              key={index}
              className="bg-secondary border-border flex aspect-4/3 min-w-0 items-center justify-center rounded-md border-2 border-dashed"
            >
              <span className="text-muted-foreground font-mono text-xs">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </aside>
      </section>
    </main>
  );
}

export default BoothPage;
