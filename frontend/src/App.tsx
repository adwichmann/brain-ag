import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import FarmerPage from "./pages/FarmerPage";
import Navbar from "./components/Navbar";
import FarmPage from "./pages/FarmPage";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./store";
import { fetchFarmData, fetchFarmerData } from "./store/farmActions";
import { useEffect } from "react";
import DashboardPage from "./pages/DashboardPage";
function App() {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFarmData());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchFarmerData());
  }, [dispatch]);
  return (
    <>
      <main className="content">
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" Component={FarmerPage} />
            <Route path="/farm" Component={FarmPage} />
            <Route path="/dashboard" Component={DashboardPage} />
          </Routes>
        </Router>
      </main>
    </>
  );
}

export default App;
