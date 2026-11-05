import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes, useLocation } from "react-router";

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
import TemplatesPage from "./pages/templates";
import NotFoundPage from "./pages/not-found";
import EventDetailsPage from "./pages/events/[eventId]";

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

          <Route path="/templates" element={<TemplatesPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
