import { Navigate } from "react-router-dom";

const RedirectRoot = () => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  } else {
    return <Navigate to="/auth/login" replace />;
  }
};

export default RedirectRoot;
