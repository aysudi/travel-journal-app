//auth
import ForgotPassword from "../pages/Auth/ForgotPassword";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ResetPassword from "../pages/Auth/ResetPassword";

//client
import Dashboard from "../pages/Client/Dashboard";
import Explore from "../pages/Client/Explore";
import Journal from "../pages/Client/Journal";
import ListDetails from "../pages/Client/ListDetails";
import Lists from "../pages/Client/Lists";
import Profile from "../pages/Client/Profile";

const ROUTES = [
  //client routes
  {
    path: "/",
    children: [
      {
        path: "dashboard",
        component: <Dashboard />,
      },
      {
        path: "profile",
        component: <Profile />,
      },
      {
        path: "explore",
        component: <Explore />,
      },
      {
        path: "lists",
        component: <Lists />,
      },
      {
        path: "lists/:listId",
        component: <ListDetails />,
      },
      {
        path: "journal",
        component: <Journal />,
      },
    ],
  },
  //auth routes
  {
    path: "/auth",
    children: [
      {
        path: "/login",
        component: <Login />,
      },
      {
        path: "/register",
        component: <Register />,
      },
      {
        path: "/reset-password",
        component: <ResetPassword />,
      },
      {
        path: "/forgot-password",
        component: <ForgotPassword />,
      },
    ],
  },
];

export default ROUTES;
