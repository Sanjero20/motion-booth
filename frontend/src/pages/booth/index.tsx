import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";

const LIMIT = 4;

function BoothPage() {
  return (
    <main className="mx-auto flex h-dvh w-full max-w-6xl flex-col gap-3 overflow-hidden p-3 sm:gap-4 sm:p-5">
      {/* Header */}
      <header className="relative flex shrink-0 items-center justify-center">
        <Link
          to="/"
          aria-label="Back to landing page"
          className="absolute left-0"
        >
          <Button variant="ghost">
            <ArrowLeft className="size-4" />
            Go back
          </Button>
        </Link>

        <Logo />

        <span></span>
      </header>

      {/* Camera and outputs */}
      <section className="grid grid-cols-6 gap-4">
        <div className="col-span-5 w-full">
          {/* Camera preview: always 4:3 */}
          <div className="bg-secondary border-border relative aspect-4/3 w-full shrink rounded-md border-2">
            {/* Camera feed */}
          </div>
        </div>

        {/* Photo outputs */}
        <aside className="flex flex-col gap-4">
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
