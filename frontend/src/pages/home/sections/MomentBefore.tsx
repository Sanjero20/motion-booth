import { SectionHeading } from "@/components/shared/SectionHeading";

function MomentBefore() {
  return (
    <section>
      <div className="mx-auto max-w-6xl py-20">
        <div className="grid items-center gap-8 md:grid-cols-2">
          {/* Left */}
          <SectionHeading
            eyebrow={"The moment before"}
            title={"The best part happens before the click."}
            body="A regular booth gives you the pose. Motion Booth also gives you the shuffle, the giggle and the wait, I wasn't ready - then lands on the perfect shot."
          />

          {/* Template Showcase */}
          <div className="grid w-full grid-cols-2 gap-6">
            <div className="bg-secondary h-96 w-full rounded-2xl"></div>
            <div className="bg-secondary h-96 w-full rounded-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MomentBefore;
