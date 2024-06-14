import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Cookies from "js-cookie";
import { DarkModeContext } from "../Context/DarkModeContext";
import Loader from "../Components/Loader";
import { getCounts } from "../Service/Service";

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const role = Cookies.get("role") || "";
  const [counts, setCounts] = useState([]);

  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    getCounts({}).then((r) => {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      if (r?.code === "1") {
        setCounts(r?.data);
      } else {
        setCounts([]);
      }
    });
  }, []);

  return (
    <>
      <div
        className="p-0 m-0 col-10"
        style={
          darkMode
            ? { backgroundColor: "#333" }
            : { backgroundColor: "transparent" }
        }
      >
        {loading ? (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "85vh" }}
          >
            <Loader />
          </div>
        ) : (
          <div className="p-3">
            <h1 className={`m-3 ${darkMode ? "text-white" : "text-dark"}`}>
              Admin Dashboard
            </h1>
            {counts?.length > 0 ? (
              <div className="row m-0 p-0">
                <div
                  className={`col-lg-3 col-md-6 col-12 m-3 p-5 text-center rounded ${
                    darkMode ? "bg-secondary text-white" : "bg-info text-dark"
                  }`}
                >
                  <h3>Pending Orders</h3>
                  <div className="alert alert-info">
                    <h3>{counts[0].pending}</h3>
                  </div>
                </div>
                <div
                  className={`col-lg-3 col-md-6 col-12 m-3 p-5 text-center rounded ${
                    darkMode ? "bg-secondary text-white" : "bg-info text-dark"
                  }`}
                >
                  <h3>Accepted Orders</h3>
                  <div className="alert alert-info">
                    <h3>{counts[0].approved}</h3>
                  </div>
                </div>
                <div
                  className={`col-lg-3 col-md-6 col-12 m-3 p-5 text-center rounded ${
                    darkMode ? "bg-secondary text-white" : "bg-info text-dark"
                  }`}
                >
                  <h3>Rejected Orders</h3>
                  <div className="alert alert-info">
                    <h3>{counts[0].rejected}</h3>
                  </div>
                </div>
                <div
                  className={`col-lg-3 col-md-6 col-12 m-3 py-5 text-center rounded ${
                    darkMode ? "bg-secondary text-white" : "bg-info text-dark"
                  }`}
                >
                  <h3>Cancelled Orders</h3>
                  <div className="alert alert-info mx-4">
                    <h3>{counts[0].cancelled}</h3>
                  </div>
                </div>
                <div
                  className={`col-lg-3 col-md-6 col-12 m-3 p-5 text-center rounded ${
                    darkMode ? "bg-secondary text-white" : "bg-info text-dark"
                  }`}
                >
                  <h3>Total Books</h3>
                  <div className="alert alert-info">
                    <h3>{counts[0].books}</h3>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>

      <Helmet>
        <title>Admin Dashboard</title>
      </Helmet>
    </>
  );
}

export default AdminDashboard;
