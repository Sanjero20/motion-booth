import PageTransition from "@/components/shared/PageTransition";
import { AnimatePresence } from "motion/react";
import { Outlet, useLocation } from "react-router";

function PublicLayout() {
  const location = useLocation();

  return (
    <div className="min-h-dvh overflow-clip">
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>
          <Outlet />
        </PageTransition>
      </AnimatePresence>
    </div>
  );
}

export default PublicLayout;
