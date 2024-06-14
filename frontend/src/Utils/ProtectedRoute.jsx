import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

function Protected({ children }) {
  if (!Cookies.get("token")) {
    return <Navigate to={"/login"} replace />;
  } else {
    return children;
  }
}

export default Protected;
