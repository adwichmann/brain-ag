import { GiFarmer } from "react-icons/gi";
import { PiFarmFill } from "react-icons/pi";
import { MdDashboard } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { IconContext } from "react-icons";

function Navbar() {
  return (
    <IconContext.Provider value={{ color: "currentColor" }}>
      <nav className="w-[250px] h-screen fixed top-0 left-0 bg-secondary border-r border-border transition-all">
        <ul className="w-full mt-[30px]">
          <li className="h-[60px] py-[8px] pl-[16px] flex justify-start items-center list-none">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `h-full w-[95%] px-[16px] flex items-center text-[18px] text-foreground rounded-[4px] no-underline transition-colors hover:bg-accent hover:text-accent-foreground ${isActive || window.location.pathname.includes("farmer/")
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : ""
                }`
              }
            >
              <GiFarmer size={20} />
              <span className="ml-[16px]">Produtores</span>
            </NavLink>
          </li>
          <li className="h-[60px] py-[8px] pl-[16px] flex justify-start items-center list-none">
            <NavLink
              to="/farm"
              className={({ isActive }) =>
                `h-full w-[95%] px-[16px] flex items-center text-[18px] text-foreground rounded-[4px] no-underline transition-colors hover:bg-accent hover:text-accent-foreground ${isActive ? "bg-accent text-accent-foreground shadow-sm" : ""
                }`
              }
            >
              <PiFarmFill size={20} />
              <span className="ml-[16px]">Fazendas</span>
            </NavLink>
          </li>
          <li className="h-[60px] py-[8px] pl-[16px] flex justify-start items-center list-none">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `h-full w-[95%] px-[16px] flex items-center text-[18px] text-foreground rounded-[4px] no-underline transition-colors hover:bg-accent hover:text-accent-foreground ${isActive ? "bg-accent text-accent-foreground shadow-sm" : ""
                }`
              }
            >
              <MdDashboard size={20} />
              <span className="ml-[16px]">Resultados</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </IconContext.Provider>
  );
}

export default Navbar;

