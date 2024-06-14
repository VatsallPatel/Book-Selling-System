import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import "react-toastify/dist/ReactToastify.css";
import React, { useContext, useEffect } from "react";
import { DarkModeContext } from "../Context/DarkModeContext";

function AdminBookDetails() {
  const location = useLocation();
  const v = location.state;
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (v === null) {
      navigate("/admin-dashboard");
    }
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
        <div className="row my-0 mx-0 p-0 d-flex justify-content-center">
          <div className="col-md-6 col-12 d-flex flex-row align-items-center my-5 p-0">
            <div
              className={`rounded row m-0 p-0 w-100 ${
                darkMode ? "text-white" : "text-dark"
              }`}
              style={
                darkMode
                  ? { backgroundColor: "#000" }
                  : { backgroundColor: "#eee" }
              }
            >
              <div className="col-md-6 col-12 p-3 text-center">
                <img
                  src={v?.thumbnail_image}
                  alt="book"
                  className="product-img"
                  style={{ width: "300px", height: "250px" }}
                />
              </div>
              <div className="col-md-6 col-12 p-3">
                <h2 className={`h2 title mb-3`}>{v?.title}</h2>
                <h4 className="h4 mb-0 text-primary">{v?.author}</h4>
                <h4 className="h4 text-success w-100 price mt-2 mb-0 ">
                  ₹{v?.price}
                </h4>
                <label
                  className={`${
                    darkMode ? "text-light" : "text-secondary"
                  } w-100 price mt-1 mb-0`}
                >
                  {v?.total_pages} Page
                </label>
                <label
                  className={`${
                    darkMode ? "text-light" : "text-secondary"
                  } w-100 price mt-1 mb-0`}
                >
                  {v?.tags}
                </label>
                <a href={v?.book} target="_blank" rel="noopener noreferrer">
                  <button className="btn btn-primary mt-4 mb-0">
                    View Book
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Helmet>
        <title>Book Details</title>
      </Helmet>
    </>
  );
}

export default AdminBookDetails;
