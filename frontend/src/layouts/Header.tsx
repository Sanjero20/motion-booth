import { Aperture, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const SECTIONS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#templates", label: "Templates" },
  { href: "#sharing", label: "Sharing" },
  { href: "#faq", label: "FAQ" },
];

function Header() {
  return (
    <header className="border-border/60 bg-background/70 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Button size="icon" className="rounded-md">
            <Aperture size={64} />
          </Button>
          <h2 className="font-bold">
            Motion <span className="text-primary italic">Booth</span>
          </h2>
        </div>

        {/* Navigation */}
        <nav className="space-x-6 text-sm transition-colors">
          {SECTIONS.map((section) => (
            <Link
              to={section.href}
              className="text-muted-foreground hover:text-foreground"
            >
              {section.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Button className="px-4">
          <Camera />
          Start
        </Button>
      </div>
    </header>
  );
}

export default Header;
