import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { logoutUser } from "../Service/Service";
import { FaRegMoon } from "react-icons/fa";
import { FaRegSun } from "react-icons/fa6";
import { DarkModeContext } from "../Context/DarkModeContext";

function Navbar({ values }) {
  const userData = Cookies.get("name");
  const role = Cookies.get("role") || "";
  const { sidebarOpen, setSidebarOpen } = values;
  const navigate = useNavigate();
  const { toggle, darkMode } = useContext(DarkModeContext);

  function logout() {
    logoutUser({}).then((r) => {
      if (r?.code === "1") {
        Cookies.remove("token");
        Cookies.remove("name");
        Cookies.remove("role");

        toast.success(r?.message, {
          position: "bottom-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
          style: { margin: "10px" },
        });

        if (role === "admin") {
          setTimeout(() => {
            navigate("/admin-login");
          }, 1000);
        } else {
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        }
      } else {
        toast.error(r?.message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
          style: { margin: "10px" },
        });
      }
    });
  }

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg px-2 ps-3 ${
          darkMode ? "text-white" : "text-dark"
        }`}
        style={
          darkMode ? { backgroundColor: "#000" } : { backgroundColor: "#ddd" }
        }
      >
        {role === "admin" && (
          <button
            className={`navbar-toggler ${darkMode && "bg-white"}`}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        )}
        <Link
          className={`navbar-brand ${darkMode ? "text-white" : "text-dark"}`}
          to={`${role === "admin" ? "/admin-dashboard" : "/"}`}
        >
          Books
        </Link>
        <ToastContainer />
        <button
          className={`navbar-toggler ${darkMode && "bg-white"}`}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            <li className="nav-item my-lg-2 my-4">
              {darkMode ? (
                <FaRegSun onClick={() => toggle()} />
              ) : (
                <FaRegMoon onClick={() => toggle()} />
              )}
            </li>
            {role === "admin" ? (
              <>
                {/* <li className={`nav-item my-lg-0 my-2`}>
                  <Link
                    to="/add-book"
                    className={`nav-link ${
                      darkMode ? "text-white" : "text-dark"
                    }`}
                    style={{ textDecoration: "none" }}
                  >
                    Add Book
                  </Link>
                </li>
                <li className={`nav-item my-lg-0 my-2`}>
                  <Link
                    to="/pending-orders"
                    className={`nav-link ${
                      darkMode ? "text-white" : "text-dark"
                    }`}
                    style={{ textDecoration: "none" }}
                  >
                    Pending Orders
                  </Link>
                </li>
                <li className={`nav-item my-lg-0 my-2`}>
                  <Link
                    to="/approved-orders"
                    className={`nav-link ${
                      darkMode ? "text-white" : "text-dark"
                    }`}
                    style={{ textDecoration: "none" }}
                  >
                    Approved Orders
                  </Link>
                </li>
                <li className={`nav-item my-lg-0 my-2`}>
                  <Link
                    to="/rejected-orders"
                    className={`nav-link ${
                      darkMode ? "text-white" : "text-dark"
                    }`}
                    style={{ textDecoration: "none" }}
                  >
                    Rejected Orders
                  </Link>
                </li> */}
              </>
            ) : (
              <>
                <li className={`nav-item my-lg-0 my-2`}>
                  <Link
                    to="/"
                    className={`nav-link ${
                      darkMode ? "text-white" : "text-dark"
                    }`}
                    style={{ textDecoration: "none" }}
                  >
                    Home
                  </Link>
                </li>
                <li className={`nav-item my-lg-0 my-2`}>
                  <Link
                    to="/cart"
                    className={`nav-link ${
                      darkMode ? "text-white" : "text-dark"
                    }`}
                    style={{ textDecoration: "none" }}
                  >
                    Cart
                  </Link>
                </li>
                <li className={`nav-item my-lg-0 my-2`}>
                  <Link
                    to="/order-history"
                    className={`nav-link ${
                      darkMode ? "text-white" : "text-dark"
                    }`}
                    style={{ textDecoration: "none" }}
                  >
                    Order History
                  </Link>
                </li>
              </>
            )}
            <li className="nav-item my-lg-1 my-2">
              <button
                className={`btn btn-danger`}
                style={{ cursor: "pointer" }}
                onClick={() => logout()}
              >
                Logout
              </button>
            </li>
            <li className="nav-item my-lg-0 my-2">
              <span
                className={`nav-link ${darkMode ? "text-white" : "text-dark"}`}
              >
                {userData}
              </span>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
