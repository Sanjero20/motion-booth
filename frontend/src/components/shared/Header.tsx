import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";

const SECTIONS = [
  { href: "#how", label: "How it works" },
  { href: "#templates", label: "Templates" },
  { href: "#sharing", label: "Sharing" },
  { href: "#faq", label: "FAQ" },
];

function Header() {
  return (
    <header className="border-border/60 bg-background/70 sticky top-0 z-50 border-b px-4 backdrop-blur-md md:px-0">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between">
        <Logo />

        <nav
          aria-label="Primary"
          className="hidden space-x-6 text-sm transition-colors md:block"
        >
          {SECTIONS.map((section) => (
            <a
              key={section.href}
              href={section.href}
              className="text-muted-foreground hover:text-foreground"
            >
              {section.label}
            </a>
          ))}
        </nav>

        <Link to="/login">
          <Button className="px-4">Sign in</Button>
        </Link>
      </div>
    </header>
  );
}

export default Header;
