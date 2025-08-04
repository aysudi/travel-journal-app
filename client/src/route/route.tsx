//auth
import AuthLayout from "../layout/AuthLayout";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ResetPassword from "../pages/Auth/ResetPassword";
import FailedVerification from "../pages/Auth/FailedVerification";
import EmailVerified from "../pages/Auth/EmailVerified";
import CheckEmail from "../pages/Auth/CheckEmail";

//client
import ClientLayout from "../layout/ClientLayout";
import Dashboard from "../pages/Client/Dashboard";
import Explore from "../pages/Client/Explore";
import Journal from "../pages/Client/Journal";
import ListDetails from "../pages/Client/ListDetails";
import Lists from "../pages/Client/Lists";
import Profile from "../pages/Client/Profile";
import { Navigate } from "react-router";

const ROUTES = [
  // Root redirect to login
  {
    path: "/",
    element: <Navigate to="/auth/login" replace />,
  },
  //client routes
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "explore",
        element: <Explore />,
      },
      {
        path: "lists",
        element: <Lists />,
      },
      {
        path: "lists/:listId",
        element: <ListDetails />,
      },
      {
        path: "journal",
        element: <Journal />,
      },
    ],
  },
  //auth routes
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "check-email",
        element: <CheckEmail />,
      },
      {
        path: "verify-email",
        element: <FailedVerification />,
      },
      {
        path: "email-verified",
        element: <EmailVerified />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
    ],
  },
];

export default ROUTES;
