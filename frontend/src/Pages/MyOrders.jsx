import React, { useContext, useEffect, useState } from "react";
import { listOrders, responseResult } from "../Service/Service";
import Loader from "../Components/Loader";
import { DarkModeContext } from "../Context/DarkModeContext";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Cookies from "js-cookie";
import moment from "moment";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

function MyOrders() {
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const role = Cookies.get("role") || "";
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (role === "admin") {
      navigate("/admin-home");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    listOrders({
      is_id: true,
      is_pending: false,
      is_accepted: false,
      is_rejected: false,
      is_cancelled: false,
      page: null,
    }).then((r) => {
      setTimeout(() => {
        setLoading(false);
      }, 1000);

      if (r?.data[0]?.length > 0 && r?.data[1]?.length > 0 && r?.code === "1") {
        setFilteredData(
          r?.data[0].map((order) => {
            return {
              ...order,
              order_details: order.order_details?.filter(
                (detail) => detail.status === "pending"
              ),
            };
          })
        );
        setOrderData(r?.data[0]);
      } else {
        setOrderData([]);
      }
    });
  }

  function cancelOrder(book_id, order_id) {
    if (book_id !== null) {
      Swal.fire({
        title: "Submit Reason to cancel the order",
        input: "text",
        inputAttributes: {
          autocapitalize: "off",
          required: true,
        },
        inputValidator: (value) => {
          if (value.trim().length === 0) {
            return "Please enter a valid reason.";
          }
        },
        showCancelButton: true,
        confirmButtonText: "Cancel",
        cancelButtonText: "Close",
        allowOutsideClick: false,
        background: darkMode ? "black" : "white",
        color: darkMode ? "white" : "black",
      }).then((result) => {
        if (result.isConfirmed) {
          responseResult({
            order_id: order_id,
            book_id: book_id,
            response: "cancelled",
            comment: result?.value,
          }).then((r) => {
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

              fetchData();
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
        }
      });
    } else {
      Swal.fire({
        title: "Submit Reason to cancel the order",
        input: "text",
        inputAttributes: {
          autocapitalize: "off",
          required: true,
        },
        inputValidator: (value) => {
          if (value.trim().length === 0) {
            return "Please enter a valid reason.";
          }
        },
        showCancelButton: true,
        confirmButtonText: "Cancel",
        cancelButtonText: "Close",
        allowOutsideClick: false,
        background: darkMode ? "black" : "white",
        color: darkMode ? "white" : "black",
      }).then((result) => {
        if (result.isConfirmed) {
          responseResult({
            order_id: order_id,
            book_id: null,
            response: "cancelled",
            comment: result?.value,
          }).then((r) => {
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

              fetchData();
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
        }
      });
    }
  }

  return (
    <>
      <div
        className="container-fluid p-0 m-0 listing"
        style={
          darkMode
            ? { backgroundColor: "#333" }
            : { backgroundColor: "transparent" }
        }
      >
        <ToastContainer />
        {loading ? (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "85vh" }}
          >
            <Loader />
          </div>
        ) : (
          <div>
            <div
              className="d-flex align-items-center justify-content-center my-3"
              style={{ minHeight: "78vh" }}
            >
              <div className="pb-4">
                <h4
                  className={`h4 text-center mt-3 ${
                    darkMode ? "text-white" : "text-dark"
                  }`}
                >
                  My Orders
                </h4>
                <div className="row mx-auto my-0 order-box">
                  {orderData?.length > 0 ? (
                    orderData?.map((v, i) => (
                      <div
                        className={`col-12 border ${
                          darkMode
                            ? "bg-dark border-white text-white"
                            : "bg-white border-dark text-dark"
                        } order-con`}
                        key={i}
                      >
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <span
                            className={`items-${darkMode ? "dark" : "light"}`}
                          >
                            {moment(v.created_at).format("LLLL")}
                          </span>
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                          <h5 className="h5 m-0">{v?.order_no}</h5>
                          <div>
                            {v?.status === "pending" && (
                              <button
                                className="btn btn-outline-danger status me-2"
                                onClick={() => cancelOrder(null, v?.id)}
                              >
                                Cancel
                              </button>
                            )}
                            <label className={`status ${v?.status}`}>
                              {v?.status}
                            </label>
                          </div>
                        </div>
                        <div className="row mt-2 mx-0 d-flex align-items-center justify-content-between">
                          <div className="col-9">
                            {v?.order_details?.map((b, index) => (
                              <div className="mb-2" key={index}>
                                <div className="d-flex align-items-center w-100">
                                  <img
                                    src={b?.thumbnail_image}
                                    alt="order-book"
                                    className="order-image"
                                  />

                                  <label
                                    className={`items-${
                                      darkMode ? "dark" : "light"
                                    } ms-2`}
                                  >
                                    {b?.title}
                                  </label>
                                  <label
                                    className={`items-${
                                      darkMode ? "dark" : "light"
                                    } ms-2`}
                                  >
                                    {b?.qty}X
                                  </label>
                                  <label
                                    className={`items-${
                                      darkMode ? "dark" : "light"
                                    } ms-2`}
                                  >
                                    ₹{b?.price}
                                  </label>
                                  {b?.status !== "pending" && (
                                    <label
                                      className={`status ${b?.status} ms-2`}
                                    >
                                      {b?.status}
                                    </label>
                                  )}
                                  {b?.status === "pending" &&
                                    filteredData[i]?.order_details?.length >
                                      1 &&
                                    v?.status === "pending" && (
                                      <button
                                        className="btn btn-outline-danger status ms-2"
                                        onClick={() =>
                                          cancelOrder(b?.book_id, b?.order_id)
                                        }
                                      >
                                        Cancel Book
                                      </button>
                                    )}
                                </div>
                                {b?.comment && (
                                  <label className="status mt-0 pt-0">
                                    {b?.comment}
                                  </label>
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="col-3 d-flex flex-column">
                            <div className="mt-1">
                              <label
                                className={`items-${
                                  darkMode ? "dark" : "light"
                                } sub w-auto float-end`}
                              >
                                ₹{v?.sub_total}
                              </label>
                            </div>
                            <div className="mt-1">
                              <label
                                className={`items-${
                                  darkMode ? "dark" : "light"
                                } charge w-auto float-end`}
                              >
                                + ₹{v?.fixed_charges}
                              </label>
                            </div>
                            <div className="mt-1 d-flex align-items-center justify-content-between">
                              <label
                                className={`items-${
                                  darkMode ? "dark" : "light"
                                } px-3`}
                              >
                                Pay:
                              </label>
                              <label
                                className={`items-${
                                  darkMode ? "dark" : "light"
                                } grand w-auto float-end`}
                              >
                                ₹{v.grand_total}
                              </label>
                            </div>
                          </div>
                        </div>
                        {v?.comment && (
                          <div className="mt-2">
                            <span>{v?.comment}</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div
                      className={`alert ${
                        darkMode ? "alert-secondary" : "alert-warning"
                      }`}
                    >
                      No Orders Placed!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Helmet>
        <title>Order History</title>
      </Helmet>
    </>
  );
}

export default MyOrders;
