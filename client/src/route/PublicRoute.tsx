import { Navigate } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";

const PublicRoute = () => {
  const token = localStorage.getItem("token");

  return token ? <Navigate to="/dashboard" replace /> : <AuthLayout />;
};

export default PublicRoute;
