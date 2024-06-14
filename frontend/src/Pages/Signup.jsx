import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { countryCode, signup } from "../Service/Service";
import { Helmet } from "react-helmet";

function Signup() {
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);
  const token = Cookies.get("token") || "";
  const navigate = useNavigate();
  const [countryCodes, setCountryCodes] = useState([]);

  useEffect(() => {
    if (token !== "") {
      navigate(`/`);
    }
  });

  useEffect(() => {
    countryCode({}).then((r) => {
      if (r?.data?.length > 0 && r?.code === "1") {
        setCountryCodes(r?.data);
      } else {
        setCountryCodes([]);
      }
    });
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
    watch,
  } = useForm({ mode: "onChange" });

  const onSubmit = (values) => {
    console.log(values);
    signup({
      name: values?.name,
      username: values?.username,
      country_code: values?.country_code,
      mobile_number: values?.mobile_number,
      email: values?.email,
      password: values?.password,
    }).then((r) => {
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
    });
  };

  return (
    <>
      <div className="container-fluid m-0 p-0 my-5">
        <div className="row p-0 m-0" id="login-form">
          <div className="col-lg-4 col-12 text-center">
            <h1 className="my-4" id="login-text">
              Sign Up
            </h1>
          </div>
        </div>

        <ToastContainer />

        <div className="row p-0 m-0">
          <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="col-lg-4 col-12 mb-3">
              <input
                type="text"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="usernameHelp"
                placeholder="Name"
                {...register("name", {
                  required: "Please enter a name",
                  minLength: {
                    value: 3,
                    message: "Please enter a valid name",
                  },
                  pattern: {
                    value:
                      /^(?=.{3,}$)[a-zA-Z]+(?:'[a-zA-Z]+)?(?: [a-zA-Z']+(?: -?[a-zA-Z']+)?)*$/,
                    message: "Please enter a valid name",
                  },
                })}
                style={
                  errors?.name
                    ? { backgroundColor: "rgba(255, 0, 0, 0.437)" }
                    : { backgroundColor: "white" }
                }
              />
              {errors?.name && (
                <p className="text-start text-danger m-0 p-0 my-1">
                  <b>{errors?.name?.message}</b>
                </p>
              )}
            </div>

            <div className="col-lg-4 col-12 mb-3">
              <input
                type="text"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="usernameHelp"
                placeholder="Username"
                {...register("username", {
                  required: "Please enter an username",
                  pattern: {
                    value: /^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
                    message: "Please enter a valid username",
                  },
                })}
                style={
                  errors?.username
                    ? { backgroundColor: "rgba(255, 0, 0, 0.437)" }
                    : { backgroundColor: "white" }
                }
              />
              {errors?.username && (
                <p className="text-start text-danger m-0 p-0 my-1">
                  <b>{errors?.username?.message}</b>
                </p>
              )}
            </div>

            <div className="col-lg-4 col-12 mb-3">
              <div
                className="form-control d-flex"
                id="exampleInputEmail1"
                style={
                  errors?.country_code || errors?.mobile_number
                    ? { backgroundColor: "rgba(255, 0, 0, 0.437)" }
                    : { backgroundColor: "white" }
                }
              >
                <select
                  className="border-0 me-2"
                  style={{ backgroundColor: "transparent", width: "15%" }}
                  {...register("country_code", {
                    required: "Please select a country code",
                  })}
                >
                  {countryCodes.length > 0 ? (
                    countryCodes.map((v, i) => (
                      <option value={`+${v?.code}`} key={i}>
                        {`+${v?.code}`}
                      </option>
                    ))
                  ) : (
                    <option value="">No Data!</option>
                  )}
                </select>
                <input
                  type="text"
                  className="border-0"
                  aria-describedby="usernameHelp"
                  placeholder="Mobile number"
                  {...register("mobile_number", {
                    required: "Please enter a mobile number",
                    pattern: {
                      value:
                        /^(?:\+?1\s?)?[-\s\.\(\)]*([0-9]{3})[-\s\.\(\)]*([0-9]{3})[-\s\.\(\)]*([0-9]{4})$/,
                      message: "Please enter a valid mobile number",
                    },
                  })}
                  style={{ backgroundColor: "transparent", width: "85%" }}
                />
              </div>
              {(errors?.country_code || errors?.mobile_number) && (
                <p className="text-start text-danger m-0 p-0 my-1">
                  <b>{errors?.mobile_number?.message}</b>
                </p>
              )}
            </div>

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

            <div className="col-lg-4 col-12 mb-4 position-relative">
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
              {errors?.password && (
                <p className="text-start text-danger m-0 p-0 my-1">
                  <b>{errors?.password?.message}</b>
                </p>
              )}
            </div>

            <div className="col-lg-4 col-12 mb-3">
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Confirm Password"
                {...register("confirm_password", {
                  required: "Please enter confirm password",
                  validate: (val) => {
                    if (watch("password") !== val) {
                      return "Your passwords do no match";
                    }
                  },
                })}
                style={
                  errors?.confirm_password
                    ? { backgroundColor: "rgba(255, 0, 0, 0.437)" }
                    : { backgroundColor: "white" }
                }
              />
              {errors?.confirm_password && (
                <p className="text-start text-danger m-0 p-0 my-1">
                  <b>{errors?.confirm_password?.message}</b>
                </p>
              )}
            </div>

            <div className="mt-4 mb-4">
              <button
                type="submit"
                className="col-lg-4 col-12 btn"
                id="login-btn"
              >
                Signup
              </button>
            </div>

            <div className="col-lg-4 col-12 text-center">
              <Link
                to="/login"
                className="text-start text-secondary-emphasis"
                id="signup-link"
              >
                Do have an account?
              </Link>
            </div>
          </form>
        </div>
      </div>

      <Helmet>
        <title>Signup</title>
      </Helmet>
    </>
  );
}

export default Signup;
