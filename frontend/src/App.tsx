import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes, useLocation } from "react-router";
import { Toaster } from "@/components/ui/toast";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";

// Public routes
import HomePage from "./pages/home";
import BoothPage from "./pages/booth";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";

// Authenticated routes
import DashboardPage from "./pages/dashboard";

import EventsPage from "./pages/events";
import CreateEventPage from "./pages/events/new";
import EventDetailsPage from "./pages/events/[eventId]";
import EditEventPage from "./pages/events/[eventId]/edit";

import TemplatesPage from "./pages/templates";
import CreateTemplatePage from "./pages/templates/new";
import TemplateDetailsPage from "./pages/templates/[templateId]";
import EditTemplatePage from "./pages/templates/[templateId]/edit";

import NotFoundPage from "./pages/not-found";

const queryClient = new QueryClient();

function App() {
  const location = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <Routes location={location} key={location.pathname}>
        {/* Accessible to all */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/booth" element={<BoothPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* For signed in users */}
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/new" element={<CreateEventPage />} />
          <Route path="/events/:eventId" element={<EventDetailsPage />} />
          <Route path="/events/:eventId/edit" element={<EditEventPage />} />

          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/templates/new" element={<CreateTemplatePage />} />
          <Route
            path="/templates/:templateId"
            element={<TemplateDetailsPage />}
          />
          <Route
            path="/templates/:templateId/edit"
            element={<EditTemplatePage />}
          />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
