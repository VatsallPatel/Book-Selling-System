import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useContext, useEffect, useState } from "react";
import { addToCart, getCart } from "../Service/Service";
import Cookies from "js-cookie";
import { DarkModeContext } from "../Context/DarkModeContext";

function BookDetails() {
  const location = useLocation();
  const v = location.state;
  const navigate = useNavigate();
  const role = Cookies.get("role") || "";
  const { darkMode } = useContext(DarkModeContext);
  const [btnLoading, setBtnLoading] = useState(false);

  let [qty, setQty] = useState(0);

  useEffect(() => {
    if (v === null) {
      navigate("/");
    }

    if (role === "admin") {
      navigate("/admin-dashboard");
    }

    getCart({ book_id: v?.id }).then((r) => {
      if (r?.data?.length > 0) {
        setQty(r?.data[0]?.qty);
      }
    });
  }, []);

  function addQty() {
    setQty(++qty);

    addToCart({ book_id: v?.id, quantity: qty }).then((r) => {
      if (r?.code === "0") {
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
        });
      }
    });
  }

  function removeQty() {
    setQty(--qty);

    addToCart({ book_id: v?.id, quantity: qty }).then((r) => {
      if (r?.code === "0") {
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
        });
      }
    });
  }

  const addCart = () => {
    setBtnLoading(true);
    setQty(1);

    addToCart({ book_id: v?.id, quantity: "1" }).then((r) => {
      setBtnLoading(false);
      if (r?.code === "1") {
        toast.success(r?.message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
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
        });
      }
    });
  };

  return (
    <>
      <ToastContainer />
      <div
        className={`listing`}
        style={{ backgroundColor: `${darkMode ? "#333" : "white"}` }}
      >
        <div className="row my-0 mx-0 p-0 d-flex justify-content-center">
          <div className="col-md-6 d-flex flex-row align-items-center my-5 p-0">
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
              <div className="col-md-12 p-3 pt-0">
                {qty === 0 ? (
                  <div className="row m-0 w-100 mt-3 d-flex justify-content-center align-items-center">
                    <div className="col-5 p-0 mx-auto">
                      {!btnLoading ? (
                        <button
                          className="btn btn-warning w-100"
                          onClick={() => addCart()}
                        >
                          Add To Cart
                        </button>
                      ) : (
                        <button className="btn btn-warning w-100" disabled>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Loading...
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="row m-0 mx-auto w-50 mt-3 d-flex justify-content-center align-items-center">
                    <div className="col-2 p-0">
                      <button
                        className="btn btn-light w-100 rounded-0"
                        onClick={() => removeQty()}
                      >
                        -
                      </button>
                    </div>
                    <div className="col-2 p-0">
                      <input
                        className="form-control w-100 text-center rounded-0"
                        value={qty}
                      />
                    </div>
                    <div className="col-2 p-0">
                      <button
                        className="btn btn-light w-100 rounded-0"
                        onClick={() => addQty()}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
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

export default BookDetails;
