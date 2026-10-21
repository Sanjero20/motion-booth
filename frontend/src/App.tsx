import { Route, Routes } from "react-router";

import HomePage from "./pages/home";
import BoothPage from "./pages/booth";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/booth" element={<BoothPage />} />
    </Routes>
  );
}

export default App;
