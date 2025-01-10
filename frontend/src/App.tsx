import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import FarmerPage from "./pages/FarmerPage";
import FarmPage from "./pages/FarmPage";
import DashboardPage from "./pages/DashboardPage";
import { Toaster } from "./components/ui/toaster";
import RootPage from "./pages/RootPage";

function App() {
  return (
    <>
      <main className="content">
        <Router>
          <Routes>
            <Route path="/" element={<RootPage />}>
              <Route index element={<FarmerPage />} />

              <Route path="/farm" element={<FarmPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </main>
    </>
  );
}

export default App;
