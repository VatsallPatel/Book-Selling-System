import React, { useContext, useEffect, useState } from "react";
import { listOrders } from "../Service/Service";
import Loader from "../Components/Loader";
import { DarkModeContext } from "../Context/DarkModeContext";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Cookies from "js-cookie";
import moment from "moment";
import Paginate from "../Components/Paginate";

function RejectedOrders() {
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const role = Cookies.get("role") || "";
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const booksPerPage = 2;

  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    listOrders({
      is_id: false,
      is_pending: false,
      is_accepted: false,
      is_rejected: true,
      is_cancelled: false,
      page: currentPage,
      limit: booksPerPage,
    }).then((r) => {
      setTimeout(() => {
        setLoading(false);
      }, 1000);

      if (r?.data[0]?.length > 0 && r?.data[1]?.length > 0 && r?.code === "1") {
        setOrderData(r?.data[0]);
        setPageCount(Math.ceil(r?.data[1][0]?.total_orders / booksPerPage));
      } else {
        setOrderData([]);
      }
    });
  }, [currentPage]);

  return (
    <>
      <div
        className="col-10 p-0 m-0 listing"
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
                  Rejected Orders
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
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <span
                            className={`items-${darkMode ? "dark" : "light"}`}
                          >
                            {v?.name}
                          </span>
                          <span
                            className={`items-${darkMode ? "dark" : "light"}`}
                          >
                            {v?.email}
                          </span>
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                          <h5 className="h5 m-0">
                            {v?.order_no} || {v?.id}
                          </h5>
                        </div>
                        <div className="row mt-2 mx-0 d-flex align-items-center justify-content-between">
                          <div className="col-6">
                            {v?.order_details?.map((b, i) => (
                              <div className="mb-2" key={i}>
                                <div
                                  className="d-flex align-items-center w-100"
                                >
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
                        <div className="mt-2">
                          <span>{v?.comment}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div
                      className={`alert ${
                        darkMode ? "alert-secondary" : "alert-warning"
                      }`}
                    >
                      No Rejected Orders!
                    </div>
                  )}
                  <div className="col-12">
                    <div className="text-center m-3 p-3">
                      <Paginate
                        values={{ pageCount, currentPage, setCurrentPage }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Helmet>
        <title>Rejected Orders</title>
      </Helmet>
    </>
  );
}

export default RejectedOrders;
