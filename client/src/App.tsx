import { createBrowserRouter, RouterProvider } from "react-router";
import { SnackbarProvider } from "notistack";
import ROUTES from "./route/route";

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
