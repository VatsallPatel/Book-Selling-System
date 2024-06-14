import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DarkModeContext } from "../Context/DarkModeContext";
import { useForm } from "react-hook-form";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { editDetails } from "../Service/Service";
import { Helmet } from "react-helmet";
import Cookies from "js-cookie";

function EditBookDetails() {
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;
  const role = Cookies.get("role") || "";

  useEffect(() => {
    if (role !== "admin") {
      navigate(`/`);
    }
  }, []);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const onSubmit = (values) => {
    editDetails({ id: data?.id, price: values?.price }).then((r) => {
      if (r?.code === "1") {
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

        setTimeout(() => {
          navigate(`/`);
        }, 1000);
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
  };

  return (
    <>
      <div
        className="d-flex align-items-center justify-content-center listing col-10"
        style={{ backgroundColor: darkMode ? "#333" : "transparent" }}
      >
        <ToastContainer />
        <div className="row w-100 p-0 m-0">
          <div
            className="row m-0 p-0"
            style={{ backgroundColor: darkMode ? "#333" : "transparent" }}
            id="login-form"
          >
            <div className="col-lg-4 col-12 text-center">
              <h1 className={`${darkMode && "text-white"}`} id="login-text">
                Edit Book
              </h1>
            </div>
          </div>

          <form
            id="login-form"
            style={{ backgroundColor: darkMode ? "#333" : "transparent" }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="col-lg-4 col-12 mb-3">
              <input
                type="text"
                className={`form-control ${
                  !errors.price &&
                  (darkMode ? "bg-secondary color-placeholder" : "bg-white")
                }`}
                id={`${darkMode ? "email1" : "exampleInputEmail1"}`}
                aria-describedby="emailHelp"
                defaultValue={data?.price}
                placeholder="Price"
                {...register("price", {
                  required: "Please enter a price",
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: "Please enter a valid price",
                  },
                })}
                style={
                  errors?.price
                    ? { backgroundColor: "rgba(255, 0, 0, 0.6)" }
                    : { backgroundColor: "white" }
                }
              />
              {errors?.price && (
                <p className="text-start text-danger m-0 p-0 my-1">
                  <b>{errors?.price?.message}</b>
                </p>
              )}
            </div>

            <div className="row">
              <div className="mt-4">
                <button
                  type="submit"
                  className="col-lg-4 col-12 btn"
                  id={`${darkMode ? "edit-btn" : "login-btn"}`}
                >
                  Edit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Helmet>
        <title>Edit Book</title>
      </Helmet>
    </>
  );
}

export default EditBookDetails;
