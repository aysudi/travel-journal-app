import { Navigate } from "react-router-dom";
import ClientLayout from "../layout/ClientLayout";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");

  return token ? <ClientLayout /> : <Navigate to="/auth/login" replace />;
};

export default PrivateRoute;
