import { Route, Routes, useLocation } from "react-router";
import { AnimatePresence } from "motion/react";

import HomePage from "./pages/home";
import BoothPage from "./pages/booth";
import PageTransition from "./components/shared/PageTransition";

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Landing Page */}
        <Route
          path="/"
          element={
            <PageTransition>
              <HomePage />
            </PageTransition>
          }
        />

        {/* Photobooth UI */}
        <Route
          path="/booth"
          element={
            <PageTransition>
              <BoothPage />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
