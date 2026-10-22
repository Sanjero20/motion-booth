import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";

function BoothHeader() {
  return (
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
  );
}

export default BoothHeader;
