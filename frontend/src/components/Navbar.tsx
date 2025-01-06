import { GiFarmer } from "react-icons/gi";
import { PiFarmFill } from "react-icons/pi";
import { MdDashboard } from "react-icons/md";
import { NavLink } from "react-router-dom";

import "./Navbar.css";
import { IconContext } from "react-icons";
const SidebarData = [
  {
    title: "Produtores",
    path: "/",
    icon: <GiFarmer />,
    cName: "nav-text",
  },
  {
    title: "Fazendas",
    path: "/farm",
    icon: <PiFarmFill />,
    cName: "nav-text",
  },
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <MdDashboard />,
    cName: "nav-text",
  },
];
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
        <nav className={"nav-menu active"}>
          <ul className="nav-menu-items">
            {/* <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <AiIcons.AiOutlineClose />
              </Link>
            </li> */}
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      isActive ? "active" : undefined
                    }
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;
