import { SectionHeading } from "@/components/shared/SectionHeading";

function MomentBefore() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-0">
        <div className="grid items-center gap-8 md:grid-cols-2">
          {/* Left */}
          <SectionHeading
            eyebrow={"The moment before"}
            title={"The best part happens before the click."}
            body="A regular booth gives you the pose. Motion Booth also gives you the shuffle, the giggle and the wait, I wasn't ready - then lands on the perfect shot."
          />

          {/* Template Showcase */}
          <div className="grid w-full grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="bg-secondary aspect-3/4 w-full rounded-2xl"></div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Regular booth</span>
                <span className="text-muted-foreground font-mono text-xs">
                  1 frame
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="bg-secondary border-primary aspect-3/4 w-full rounded-2xl border-2"></div>
              <div className="flex justify-between">
                <span className="font-medium">Motion Booth</span>
                <span className="text-primary font-mono text-xs">
                  60 frames
                </span>
              </div>
            </div>
            {/* End of template showcase */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MomentBefore;
