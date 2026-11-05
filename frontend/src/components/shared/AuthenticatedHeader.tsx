import { NavLink } from "react-router";
import {
  LayoutDashboard,
  CalendarDays,
  PanelsTopLeft,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/events", label: "Events", icon: CalendarDays },
  { to: "/templates", label: "Templates", icon: PanelsTopLeft },
];

function AuthenticatedHeader() {
  return (
    <header className="border-border/60 bg-background/70 sticky top-0 z-50 border-b px-4 backdrop-blur-md lg:px-0">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between">
        <Logo href="/dashboard" />

        <nav
          aria-label="Primary"
          className="hidden items-center gap-6 text-sm md:flex"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  `flex items-center gap-2 transition-colors ${
                    isActive
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={16}
                      className={isActive ? "text-primary" : ""}
                    />
                    {item.label}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <Button
          size={"icon"}
          className={"border-primary rounded-full border-2 bg-white"}
        >
          <User />
        </Button>
      </div>
    </header>
  );
}

export default AuthenticatedHeader;
