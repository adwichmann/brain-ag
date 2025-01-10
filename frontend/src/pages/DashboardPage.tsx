import Dashboard from "../components/Dashboard/Dashboard";
import classes from "./DashboardPage.module.css";
const DashboardPage = () => {
  return (
    <div className={`page ${classes.dashboard} h-full`}>
      <h2>Resultados</h2>
      <Dashboard />
    </div>
  );
};

export default DashboardPage;
