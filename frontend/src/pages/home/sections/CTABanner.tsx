import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { Link } from "react-router";

function CTABanner() {
  return (
    <section className="px-4 py-12 md:px-0">
      <div className="bg-foreground text-background mx-auto flex w-full max-w-6xl flex-col items-center gap-6 rounded-3xl px-6 py-16 text-center lg:py-24">
        <span className="text-primary font-mono text-xs tracking-[0.2em] uppercase">
          Ready when you are
        </span>
        <h2 className="font-display max-w-2xl text-4xl font-medium tracking-tight lg:text-5xl">
          Step in. <em className="text-primary">We'll catch the rest.</em>
        </h2>
        <p className="text-background/70 max-w-md text-base">
          Four shots, five seconds of build-up each, one scan to take it home.
        </p>
        <Link to="/booth">
          <Button
            size="lg"
            onClick={() => {}}
            className="mt-2 h-14 gap-2 rounded-full px-8 text-base"
          >
            <Camera className="size-5" aria-hidden="true" />
            Tap to start
          </Button>
        </Link>
      </div>
    </section>
  );
}

export default CTABanner;
