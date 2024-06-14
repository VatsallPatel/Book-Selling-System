import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { login } from "../Service/Service";
import { Helmet } from "react-helmet";

function UserLogin() {
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);
  const token = Cookies.get("token") || "";
  const navigate = useNavigate();

  useEffect(() => {
    if (token !== "") {
      navigate(`/`);
    }
  }, []);

  const handleToggle = () => {
    if (type === "password") {
      setIcon(eye);
      setType("text");
    } else {
      setIcon(eyeOff);
      setType("password");
    }
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const onSubmit = (values) => {
    login({ email: values?.email, password: values?.password }).then(
      (r) => {
        if (r?.data?.length > 0 && r?.code === "1") {
          Cookies.set("token", r?.data[0]?.token, { expires: 7 });
          Cookies.set("name", r?.data[0]?.name, { expires: 7 });
          Cookies.set("role", r?.data[0]?.role, { expires: 7 });

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
      }
    );
  };

  return (
    <>
      <div className="container-fluid m-0 p-0 mt-5 pt-5">
        <div className="row pt-3 mt-5 m-0 p-0" id="login-form">
          <div className="col-lg-4 col-12 text-center">
            <h1 className="my-4" id="login-text">
              Login
            </h1>
          </div>
        </div>

        <ToastContainer />

        <div className="row m-0 p-0 pt-lg-3">
          <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="col-lg-4 col-12 mb-3">
              <input
                type="text"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Email"
                {...register("email", {
                  required: "Please enter an email",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email address",
                  },
                })}
                style={
                  errors?.email
                    ? { backgroundColor: "rgba(255, 0, 0, 0.437)" }
                    : { backgroundColor: "white" }
                }
              />
              {errors?.email && (
                <p className="text-start text-danger m-0 p-0 my-1">
                  <b>{errors?.email?.message}</b>
                </p>
              )}
            </div>

            <div className="col-lg-4 col-12 mb-4">
              <div className="position-relative">
                <input
                  type={type}
                  name="password"
                  autoComplete="current-password"
                  className="form-control password"
                  id="exampleInputPassword1"
                  placeholder="Password"
                  {...register("password", {
                    required: "Please enter password",
                    pattern: {
                      value:
                        /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/,
                      message:
                        "Password requirements: 8-20 characters, 1 number, 1 letter, 1 symbol.",
                    },
                  })}
                  style={
                    errors?.password
                      ? { backgroundColor: "rgba(255, 0, 0, 0.437)" }
                      : { backgroundColor: "white" }
                  }
                />
                <Icon
                  className="position-absolute bi btn"
                  icon={icon}
                  size={25}
                  onClick={handleToggle}
                />
              </div>
              {errors?.password && (
                <p className="text-start text-danger m-0 p-0 my-1">
                  <b>{errors?.password?.message}</b>
                </p>
              )}
            </div>

            <div className="col-12 mt-4 mb-4">
              <button
                type="submit"
                className="col-lg-4 col-12 btn"
                id="login-btn"
              >
                Login
              </button>
            </div>

            <div className="col-lg-4 col-12 text-center">
              <Link
                to="/signup"
                className="text-start text-secondary-emphasis"
                id="signup-link"
              >
                Don't have an account?
              </Link>
            </div>
          </form>
        </div>
      </div>

      <Helmet>
        <title>Login</title>
      </Helmet>
    </>
  );
}

export default UserLogin;
