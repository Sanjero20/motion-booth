import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

function NotFoundPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <main className="flex flex-col items-center justify-center gap-4">
        <Logo />

        {/* <h1 className="font-display text-3xl leading-[1.02] font-medium tracking-tight lg:text-4xl">
          Out of <em className="text-primary">frame</em>
        </h1> */}

        <p className="text-muted-foreground">
          It looks like your out of frame. Let's get back to the booth.
        </p>

        <div>
          <Link to={"/"} className="w-fit">
            <Button>Go Home</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default NotFoundPage;
