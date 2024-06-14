import React, { useEffect, useState, useContext } from "react";
import { addToCart, getCart } from "../Service/Service";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DarkModeContext } from "../Context/DarkModeContext";
import Loader from "../Components/Loader";
import { order } from "../Service/Service";
import { Helmet } from "react-helmet";

function Cart() {
  const [cartData, setCartData] = useState([]);
  const { darkMode } = useContext(DarkModeContext);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const charge = 50;

  useEffect(() => {
    getCart().then((r) => {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      setCartData(r?.data);
    });
  }, []);

  const removeItem = (id) => {
    addToCart({ book_id: id, quantity: 0 }).then((r) => {
      if (r?.code === "1") {
        getCart().then((r) => {
          setCartData(r?.data);
        });
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

  function placeOrder() {
    setBtnLoading(true);
    order({ charge: charge }).then((r) => {
      setBtnLoading(false);
      if (r?.code === "1") {
        getCart().then((r) => {
          setCartData(r?.data);
        });
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
  }

  function addQty(id, i) {
    const updatedCart = [...cartData];
    updatedCart[i].qty++;
    setCartData(updatedCart);
    addToCart({ book_id: id, quantity: updatedCart[i].qty }).then((r) => {
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

  function removeQty(id, i) {
    const updatedCart = [...cartData];
    updatedCart[i].qty--;
    if (updatedCart[i].qty === 0) {
      updatedCart.splice(i, 1);
    }
    setCartData(updatedCart);
    addToCart({
      book_id: id,
      quantity: cartData[i]?.qty || 0,
    }).then((r) => {
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

  return (
    <>
      <div
        className="listing"
        style={{ backgroundColor: `${darkMode ? "#333" : "white"}` }}
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
          <div className="row my-0 mx-0 p-0 d-flex justify-content-center">
            <h3
              className={`h3 text-center ${
                darkMode ? "text-white" : "text-dark"
              } w-100 mt-4`}
            >
              My Cart
            </h3>
            <div
              className={`col-md-8 ${
                darkMode ? "bg-dark text-white" : "bg-white text-dark"
              } mt-3 mb-3 p-3`}
            >
              {cartData?.length > 0 ? (
                cartData?.map((v, i) => (
                  <div className="row m-0 border-bottom" key={i}>
                    <div className="col-2 p-3 d-flex align-items-center justify-content-center">
                      <img
                        src={v?.thumbnail_image}
                        alt="thumbnail"
                        className="img-thumbnail"
                      />
                    </div>
                    <h5 className="h5 col-3 m-0 my-auto align-items-center text-center text-con">
                      {v?.title}
                    </h5>
                    <h5 className="h5 m-0 col-2 d-flex align-items-center justify-content-center">
                      ₹{v?.price}
                    </h5>
                    <h5 className="h5 text-success m-0 col-2 d-flex align-items-center justify-content-center">
                      <b>₹{v?.price * v?.qty}</b>
                    </h5>
                    <div className="col-2 p-0 d-flex align-items-center justify-content-center">
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => removeItem(v?.book_id)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="row m-0 mx-auto w-50 my-3 d-flex justify-content-center align-items-center">
                      <div className="col-2 p-0">
                        <button
                          className="btn btn-light w-100 rounded-0"
                          onClick={() => removeQty(v?.book_id, i)}
                        >
                          -
                        </button>
                      </div>
                      <div className="col-2 p-0">
                        <input
                          className="form-control w-100 text-center rounded-0"
                          value={v?.qty}
                        />
                      </div>
                      <div className="col-2 p-0">
                        <button
                          className="btn btn-light w-100 rounded-0"
                          onClick={() => addQty(v?.book_id, i)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  className={`alert ${
                    darkMode ? "alert-secondary" : "alert-warning"
                  }`}
                >
                  No Items in cart!
                </div>
              )}
              {cartData?.length > 0 && (
                <>
                  {!btnLoading ? (
                    <button
                      className="mt-2 btn btn-warning float-end ms-5"
                      onClick={() => placeOrder()}
                    >
                      Place Order
                    </button>
                  ) : (
                    <button className="mt-2 btn btn-warning float-end ms-5" disabled>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Loading...
                    </button>
                  )}

                  <h5 className="mt-3 h5 float-end text-con mb-0 mt-2">
                    <span className="text-danger">₹{charge}</span>
                  </h5>
                  <h5 className="mt-3 h5 float-end text-con mb-0 mt-2 me-4">+</h5>
                  <h5 className="mt-3 h5 float-end text-con mb-0 mt-2 me-4">
                    Total : ₹
                    {cartData?.reduce((a, v) => (a = a + v?.qty * v?.price), 0)}
                  </h5>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <Helmet>
        <title>Cart</title>
      </Helmet>
    </>
  );
}

export default Cart;
