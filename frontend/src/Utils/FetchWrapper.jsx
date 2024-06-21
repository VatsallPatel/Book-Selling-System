import Cookies from "js-cookie";
import axios from "axios";

export function FetchWrapper(url, body, method) {
  const token = Cookies.get("token") || "";

  const requestOptions = {
    method: method,
    url: url,
    headers: {
      "api-key": process.env.REACT_APP_API_KEY,
      "accept-language": "en",
      "header-token": token,
    },
    data: body,
  };

  if (!(body instanceof FormData)) {
    requestOptions.headers["Content-Type"] = "application/json";
  }

  return axios(requestOptions)
    .then((response) => {
      return response?.data;
    })
    .catch((error) => {
      if (error?.response?.data?.code === "-1") {
        Cookies.remove("token");
        Cookies.remove("name");
        Cookies.remove("role");

        window.location.href = "/login";
      } else {
        console.log(error);
        return [];
      }
    });
}
