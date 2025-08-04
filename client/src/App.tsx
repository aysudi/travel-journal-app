import { createBrowserRouter, RouterProvider } from "react-router";
import ROUTES from "./route/route";
import { SnackbarProvider } from "notistack";

const router = createBrowserRouter(ROUTES);

function App() {
  return (
    <>
      <SnackbarProvider />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
