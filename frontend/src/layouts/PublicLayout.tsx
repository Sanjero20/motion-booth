import PageTransition from "@/components/shared/PageTransition";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { AnimatePresence } from "motion/react";
import { Navigate, Outlet, useLocation } from "react-router";

function PublicLayout() {
  const location = useLocation();

  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return null;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

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
