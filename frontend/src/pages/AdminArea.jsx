import {
  HiOutlineChartPie,
  HiOutlineIdentification,
  HiOutlineTicket,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { HiArrowTrendingUp } from "react-icons/hi2";
import { NavLink, Outlet } from "react-router-dom";
import { useGlobalContextProps } from "../hooks/useGlobalContextProps";

function AdminArea() {
  const { loggedInUser } = useGlobalContextProps();
  return (
    <div className="mx-auto md:px-6 container flex flex-row min-h-screen md:space-x-6">
      <div className="hidden md:block md:w-[300px] pt-10 px-3 space-y-5 border-r">
        <h2 className=" pl-6 -space-y-3 font-bold text-2xl">
          <div className="">Welcome to</div>
          <div className="pl-4 ">Admin Panel</div>
        </h2>
        <ul className="space-y-1">
          <li className="group">
            <NavLink
              to="/adminarea/dashboard"
              className={({ isActive }) =>
                `admin-nav-list ${
                  isActive ? "bg-gray-100 border-cyan" : "border-white"
                }`
              }
            >
              <span className="group-hover:text-blue-400">
                <HiOutlineChartPie />
              </span>
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li className="group">
            <NavLink
              to="/adminarea/commetti"
              className={({ isActive }) =>
                `admin-nav-list ${
                  isActive ? "bg-gray-100 border-cyan" : "border-white"
                }`
              }
            >
              <span className="group-hover:text-blue-400">
                <HiArrowTrendingUp />
              </span>
              <span>Commetti</span>
            </NavLink>
          </li>
          <li className="group">
            <NavLink
              to="/adminarea/transactions"
              className={({ isActive }) =>
                `admin-nav-list ${
                  isActive ? "bg-gray-100 border-cyan" : "border-white"
                }`
              }
            >
              <span className="group-hover:text-blue-400">
                <HiOutlineTicket />
              </span>
              <span>Transactions</span>
            </NavLink>
          </li>
          {loggedInUser?.role === "admin" && (
            <>
              <li className="group">
                <NavLink
                  to="/adminarea/members"
                  className={({ isActive }) =>
                    `admin-nav-list ${
                      isActive ? "bg-gray-100 border-cyan" : "border-white"
                    }`
                  }
                >
                  <span className="group-hover:text-blue-400">
                    <HiOutlineUserGroup />
                  </span>
                  <span>Members</span>
                </NavLink>
              </li>
              <li className="group">
                <NavLink
                  to="/adminarea/assistant"
                  className={({ isActive }) =>
                    `admin-nav-list ${
                      isActive ? "bg-gray-100 border-cyan" : "border-white"
                    }`
                  }
                >
                  <span className="group-hover:text-blue-400">
                    <HiOutlineIdentification />
                  </span>
                  <span>Assistant</span>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className="w-full py-5 mx-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminArea;
