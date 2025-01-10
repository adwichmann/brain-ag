import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

const RootPage = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default RootPage;
