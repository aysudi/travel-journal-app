//auth
import ForgotPassword from "../pages/Auth/ForgotPassword";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ResetPassword from "../pages/Auth/ResetPassword";
import FailedVerification from "../pages/Auth/FailedVerification";
import EmailVerified from "../pages/Auth/EmailVerified";
import CheckEmail from "../pages/Auth/CheckEmail";

//client
import Dashboard from "../pages/Client/Dashboard";
import Explore from "../pages/Client/Explore";
import Journal from "../pages/Client/Journal";
import ListDetails from "../pages/Client/ListDetails";
import Lists from "../pages/Client/Lists";
import Profile from "../pages/Client/Profile";
import RedirectRoot from "./RedirectRoot";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import AuthCallback from "../pages/Auth/AuthCallback";

const ROUTES = [
  // Root redirect to login
  {
    path: "/",
    element: <RedirectRoot />,
  },
  //client routes
  {
    path: "/",
    element: <PrivateRoute />,
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
    element: <PublicRoute />,
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
      {
        path: "success/:token",
        element: <AuthCallback />,
      },
    ],
  },
];

export default ROUTES;
