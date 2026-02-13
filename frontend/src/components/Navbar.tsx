import { GiFarmer } from "react-icons/gi";
import { PiFarmFill } from "react-icons/pi";
import { MdDashboard } from "react-icons/md";
import { NavLink } from "react-router-dom";


import { IconContext } from "react-icons";
// const SidebarData = [
//   {
//     title: "Produtores",
//     path: "/",
//     icon: <GiFarmer />,
//     cName: "nav-text",
//   },
//   {
//     title: "Fazendas",
//     path: "/farm",
//     icon: <PiFarmFill />,
//     cName: "nav-text",
//   },
//   {
//     title: "Dashboard",
//     path: "/dashboard",
//     icon: <MdDashboard />,
//     cName: "nav-text",
//   },
// ];
function Navbar() {
  // const [sidebar, setSidebar] = useState(true);

  //const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        {/* <div className="navbar">
          <Link to="#" className="menu-bars">
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
        </div> */}
        <nav className="w-[250px] h-screen fixed top-0 left-0 bg-[#060b26] transition-[350ms] active">
          <ul className="w-full mt-[30px]">
            <li className="h-[60px] py-[8px] pl-[16px] flex justify-start items-center list-none">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `h-full w-[95%] px-[16px] flex items-center text-[18px] text-[#f5f5f5] rounded-[4px] no-underline transition-colors hover:bg-[#1a83ff] ${isActive || window.location.pathname.includes("farmer/")
                    ? "bg-[#1a83ff]"
                    : ""
                  }`
                }
              >
                <GiFarmer />
                <span className="ml-[16px]">Produtores</span>
              </NavLink>
            </li>
            <li className="h-[60px] py-[8px] pl-[16px] flex justify-start items-center list-none">
              <NavLink
                to="/farm"
                className={({ isActive }) =>
                  `h-full w-[95%] px-[16px] flex items-center text-[18px] text-[#f5f5f5] rounded-[4px] no-underline transition-colors hover:bg-[#1a83ff] ${isActive ? "bg-[#1a83ff]" : ""
                  }`
                }
              >
                <PiFarmFill />
                <span className="ml-[16px]">Fazendas</span>
              </NavLink>
            </li>
            <li className="h-[60px] py-[8px] pl-[16px] flex justify-start items-center list-none">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `h-full w-[95%] px-[16px] flex items-center text-[18px] text-[#f5f5f5] rounded-[4px] no-underline transition-colors hover:bg-[#1a83ff] ${isActive ? "bg-[#1a83ff]" : ""
                  }`
                }
              >
                <MdDashboard />
                <span className="ml-[16px]">Resultados</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;
