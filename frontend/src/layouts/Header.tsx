import { Aperture, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <nav className="hidden space-x-6 text-sm transition-colors md:block">
          {SECTIONS.map((section) => (
            <a
              href={section.href}
              className="text-muted-foreground hover:text-foreground"
            >
              {section.label}
            </a>
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
