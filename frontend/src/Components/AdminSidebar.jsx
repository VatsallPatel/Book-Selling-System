import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../Context/DarkModeContext";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";

function AdminSidebar({ values }) {
  const { darkMode } = useContext(DarkModeContext);
  const { sidebarOpen, setSidebarOpen } = values;

  return (
    <>
      <div
        className={`listing-sidebar col-2 m-0 p-0 ${darkMode ? "bg-dark" : "bg-light"}`}
      >
        <ProSidebar
          collapsed={sidebarOpen}
          breakPoint="md"
          toggled={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu iconShape="circle">
            <MenuItem>
              <Link to="/admin-dashboard">Dashboard</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/admin-home">Books</Link>
            </MenuItem>
            <SubMenu title="Orders">
              <MenuItem>
                <Link to="/pending-order">Pending Orders</Link>
              </MenuItem>
              <MenuItem>
                <Link to="/accepted-order">Accepted Orders</Link>
              </MenuItem>
              <MenuItem>
                <Link to="/rejected-order">Rejected Orders</Link>
              </MenuItem>
              <MenuItem>
                <Link to="/cancelled-order">Cancelled Orders</Link>
              </MenuItem>
            </SubMenu>
          </Menu>
        </ProSidebar>
      </div>
    </>
  );
}

export default AdminSidebar;
