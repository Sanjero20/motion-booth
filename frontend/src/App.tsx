import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes, useLocation } from "react-router";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";

// Public routes
import HomePage from "./pages/home";
import BoothPage from "./pages/booth";

// Authenticated routes
import DashboardPage from "./pages/dashboard";
import EventsPage from "./pages/events";
import TemplatesPage from "./pages/templates";
import NotFoundPage from "./pages/not-found";

const queryClient = new QueryClient();

function App() {
  const location = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <Routes location={location}>
        {/* Accessible to all */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/booth" element={<BoothPage />} />
        </Route>

        {/* For signed in users */}
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
